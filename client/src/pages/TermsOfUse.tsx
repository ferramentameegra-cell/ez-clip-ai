import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { useI18n } from '@/hooks/useI18n';

export function TermsOfUse() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const [accepted, setAccepted] = useState(false);
  
  const acceptTerms = trpc.auth.acceptTerms.useMutation({
    onSuccess: () => {
      toast.success(t('terms.accepted'));
      // Atualizar localStorage
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        userData.acceptedTerms = true;
        localStorage.setItem('user', JSON.stringify(userData));
      }
      setLocation('/');
    },
    onError: (error: any) => {
      toast.error(error.message || t('common.error'));
    },
  });

  const handleAccept = () => {
    if (!accepted) {
      toast.error(t('terms.mustAccept'));
      return;
    }
    acceptTerms.mutate();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{t('terms.title')}</CardTitle>
          <CardDescription>{t('terms.lastUpdated')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[60vh] pr-4 mb-6 overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              <h2>{t('terms.section1.title')}</h2>
              <p>{t('terms.section1.content')}</p>

              <h2>{t('terms.section2.title')}</h2>
              <p>{t('terms.section2.content')}</p>

              <h2>{t('terms.section3.title')}</h2>
              <ul>
                <li>{t('terms.section3.item1')}</li>
                <li>{t('terms.section3.item2')}</li>
                <li>{t('terms.section3.item3')}</li>
                <li>{t('terms.section3.item4')}</li>
              </ul>

              <h2>{t('terms.section4.title')}</h2>
              <p>{t('terms.section4.content')}</p>

              <h2>{t('terms.section5.title')}</h2>
              <p>{t('terms.section5.content')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <Checkbox
              id="accept"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
            />
            <label
              htmlFor="accept"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {t('terms.acceptLabel')}
            </label>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleAccept}
              disabled={!accepted || acceptTerms.isPending}
              className="flex-1"
            >
              {acceptTerms.isPending ? t('common.loading') : t('terms.acceptButton')}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Logout se não aceitar
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setLocation('/login');
              }}
            >
              {t('terms.decline')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
