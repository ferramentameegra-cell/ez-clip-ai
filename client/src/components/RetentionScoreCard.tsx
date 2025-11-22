import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react';

interface RetentionScoreCardProps {
  score: number; // 0-100
  factors?: {
    keywordDensity: number;
    pacing: number;
    silenceRatio: number;
    clipLength: number;
  };
  recommendations?: string[];
  showDetails?: boolean;
}

export function RetentionScoreCard({
  score,
  factors,
  recommendations,
  showDetails = true,
}: RetentionScoreCardProps) {

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'outline' => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'outline';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Precisa Melhorar';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Score de Retenção
            </CardTitle>
            <CardDescription>
              Previsão de retenção do público no vídeo
            </CardDescription>
          </div>
          <Badge variant={getScoreBadgeVariant(score)} className="text-lg px-3 py-1">
            {score}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Visual */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{getScoreLabel(score)}</span>
            <span className={`font-bold ${getScoreColor(score)}`}>
              {score >= 80 ? (
                <CheckCircle2 className="h-4 w-4 inline mr-1" />
              ) : (
                <AlertCircle className="h-4 w-4 inline mr-1" />
              )}
              {score}%
            </span>
          </div>
          <Progress value={score} className="h-3" />
        </div>

        {/* Fatores Detalhados */}
        {showDetails && factors && (
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-sm font-semibold text-gray-700">Fatores de Análise:</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Densidade de Palavras-chave</span>
                <div className="flex items-center gap-2">
                  <Progress value={factors.keywordDensity} className="h-2 w-24" />
                  <span className="font-medium w-12 text-right">{Math.round(factors.keywordDensity)}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Ritmo de Fala</span>
                <div className="flex items-center gap-2">
                  <Progress value={factors.pacing} className="h-2 w-24" />
                  <span className="font-medium w-12 text-right">{Math.round(factors.pacing)}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Razão de Silêncio</span>
                <div className="flex items-center gap-2">
                  <Progress value={factors.silenceRatio} className="h-2 w-24" />
                  <span className="font-medium w-12 text-right">{Math.round(factors.silenceRatio)}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duração do Clipe</span>
                <div className="flex items-center gap-2">
                  <Progress value={factors.clipLength} className="h-2 w-24" />
                  <span className="font-medium w-12 text-right">{Math.round(factors.clipLength)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recomendações */}
        {recommendations && recommendations.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-start gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
              <h4 className="text-sm font-semibold text-gray-700">Recomendações:</h4>
            </div>
            <ul className="space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

