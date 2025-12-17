/**
 * Página de Login - Design Completamente Novo
 * Visual moderno, clean e intuitivo
 * Foco em facilidade de uso e experiência do usuário
 */

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  Lock, 
  Loader2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import { trpc } from '@/lib/trpc';

export function Login() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [, setLocation] = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isFocused, setIsFocused] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });

  const isSubmittingRef = useRef(false);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (result) => {
      console.log('[Login] ✅ Login bem-sucedido:', { userId: result.user.id, email: result.user.email });
      
      try {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Salvar "Lembrar-me" se marcado
        if (rememberMe) {
          localStorage.setItem('rememberEmail', email.trim().toLowerCase());
        } else {
          localStorage.removeItem('rememberEmail');
        }
      } catch (storageError) {
        console.error('[Login] Erro ao salvar no localStorage:', storageError);
        toast.error('Erro ao salvar dados. Tente novamente.');
        isSubmittingRef.current = false;
        return;
      }

      isSubmittingRef.current = false;
      toast.success(t('login.loginSuccess'));

      // Redirecionar
      setTimeout(() => {
        setLocation('/onboarding');
      }, 300);
    },
    onError: (error) => {
      console.error('[Login] ❌ Erro no login:', error);
      isSubmittingRef.current = false;
      
      // Mensagens de erro específicas e amigáveis
      if (error.message?.includes('incorretos') || error.message?.includes('inválidos')) {
        toast.error('Email ou senha incorretos. Verifique suas credenciais e tente novamente.');
        setErrors({ password: 'Email ou senha incorretos' });
      } else if (error.message?.includes('método')) {
        toast.error('Esta conta foi criada com outro método de login.');
      } else if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
        toast.error('A requisição demorou muito. Verifique sua conexão e tente novamente.');
      } else {
        toast.error(error.message || 'Erro ao fazer login. Tente novamente.');
      }
    },
  });

  // Carregar email salvo ao montar
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      isSubmittingRef.current = false;
    };
  }, []);

  const validateForm = (): boolean => {
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

    if (isSubmittingRef.current || loginMutation.isPending) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    isSubmittingRef.current = true;
    setErrors({}); // Limpar erros anteriores
    
    console.log('[Login] Iniciando login...');
    console.log('[Login] Email:', email.trim().toLowerCase());

    loginMutation.mutate({
      email: email.trim().toLowerCase(),
      password,
    });
  };

  const isLoading = loginMutation.isPending;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-indigo-500' : 'bg-indigo-400'}`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-purple-500' : 'bg-purple-400'}`}></div>
      </div>

      {/* Container principal */}
      <div className="relative w-full max-w-md">
        {/* Card de login */}
        <div className={`${isDark ? 'bg-slate-800/95 backdrop-blur-xl border-slate-700/50' : 'bg-white/95 backdrop-blur-xl border-gray-200/50'} rounded-2xl shadow-2xl border p-8 lg:p-10`}>
          {/* Header */}
          <div className="text-center mb-8">
            {/* Logo/Ícone */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 mb-4 shadow-lg transform transition-transform hover:scale-105">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Bem-vindo de volta
            </h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Entre na sua conta para continuar
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Email
              </Label>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isFocused.email ? 'text-indigo-600' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Mail className="w-5 h-5" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  onFocus={() => setIsFocused({ ...isFocused, email: true })}
                  onBlur={() => setIsFocused({ ...isFocused, email: false })}
                  className={`pl-12 h-12 rounded-xl transition-all ${
                    errors.email 
                      ? 'border-red-500 focus-visible:ring-red-500' 
                      : isFocused.email
                      ? 'border-indigo-500 focus-visible:ring-indigo-500'
                      : ''
                  } ${
                    isDark 
                      ? 'bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                  }`}
                  placeholder="seu@email.com"
                  disabled={isLoading}
                  autoComplete="email"
                />
                {email && !errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                {errors.email && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label 
                  htmlFor="password" 
                  className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Senha
                </Label>
                <Link 
                  href="/forgot-password" 
                  className={`text-sm font-medium transition-colors ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isFocused.password ? 'text-indigo-600' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  onFocus={() => setIsFocused({ ...isFocused, password: true })}
                  onBlur={() => setIsFocused({ ...isFocused, password: false })}
                  className={`pl-12 pr-12 h-12 rounded-xl transition-all ${
                    errors.password 
                      ? 'border-red-500 focus-visible:ring-red-500' 
                      : isFocused.password
                      ? 'border-indigo-500 focus-visible:ring-indigo-500'
                      : ''
                  } ${
                    isDark 
                      ? 'bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-gray-300' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {errors.password && (
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 text-red-500">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Lembrar-me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2 transition-all cursor-pointer"
                  disabled={isLoading}
                />
                <span className={`text-sm transition-colors ${isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'}`}>
                  Lembrar-me
                </span>
              </label>
            </div>

            {/* Botão Submit */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Divisor */}
          <div className="relative my-8">
            <div className={`absolute inset-0 flex items-center ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
              <div className={`w-full border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${isDark ? 'bg-slate-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                ou
              </span>
            </div>
          </div>

          {/* Link para Signup */}
          <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className="text-sm">
              Não tem uma conta?{' '}
              <Link 
                href="/signup" 
                className={`font-semibold transition-colors inline-flex items-center gap-1 ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
              >
                Criar conta
                <Zap className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </div>

        {/* Features/Benefícios */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'} rounded-xl border p-4 text-center backdrop-blur-sm`}>
            <Zap className={`w-6 h-6 mx-auto mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Rápido e seguro
            </p>
          </div>
          <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'} rounded-xl border p-4 text-center backdrop-blur-sm`}>
            <Sparkles className={`w-6 h-6 mx-auto mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              IA avançada
            </p>
          </div>
          <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'} rounded-xl border p-4 text-center backdrop-blur-sm`}>
            <CheckCircle2 className={`w-6 h-6 mx-auto mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              100% confiável
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
