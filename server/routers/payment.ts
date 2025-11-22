import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import Stripe from 'stripe';
import { getDb } from '../db';
import { users } from '../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';

// Inicializar Stripe (apenas se a chave estiver configurada)
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
  });
}

// Planos de créditos
export const CREDIT_PLANS = [
  { id: 'pack_10', name: 'Pack 10 Créditos', credits: 10, price: 29.90, priceId: 'price_10_credits' },
  { id: 'pack_50', name: 'Pack 50 Créditos', credits: 50, price: 99.90, priceId: 'price_50_credits' },
  { id: 'pack_100', name: 'Pack 100 Créditos', credits: 100, price: 149.90, priceId: 'price_100_credits' },
  { id: 'pack_500', name: 'Pack 500 Créditos', credits: 500, price: 499.90, priceId: 'price_500_credits' },
];

export const paymentRouter = router({
  // Obter planos disponíveis
  getPlans: protectedProcedure.query(async () => {
    return CREDIT_PLANS;
  }),

  // Criar sessão de checkout
  createCheckoutSession: protectedProcedure
    .input(z.object({
      planId: z.enum(['pack_10', 'pack_50', 'pack_100', 'pack_500']),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!stripe) {
        throw new Error('Stripe não está configurado. Configure STRIPE_SECRET_KEY no .env');
      }

      const userId = ctx.user.id;
      const plan = CREDIT_PLANS.find(p => p.id === input.planId);
      
      if (!plan) {
        throw new Error('Plano não encontrado');
      }

      // Obter email do usuário
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [user] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user?.email) {
        throw new Error('Email do usuário não encontrado');
      }

      // Criar sessão de checkout no Stripe
      const session = await stripe!.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: plan.name,
                description: `${plan.credits} créditos para processar vídeos`,
              },
              unit_amount: Math.round(plan.price * 100), // Stripe usa centavos
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/billing?canceled=true`,
        customer_email: user.email,
        metadata: {
          userId: userId.toString(),
          planId: plan.id,
          credits: plan.credits.toString(),
        },
      });

      return { sessionId: session.id, url: session.url };
    }),

  // Verificar status do pagamento
  verifyPayment: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      if (!stripe) {
        throw new Error('Stripe não está configurado');
      }

      const userId = ctx.user.id;

      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);

        if (session.metadata?.userId !== userId.toString()) {
          throw new Error('Sessão não pertence a este usuário');
        }

        if (session.payment_status === 'paid') {
          // Verificar se os créditos já foram adicionados
          const db = await getDb();
          if (!db) throw new Error('Database not available');

          // Adicionar créditos ao usuário
          const creditsToAdd = parseInt(session.metadata?.credits || '0');
          
          await db
            .update(users)
            .set({
              credits: sql`credits + ${creditsToAdd}`,
            })
            .where(eq(users.id, userId));

          return {
            success: true,
            credits: creditsToAdd,
            message: 'Pagamento confirmado e créditos adicionados!',
          };
        }

        return {
          success: false,
          status: session.payment_status,
          message: 'Pagamento ainda não foi confirmado',
        };
      } catch (error: any) {
        throw new Error(`Erro ao verificar pagamento: ${error.message}`);
      }
    }),

  // Obter histórico de transações (futuro)
  getTransactions: protectedProcedure.query(async () => {
    // TODO: Implementar quando tiver tabela de transações
    return [];
  }),
});

