import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useTheme } from '@/contexts/ThemeContext';

export function Login() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  
  // Timeout de segurança para garantir que loading sempre finalize
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loginMutation = trpc.auth.login.useMutation({
    onMutate: () => {
      console.log('[Login] Iniciando login...', { email: email.trim().toLowerCase() });
      
      // Timeout de segurança: se após 60 segundos não houver resposta, forçar finalização
      timeoutRef.current = setTimeout(() => {
        console.error('[Login] ⚠️ TIMEOUT: Login demorou mais de 60 segundos');
        toast.error('A requisição está demorando muito. Isso pode indicar problema de conexão com o banco de dados. Tente novamente em alguns instantes.');
      }, 60000);
    },
    onSuccess: (result) => {
      // Limpar timeout se ainda estiver ativo
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      console.log('[Login] ✅ Login bem-sucedido!', { 
        hasToken: !!result.token,
        hasUser: !!result.user,
        userId: result.user?.id 
      });
      
      try {
        // Salvar dados no localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        console.log('[Login] ✅ Dados salvos no localStorage');
        
        // Verificar se foi salvo corretamente
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (!savedToken || !savedUser) {
          throw new Error('Falha ao salvar dados no localStorage');
        }
        
        console.log('[Login] ✅ Dados confirmados no localStorage');
        toast.success(t('login.loginSuccess'));
        
        // Redirecionar após pequeno delay para garantir que tudo foi salvo
        setTimeout(() => {
          console.log('[Login] 🔄 Redirecionando para /onboarding...');
          window.location.href = '/onboarding';
        }, 300);
      } catch (error: any) {
        console.error('[Login] ❌ Erro ao salvar dados:', error);
        toast.error(error.message || 'Erro ao fazer login. Tente novamente.');
      }
    },
    onError: (error) => {
      // Limpar timeout se ainda estiver ativo
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      console.error('[Login] ❌ Erro na mutation:', error);
      console.error('[Login] Detalhes completos do erro:', {
        message: error.message,
        code: error.data?.code,
        httpStatus: error.data?.httpStatus,
        data: error.data,
        shape: error.shape,
      });
      
      // Mensagem de erro mais amigável
      let errorMessage = t('login.loginError');
      if (error.message) {
        errorMessage = error.message;
      } else if (error.data?.code === 'UNAUTHORIZED') {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.data?.httpStatus === 500) {
        errorMessage = 'Erro no servidor. Tente novamente em alguns instantes.';
      } else if (error.message?.includes('Timeout')) {
        errorMessage = 'A requisição demorou muito. Verifique sua conexão.';
      }
      
      toast.error(errorMessage);
    },
    onSettled: () => {
      // Limpar timeout se ainda estiver ativo
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      console.log('[Login] ⏹️ Mutation finalizada (sucesso ou erro)');
    },
  });

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = t('login.validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('login.validation.emailInvalid');
    }

    if (!password) {
      newErrors.password = t('login.validation.passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Login] 📝 Formulário submetido');

    if (!validateForm()) {
      console.log('[Login] ⚠️ Validação falhou');
      return;
    }

    console.log('[Login] ✅ Validação passou, enviando requisição...');
    
    try {
      loginMutation.mutate({
        email: email.trim().toLowerCase(),
        password,
      });
    } catch (error) {
      console.error('[Login] ❌ Erro ao chamar mutation:', error);
      toast.error('Erro inesperado. Tente novamente.');
    }
  };

  // Limpar timeout ao desmontar componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const isLoading = loginMutation.isPending;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <Card className={`w-full max-w-md ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <CardTitle className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('login.title')}
          </CardTitle>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('login.subtitle')}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="email" className={isDark ? 'text-gray-300' : ''}>
                {t('login.form.email')}
              </Label>
              <div className="relative mt-1">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder={t('login.form.emailPlaceholder')}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <Label htmlFor="password" className={isDark ? 'text-gray-300' : ''}>
                {t('login.form.password')}
              </Label>
              <div className="relative mt-1">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder={t('login.form.passwordPlaceholder')}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Esqueci a senha */}
            <div className="text-right">
              <Link href="/forgot-password" className={`text-sm ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
                {t('login.forgotPassword')}
              </Link>
            </div>

            {/* Botão Submit */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('login.loading')}
                </>
              ) : (
                t('login.form.submit')
              )}
            </Button>
            
            {/* Mensagem de erro adicional (se houver) */}
            {loginMutation.isError && (
              <div className="mt-2 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {loginMutation.error?.message || 'Erro ao fazer login. Tente novamente.'}
                </p>
              </div>
            )}
          </form>

          {/* Link para Signup */}
          <div className={`mt-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('login.noAccount')}{' '}
            <Link href="/signup" className="text-indigo-600 hover:underline font-semibold">
              {t('login.signupLink')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
