import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { ArrowLeft, Download, RefreshCw, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function JobsList() {
  const { data: jobs, isLoading, refetch } = trpc.video.list.useQuery();
  const pollingInterval = 3000; // 3 segundos

  // Auto-refresh se houver jobs em processamento
  useEffect(() => {
    const hasProcessingJobs = jobs?.some(job => 
      job.status === 'pending' || 
      job.status === 'downloading' || 
      job.status === 'transcribing' || 
      job.status === 'cutting' || 
      job.status === 'rendering'
    );

    if (hasProcessingJobs) {
      const interval = setInterval(() => {
        refetch();
      }, pollingInterval);
      return () => clearInterval(interval);
    }
  }, [jobs, pollingInterval, refetch]);

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

  const handleDownload = async (jobId: number) => {
    try {
      // Usar utils para fazer query manual
      const utils = trpc.useUtils();
      const result = await utils.video.getDownloadLink.fetch({ jobId });
      window.open(result.url, '_blank');
      toast.success('Download iniciado!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer download');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meus Jobs</h1>
            <p className="text-muted-foreground">
              Acompanhe o progresso dos seus vídeos
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {!jobs || jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Nenhum job encontrado</p>
            <Link href="/">
              <Button>Criar Primeiro Job</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = `/jobs/${job.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(job.status)}
                      <CardTitle className="text-xl">Job #{job.id}</CardTitle>
                      {getStatusBadge(job.status)}
                    </div>
                    <CardDescription>
                      Criado {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale: ptBR })}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/jobs/${job.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </Link>
                    {job.status === 'completed' && (
                      <Button onClick={(e) => { e.stopPropagation(); handleDownload(job.id); }} size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {job.status !== 'completed' && job.status !== 'failed' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">{job.progress}%</span>
                    </div>
                    <Progress value={job.progress || 0} className="h-2" />
                  </div>
                )}
                {job.totalClips !== null && job.totalClips !== undefined && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    Total de clipes: {job.totalClips}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

