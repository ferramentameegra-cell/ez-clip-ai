import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './trpc';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        retryDelay: 1000,
        staleTime: 5 * 60 * 1000, // 5 minutos
      },
      mutations: {
        retry: false, // Não retry em mutations
        onError: (error) => {
          console.error('[QueryClient] Erro em mutation:', error);
        },
      },
    },
  }));

  const [trpcClient] = useState(() => {
    // Usar variável de ambiente no build, ou fallback para URL relativa/produção
    // @ts-ignore - import.meta.env é injetado pelo Vite
    const trpcUrl = import.meta.env?.VITE_TRPC_URL || 
                    (typeof window !== 'undefined' ? window.location.origin + '/trpc' : 'http://localhost:3001/trpc');
    
    console.log('[tRPC] Configurando cliente com URL:', trpcUrl);
    
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: trpcUrl,
          headers: () => {
            const token = localStorage.getItem('token');
            const headers: Record<string, string> = {
              'Content-Type': 'application/json',
            };
            if (token) {
              headers['authorization'] = `Bearer ${token}`;
            }
            return headers;
          },
          fetch: async (url, options) => {
            const startTime = Date.now();
            console.log('[tRPC] 📤 Enviando requisição:', {
              url,
              method: options?.method,
              hasBody: !!options?.body,
            });
            
            try {
              // Criar AbortController para timeout
              const controller = new AbortController();
              const timeoutId = setTimeout(() => {
                controller.abort();
              }, 60000); // 60 segundos de timeout (aumentado para dar tempo ao banco)
              
              const response = await fetch(url, {
                ...options,
                signal: controller.signal,
              });
              
              clearTimeout(timeoutId);
              
              const duration = Date.now() - startTime;
              console.log('[tRPC] 📥 Resposta recebida:', {
                status: response.status,
                statusText: response.statusText,
                duration: `${duration}ms`,
                headers: Object.fromEntries(response.headers.entries()),
              });
              
              // Verificar se a resposta é válida
              if (!response.ok) {
                const text = await response.text();
                console.error('[tRPC] ❌ Erro na resposta:', {
                  status: response.status,
                  statusText: response.statusText,
                  body: text.substring(0, 500), // Primeiros 500 caracteres
                });
              }
              
              return response;
            } catch (error: any) {
              const duration = Date.now() - startTime;
              console.error('[tRPC] ❌ Erro no fetch:', {
                error: error.message,
                name: error.name,
                duration: `${duration}ms`,
                url,
              });
              
              if (error.name === 'AbortError') {
                throw new Error('Timeout: A requisição demorou mais de 60 segundos. Isso pode indicar problema de conexão com o banco de dados.');
              }
              
              throw error;
            }
          },
        }),
      ],
    });
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
