import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

export function Onboarding() {
  const [, setLocation] = useLocation();
  const [useCase, setUseCase] = useState('');
  const [niche, setNiche] = useState('');

  // Verificar se já completou onboarding
  const { data: onboardingCheck, isLoading: isLoadingCheck } = trpc.onboarding.check.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const completeMutation = trpc.onboarding.complete.useMutation();

  // Se já completou onboarding, redirecionar para dashboard
  useEffect(() => {
    if (!isLoadingCheck && onboardingCheck?.completed) {
      console.log('[Onboarding] Já completado, redirecionando para dashboard');
      setLocation('/dashboard');
    }
  }, [onboardingCheck, isLoadingCheck, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!useCase.trim() || !niche.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    try {
      await completeMutation.mutateAsync({
        useCase: useCase.trim(),
        niche: niche.trim(),
      });

      toast.success('Onboarding concluído! Bem-vindo ao EZ Clip AI! 🎉');
      // Redirecionar para dashboard após completar
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar onboarding. Tente novamente.');
    }
  };

  // Mostrar loading enquanto verifica
  if (isLoadingCheck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <div>Verificando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="h-12 w-12 text-purple-600" />
          </div>
          <CardTitle className="text-3xl font-bold mb-2">
            Bem-vindo ao EZ Clip AI! 🎯
          </CardTitle>
          <CardDescription className="text-lg">
            Responda rapidinho para personalizarmos sua experiência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="useCase" className="text-base font-semibold">
                Para que você usará o site?
              </Label>
              <Input
                id="useCase"
                type="text"
                placeholder="Ex.: Criar clipes para meu canal no YouTube"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="text-base"
                required
                minLength={5}
              />
              <p className="text-sm text-gray-500">
                Descreva brevemente o objetivo do uso da plataforma
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="niche" className="text-base font-semibold">
                Qual é o seu nicho?
              </Label>
              <Input
                id="niche"
                type="text"
                placeholder="Ex.: Direito, Marketing, Finanças, Educação..."
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="text-base"
                required
                minLength={2}
              />
              <p className="text-sm text-gray-500">
                Qual área ou tema você trabalha/compartilha conteúdo?
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={completeMutation.isPending}
            >
              {completeMutation.isPending ? 'Salvando...' : 'Continuar →'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

