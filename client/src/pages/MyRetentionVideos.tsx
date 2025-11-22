import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VideoUploader } from '@/components/VideoUploader';
import { VerticalType, VERTICAIS_LIST } from 'shared/verticais';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { trpc } from '@/lib/trpc';

export function MyRetentionVideos() {
  const [selectedVertical, setSelectedVertical] = useState<VerticalType | 'all'>('all');
  
  const utils = trpc.useUtils();
  const { data: videos = [], isLoading } = trpc.userContent.listRetentionVideos.useQuery({
    vertical: selectedVertical !== 'all' ? selectedVertical : undefined,
  });

  const deleteMutation = trpc.userContent.deleteRetentionVideo.useMutation({
    onSuccess: () => {
      toast.success('Vídeo deletado com sucesso!');
      utils.userContent.listRetentionVideos.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao deletar vídeo');
    },
  });

  const handleDelete = async (videoId: string) => {
    if (!confirm('Tem certeza que deseja deletar este vídeo?')) {
      return;
    }

    deleteMutation.mutate({ videoId: videoId.toString() });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Meus Vídeos de Retenção</CardTitle>
            <CardDescription>
              Gerencie seus vídeos de retenção personalizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VideoUploader />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vídeos Enviados</CardTitle>
                <CardDescription>
                  Seus vídeos de retenção organizados por vertical
                </CardDescription>
              </div>
              <Select
                value={selectedVertical}
                onValueChange={(value) => setSelectedVertical(value as VerticalType | 'all')}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Verticais</SelectItem>
                  {VERTICAIS_LIST.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.emoji} {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : !videos || videos.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <p>Você ainda não tem vídeos de retenção.</p>
                <p className="text-sm mt-2">Faça upload de vídeos usando o formulário acima.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                  <Card key={video.id}>
                    <CardContent className="p-0">
                      <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.name || 'Vídeo'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-4xl">📹</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        <div>
                          <h3 className="font-medium truncate">
                            {video.name || 'Vídeo sem nome'}
                          </h3>
                          {video.vertical && (
                            <p className="text-sm text-muted-foreground">
                              {VERTICAIS_LIST.find(v => v.id === video.vertical)?.emoji}{' '}
                              {VERTICAIS_LIST.find(v => v.id === video.vertical)?.name}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          {video.duration && (
                            <span>
                              {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                            </span>
                          )}
                          {video.createdAt && (
                            <span>
                              {formatDistanceToNow(new Date(video.createdAt), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => handleDelete(video.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Deletar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

