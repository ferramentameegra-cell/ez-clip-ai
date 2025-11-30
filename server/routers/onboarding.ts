import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { getDb } from '../db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

export const onboardingRouter = router({
  // Verificar se usuário já completou onboarding
  check: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const userId = ctx.user.id;
      const [user] = await db
        .select({
          onboardingAt: users.onboardingAt,
          onboardingUseCase: users.onboardingUseCase,
          onboardingNiche: users.onboardingNiche,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      return {
        completed: !!user?.onboardingAt,
        useCase: user?.onboardingUseCase || null,
        niche: user?.onboardingNiche || null,
      };
    }),

  // Salvar respostas do onboarding
  complete: protectedProcedure
    .input(z.object({
      useCase: z.string().min(5, 'Descreva para que usará o site (mínimo 5 caracteres)'),
      niche: z.string().min(2, 'Informe seu nicho (mínimo 2 caracteres)'),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const userId = ctx.user.id;

      await db
        .update(users)
        .set({
          onboardingUseCase: input.useCase,
          onboardingNiche: input.niche,
          onboardingAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return { success: true };
    }),
});

