import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireOnboarding = false,
  requireAdmin = false 
}: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // Verificar autenticação
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  // Verificar onboarding se necessário
  const { data: onboardingData, isLoading: isLoadingOnboarding, error: onboardingError } = trpc.onboarding.check.useQuery(undefined, {
    enabled: requireOnboarding && !!token,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 30000, // Cache por 30 segundos
    gcTime: 60000, // Manter em cache por 1 minuto
  });

  // Verificar perfil (para role admin)
  const { data: profileData, isLoading: isLoadingProfile, error: profileError } = trpc.auth.getProfile.useQuery(undefined, {
    enabled: requireAdmin && !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    console.log('[ProtectedRoute] Verificando acesso...', {
      hasToken: !!token,
      hasUser: !!userStr,
      requireOnboarding,
      requireAdmin,
      isLoadingOnboarding,
      isLoadingProfile,
      onboardingError: !!onboardingError,
      profileError: !!profileError,
    });

    setIsChecking(true);

    // Se não está autenticado
    if (!token || !userStr) {
      console.log('[ProtectedRoute] Não autenticado, redirecionando para login');
      setRedirectTo('/login');
      setIsChecking(false);
      return;
    }

    // Se precisa de onboarding, aguardar query terminar
    if (requireOnboarding) {
      if (isLoadingOnboarding) {
        console.log('[ProtectedRoute] Aguardando verificação de onboarding...');
        // Ainda carregando, aguardar
        return;
      }
      
      if (onboardingError) {
        console.error('[ProtectedRoute] Erro ao verificar onboarding:', onboardingError);
        // Se der erro, redirecionar para onboarding para garantir
        setRedirectTo('/onboarding');
        setIsChecking(false);
        return;
      }
      
      // Se não tem dados ainda, aguardar
      if (onboardingData === undefined) {
        console.log('[ProtectedRoute] Dados de onboarding ainda não disponíveis');
        return;
      }
      
      if (!onboardingData.completed) {
        console.log('[ProtectedRoute] Onboarding não completado, redirecionando...');
        setRedirectTo('/onboarding');
        setIsChecking(false);
        return;
      }
      
      console.log('[ProtectedRoute] Onboarding completado, permitindo acesso');
    }

    // Se precisa ser admin, aguardar query terminar
    if (requireAdmin) {
      if (isLoadingProfile) {
        console.log('[ProtectedRoute] Aguardando verificação de perfil...');
        // Ainda carregando, aguardar
        return;
      }
      
      if (profileError) {
        console.error('[ProtectedRoute] Erro ao verificar perfil:', profileError);
        setRedirectTo('/');
        setIsChecking(false);
        return;
      }
      
      if (profileData === undefined) {
        console.log('[ProtectedRoute] Dados de perfil ainda não disponíveis');
        return;
      }
      
      if (profileData.role !== 'admin') {
        console.log('[ProtectedRoute] Usuário não é admin, redirecionando...');
        setRedirectTo('/');
        setIsChecking(false);
        return;
      }
      
      console.log('[ProtectedRoute] Usuário é admin, permitindo acesso');
    }

    // Tudo OK, permitir acesso
    console.log('[ProtectedRoute] Acesso permitido');
    setIsChecking(false);
    setRedirectTo(null);
  }, [token, userStr, requireOnboarding, requireAdmin, onboardingData, profileData, isLoadingOnboarding, isLoadingProfile, onboardingError, profileError]);

  useEffect(() => {
    if (redirectTo) {
      setLocation(redirectTo);
    }
  }, [redirectTo, setLocation]);

  // Timeout para evitar travamento infinito
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isChecking) {
        console.warn('[ProtectedRoute] Timeout na verificação, redirecionando para login');
        setRedirectTo('/login');
        setIsChecking(false);
      }
    }, 10000); // 10 segundos de timeout

    return () => clearTimeout(timeout);
  }, [isChecking]);

  if (isChecking || redirectTo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div>Carregando...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

