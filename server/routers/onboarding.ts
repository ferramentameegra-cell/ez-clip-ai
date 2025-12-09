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

      try {
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
      } catch (error: any) {
        // Se colunas não existem, retornar como não completado
        if (error.message?.includes('onboarding') || error.code === 'ER_BAD_FIELD_ERROR') {
          return {
            completed: false,
            useCase: null,
            niche: null,
          };
        }
        throw error;
      }
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

      try {
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
      } catch (error: any) {
        // Se colunas não existem, usar SQL direto para adicionar
        if (error.message?.includes('onboarding') || error.code === 'ER_BAD_FIELD_ERROR') {
          // Tentar adicionar colunas se não existirem
          const connection = await import('mysql2/promise');
          const mysqlDb = await connection.default.createConnection({
            uri: process.env.DATABASE_URL,
          });

          try {
            // Tentar adicionar colunas
            await mysqlDb.execute('ALTER TABLE users ADD COLUMN onboarding_use_case TEXT');
          } catch (e: any) {
            // Ignorar se já existe
          }
          try {
            await mysqlDb.execute('ALTER TABLE users ADD COLUMN onboarding_niche VARCHAR(255)');
          } catch (e: any) {
            // Ignorar se já existe
          }
          try {
            await mysqlDb.execute('ALTER TABLE users ADD COLUMN onboarding_at TIMESTAMP NULL');
          } catch (e: any) {
            // Ignorar se já existe
          }

          // Agora atualizar
          await mysqlDb.execute(
            'UPDATE users SET onboarding_use_case = ?, onboarding_niche = ?, onboarding_at = ?, updated_at = NOW() WHERE id = ?',
            [input.useCase, input.niche, new Date(), userId]
          );

          await mysqlDb.end();

          return { success: true };
        }

        throw error;
      }
    }),
});

