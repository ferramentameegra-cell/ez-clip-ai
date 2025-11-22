import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useI18n } from '@/hooks/useI18n';

export function Login() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  
  const isLoading = loginMutation.isPending || registerMutation.isPending;

  // Verificar se há um job pendente
  useEffect(() => {
    const pendingJob = localStorage.getItem('pendingJob');
    if (pendingJob) {
      toast.info('Complete seu cadastro para processar o vídeo');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const result = await loginMutation.mutateAsync({
          email,
          password,
        });
        
        // Salvar token e usuário
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        toast.success(t('login.enter') + ' realizado com sucesso!');
      } else {
        const result = await registerMutation.mutateAsync({
          email,
          password,
          name,
        });
        
        // Salvar token e usuário
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        toast.success(t('login.createAccountButton') + ' realizado com sucesso! Você ganhou 3 créditos grátis!');
      }

      // Verificar se há job pendente
      const pendingJob = localStorage.getItem('pendingJob');
      if (pendingJob) {
        // Redirecionar para criar o job
        setLocation('/');
        // O job será criado automaticamente quando a página carregar
      } else {
        setLocation('/');
      }
    } catch (error: any) {
      // Melhorar mensagem de erro
      let errorMessage = error.message || t('common.error');
      
      // Verificar se é erro de conexão com banco
      if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('Database') || errorMessage.includes('connection')) {
        errorMessage = '❌ Erro: MySQL não está instalado ou não está rodando. Por favor, instale o MySQL primeiro. Veja o arquivo LEIA_ISTO_PRIMEIRO.md para instruções.';
      }
      
      toast.error(errorMessage);
      console.error('Erro ao fazer login/registro:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              {isLogin ? t('login.welcome') : t('login.createAccount')}
            </CardTitle>
            <CardDescription className="mt-2">
              {isLogin 
                ? t('login.enterToProcess')
                : t('login.startNow')}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t('login.fullName')}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="h-12"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t('login.email')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {t('login.password')}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-12"
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
                  {t('login.forgotPassword')}
                </Link>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={isLoading}
            >
              {isLoading ? t('login.loading') : isLogin ? t('login.enter') : t('login.createAccountButton')}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? t('login.noAccount') + ' ' : t('login.hasAccount') + ' '}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail('');
                  setPassword('');
                  setName('');
                }}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? t('login.register') : t('login.doLogin')}
              </button>
            </div>
          </form>

          {!isLogin && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                🎁 {t('login.freeCredits')}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {t('login.processVideos')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

