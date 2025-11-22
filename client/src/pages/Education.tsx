import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Lightbulb, TrendingUp, PlayCircle } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

export function Education() {
  const { t } = useI18n();

  const tutorials = [
    {
      id: 1,
      title: 'Como criar vídeos virais no TikTok',
      description: 'Aprenda as técnicas básicas para criar conteúdo que viraliza',
      duration: '15 min',
      icon: PlayCircle,
    },
    {
      id: 2,
      title: 'Otimização de legendas para retenção',
      description: 'Descubra como usar legendas para aumentar a retenção em 40%',
      duration: '10 min',
      icon: TrendingUp,
    },
    {
      id: 3,
      title: 'Melhores práticas de edição',
      description: 'Dicas profissionais para editar seus vídeos como um expert',
      duration: '20 min',
      icon: Lightbulb,
    },
  ];

  const tips = [
    {
      id: 1,
      title: 'Hook nos primeiros 3 segundos',
      description: 'Capture a atenção do público imediatamente',
    },
    {
      id: 2,
      title: 'Use vídeos de retenção',
      description: 'Adicione conteúdo secundário para manter o público engajado',
    },
    {
      id: 3,
      title: 'Poste no horário certo',
      description: 'Descubra quando sua audiência está mais ativa',
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('education.title')}</h1>
        <p className="text-muted-foreground">{t('education.subtitle')}</p>
      </div>

      {/* Tutorials */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          {t('education.tutorials')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutorials.map((tutorial) => (
            <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <tutorial.icon className="h-6 w-6 text-purple-600" />
                  <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                </div>
                <CardDescription>{tutorial.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{tutorial.duration}</span>
                  <Button variant="outline" size="sm">
                    Assistir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="h-6 w-6" />
          {t('education.tips')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tips.map((tip) => (
            <Card key={tip.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{tip.title}</CardTitle>
                <CardDescription>{tip.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

