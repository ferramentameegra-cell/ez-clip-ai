import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { getDb } from '../db';
import { scheduledPosts } from '../../drizzle/schema';
import { eq, and, asc } from 'drizzle-orm';

// Usando protectedProcedure - requer autenticação

export const scheduleRouter = router({
  // Criar agendamento
  create: protectedProcedure
    .input(z.object({
      clipId: z.number(),
      platform: z.enum(['youtube', 'tiktok', 'instagram', 'facebook']),
      scheduledTime: z.date()
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const userId = ctx.user.id;

      const result = await db.insert(scheduledPosts).values({
        clipId: input.clipId,
        userId: userId,
        platform: input.platform,
        scheduledTime: input.scheduledTime,
        status: 'pending'
      });

      const postId = Number(result[0].insertId);

      return { success: true, postId };
    }),

  // Listar agendamentos
  list: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const userId = ctx.user.id;

      return await db
        .select()
        .from(scheduledPosts)
        .where(eq(scheduledPosts.userId, userId))
        .orderBy(asc(scheduledPosts.scheduledTime));
    }),

  // Cancelar agendamento
  cancel: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const userId = ctx.user.id;

      await db
        .update(scheduledPosts)
        .set({ status: 'cancelled' })
        .where(
          and(
            eq(scheduledPosts.id, input.postId),
            eq(scheduledPosts.userId, userId)
          )
        );

      return { success: true };
    })
});

