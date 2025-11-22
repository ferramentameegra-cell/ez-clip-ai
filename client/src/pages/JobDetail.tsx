import { useEffect } from 'react';
import { useRoute } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RetentionScoreCard } from '@/components/RetentionScoreCard';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { ArrowLeft, Download, RefreshCw, CheckCircle2, XCircle, Clock, Loader2, Play } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function JobDetail() {
  const [, params] = useRoute('/jobs/:id');
  const jobId = params ? parseInt(params.id) : null;

  const { data, isLoading, refetch } = trpc.video.getById.useQuery(
    { jobId: jobId! },
    { enabled: !!jobId }
  );

  const pollingInterval = 3000;

  // Auto-refresh se job estiver processando
  useEffect(() => {
    if (data?.job && ['pending', 'downloading', 'transcribing', 'cutting', 'rendering'].includes(data.job.status)) {
      const interval = setInterval(() => {
        refetch();
      }, pollingInterval);
      return () => clearInterval(interval);
    }
  }, [data?.job?.status, pollingInterval, refetch]);

  const handleDownload = async () => {
    if (!jobId) return;
    try {
      const utils = trpc.useUtils();
      const result = await utils.video.getDownloadLink.fetch({ jobId });
      window.open(result.url, '_blank');
      toast.success('Download iniciado!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer download');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      pending: { label: 'Pendente', variant: 'outline' },
      downloading: { label: 'Baixando', variant: 'secondary' },
      transcribing: { label: 'Transcrevendo', variant: 'secondary' },
      cutting: { label: 'Cortando', variant: 'secondary' },
      rendering: { label: 'Renderizando', variant: 'secondary' },
      completed: { label: 'Concluído', variant: 'default' },
      failed: { label: 'Falhou', variant: 'outline' },
    };

    const statusInfo = statusMap[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (status === 'failed') return <XCircle className="h-5 w-5 text-red-500" />;
    if (['pending', 'downloading', 'transcribing', 'cutting', 'rendering'].includes(status)) {
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
    return <Clock className="h-5 w-5 text-gray-500" />;
  };

  if (isLoading || !data) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  const { job, clips } = data;

  // Calcular score médio de retenção
  const avgRetentionScore = clips.length > 0
    ? Math.round(clips.reduce((acc, clip) => acc + (clip.retentionScore || 0), 0) / clips.length)
    : 0;

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <Link href="/jobs">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Jobs
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(job.status)}
              <h1 className="text-3xl font-bold">Job #{job.id}</h1>
              {getStatusBadge(job.status)}
            </div>
            <p className="text-muted-foreground">
              Criado {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale: ptBR })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            {job.status === 'completed' && (
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download ZIP
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progresso */}
          {job.status !== 'completed' && job.status !== 'failed' && (
            <Card>
              <CardHeader>
                <CardTitle>Progresso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Processamento</span>
                    <span className="font-medium">{job.progress}%</span>
                  </div>
                  <Progress value={job.progress || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Score Médio de Retenção */}
          {clips.length > 0 && (
            <RetentionScoreCard
              score={avgRetentionScore}
              showDetails={false}
            />
          )}

          {/* Lista de Clipes */}
          <Card>
            <CardHeader>
              <CardTitle>Clipes Gerados</CardTitle>
              <CardDescription>
                {clips.length} de {job.totalClips || clips.length} clipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clips.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum clipe gerado ainda
                </p>
              ) : (
                <div className="space-y-4">
                  {clips.map((clip) => (
                    <div
                      key={clip.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Clipe #{clip.clipNumber}</Badge>
                            {clip.retentionScore !== null && (
                              <Badge
                                variant={
                                  clip.retentionScore >= 80
                                    ? 'default'
                                    : clip.retentionScore >= 60
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                Score: {clip.retentionScore}/100
                              </Badge>
                            )}
                            {clip.duration && (
                              <span className="text-sm text-muted-foreground">
                                {Math.round(clip.duration)}s
                              </span>
                            )}
                          </div>
                        </div>
                        {clip.videoUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => clip.videoUrl && window.open(clip.videoUrl, '_blank')}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Assistir
                          </Button>
                        )}
                      </div>
                      {clip.retentionScore !== null && (
                        <div className="mt-3">
                          <RetentionScoreCard
                            score={clip.retentionScore}
                            showDetails={false}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informações do Job */}
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{getStatusBadge(job.status)}</p>
              </div>
              {job.vertical && (
                <div>
                  <p className="text-sm text-muted-foreground">Nicho</p>
                  <p className="font-medium">{job.vertical}</p>
                </div>
              )}
              {job.packageSize && (
                <div>
                  <p className="text-sm text-muted-foreground">Pacote</p>
                  <p className="font-medium">Pack {job.packageSize}</p>
                </div>
              )}
              {job.totalClips && (
                <div>
                  <p className="text-sm text-muted-foreground">Total de Clipes</p>
                  <p className="font-medium">{job.totalClips}</p>
                </div>
              )}
              {job.sourceUrl && (
                <div>
                  <p className="text-sm text-muted-foreground">URL Original</p>
                  <a
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-600 hover:underline break-all"
                  >
                    {job.sourceUrl}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

