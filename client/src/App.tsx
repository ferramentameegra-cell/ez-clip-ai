import { Route, Switch, Router, useLocation } from 'wouter';
import { Home } from '@/pages/Home';
import { MyRetentionVideos } from '@/pages/MyRetentionVideos';
import { JobsList } from '@/pages/JobsList';
import { JobDetail } from '@/pages/JobDetail';
import { Login } from '@/pages/Login';
import { Profile } from '@/pages/Profile';
import { Settings } from '@/pages/Settings';
import { Education } from '@/pages/Education';
import { TermsOfUse } from '@/pages/TermsOfUse';
import { Billing } from '@/pages/Billing';
import { TRPCProvider } from '@/lib/trpc-client.tsx';
import { Toaster } from 'sonner';
import { Header } from '@/components/Header';

function AppContent() {
  const [location] = useLocation();
  const showHeader = location !== '/login';

  return (
    <div className="min-h-screen bg-white">
      {showHeader && <Header />}
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/profile" component={Profile} />
          <Route path="/settings" component={Settings} />
          <Route path="/education" component={Education} />
          <Route path="/my-retention-videos" component={MyRetentionVideos} />
          <Route path="/jobs/:id" component={JobDetail} />
          <Route path="/jobs" component={JobsList} />
          <Route path="/terms" component={TermsOfUse} />
          <Route path="/billing" component={Billing} />
        <Route>
          <div className="container mx-auto py-16 px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">404 - Página não encontrada</h1>
            <a href="/" className="text-purple-600 hover:underline">
              Voltar para a página inicial
            </a>
          </div>
        </Route>
      </Switch>
    </div>
  );
}

export function App() {
  return (
    <TRPCProvider>
      <Toaster position="top-right" />
      <Router>
        <AppContent />
      </Router>
    </TRPCProvider>
  );
}

