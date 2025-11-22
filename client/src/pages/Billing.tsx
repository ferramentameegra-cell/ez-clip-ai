import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useI18n } from '@/hooks/useI18n';
import { CreditCard, Check, Loader2, Sparkles } from 'lucide-react';

export function Billing() {
  const { t } = useI18n();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { data: plans = [], isLoading: plansLoading } = trpc.payment.getPlans.useQuery();
  const createCheckout = trpc.payment.createCheckoutSession.useMutation();

  // Verificar se há parâmetros de sucesso/cancelamento na URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const canceled = params.get('canceled');
    const sessionId = params.get('session_id');

    if (success && sessionId) {
      // Verificar pagamento usando mutation para poder usar onSuccess
      const verifyMutation = trpc.payment.verifyPayment.useQuery({ sessionId });
      
      verifyMutation.refetch().then((result) => {
        const data = result.data;
        if (data?.success && 'credits' in data) {
          toast.success(`Pagamento confirmado! ${data.credits} créditos adicionados à sua conta.`);
          // Atualizar localStorage
          const user = localStorage.getItem('user');
          if (user) {
            const userData = JSON.parse(user);
            userData.credits = (userData.credits || 0) + data.credits;
            localStorage.setItem('user', JSON.stringify(userData));
          }
          // Limpar URL
          window.history.replaceState({}, '', '/billing');
        }
      });
    } else if (canceled) {
      toast.info('Pagamento cancelado');
      window.history.replaceState({}, '', '/billing');
    }
  }, []);

  const handlePurchase = async (planId: string) => {
    try {
      setSelectedPlan(planId);
      const result = await createCheckout.mutateAsync({ planId: planId as any });
      
      if (result.url) {
        // Redirecionar para checkout do Stripe
        window.location.href = result.url;
      } else {
        toast.error('Erro ao criar sessão de checkout');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao processar pagamento');
    } finally {
      setSelectedPlan(null);
    }
  };

  // Obter créditos do usuário
  const user = localStorage.getItem('user');
  const userCredits = user ? JSON.parse(user).credits || 0 : 0;

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('billing.title')}</h1>
        <p className="text-muted-foreground">{t('billing.subtitle')}</p>
        
        {/* Mostrar créditos atuais */}
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-800 font-medium">{t('billing.currentCredits')}</p>
              <p className="text-2xl font-bold text-purple-900">{userCredits} {t('billing.credits')}</p>
            </div>
            <Sparkles className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {plansLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all hover:shadow-lg ${
                plan.id === 'pack_100' ? 'border-purple-500 border-2' : ''
              }`}
            >
              {plan.id === 'pack_100' && (
                <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 text-xs font-semibold">
                  {t('billing.popular')}
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.credits} {t('billing.credits')}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">R$</span>
                    <span className="text-4xl font-bold ml-1">{plan.price.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    R$ {(plan.price / plan.credits).toFixed(2).replace('.', ',')} por crédito
                  </p>
                </div>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    {plan.credits} {t('billing.clipsToProcess')}
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    {t('billing.unlimitedTime')}
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    {t('billing.highQuality')}
                  </li>
                </ul>

                <Button
                  className="w-full"
                  variant={plan.id === 'pack_100' ? 'default' : 'outline'}
                  onClick={() => handlePurchase(plan.id)}
                  disabled={createCheckout.isPending && selectedPlan === plan.id}
                >
                  {createCheckout.isPending && selectedPlan === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('billing.processing')}
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      {t('billing.purchase')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Informações adicionais */}
      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">{t('billing.infoTitle')}</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• {t('billing.info1')}</li>
          <li>• {t('billing.info2')}</li>
          <li>• {t('billing.info3')}</li>
        </ul>
      </div>
    </div>
  );
}

