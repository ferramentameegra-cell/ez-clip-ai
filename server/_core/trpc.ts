import { initTRPC, TRPCError } from '@trpc/server';

/**
 * Context do tRPC
 */
export interface Context {
  user?: {
    id: number;
    email?: string;
  };
}

/**
 * Inicializar tRPC
 */
const t = initTRPC.context<Context>().create();

/**
 * Exportar procedimentos
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Procedimento protegido - requer autenticação
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED',
      message: 'Você precisa estar autenticado para acessar este recurso'
    });
  }
  return next({ 
    ctx: { 
      ...ctx, 
      user: ctx.user 
    } 
  });
});

