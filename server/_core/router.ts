import { router } from './trpc';
import { userContentRouter } from '../routers/userContent';
import { videoRouter } from '../routers/video';
import { scheduleRouter } from '../routers/schedule';
import { authRouter } from '../routers/auth';
import { paymentRouter } from '../routers/payment';
import { oauthRouter } from '../routers/oauth';
import { onboardingRouter } from '../routers/onboarding';
import { adminRouter } from '../routers/admin';
import { startScheduler } from '../scheduler';

// Iniciar scheduler ao carregar o módulo
startScheduler();

export const appRouter = router({
  auth: authRouter,
  userContent: userContentRouter,
  video: videoRouter,
  schedule: scheduleRouter,
  payment: paymentRouter,
  oauth: oauthRouter,
  onboarding: onboardingRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;

