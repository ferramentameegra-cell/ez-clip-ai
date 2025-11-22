import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq, sql } from 'drizzle-orm';

/**
 * Decrementa créditos do usuário após processar job
 */
export async function decrementUserCredits(userId: number, quantity: number = 1): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db
    .update(users)
    .set({ credits: sql`credits - ${quantity}` })
    .where(eq(users.id, userId));

  console.log(`[Credits] Usuário ${userId} perdeu ${quantity} crédito(s)`);
}

/**
 * Verifica se usuário tem créditos suficientes
 */
export async function hasEnoughCredits(userId: number, amount: number = 1): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const user = await db
    .select({ credits: users.credits })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return (user[0]?.credits || 0) >= amount;
}

