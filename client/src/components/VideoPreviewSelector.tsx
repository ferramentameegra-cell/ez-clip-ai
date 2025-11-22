import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Play, Pause, Scissors, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface VideoPreviewSelectorProps {
  youtubeUrl: string;
  onTimeRangeChange: (startTime: number, endTime: number) => void;
  disabled?: boolean;
}

export function VideoPreviewSelector({ youtubeUrl, onTimeRangeChange, disabled }: VideoPreviewSelectorProps) {
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const videoRef = useRef<HTMLIFrameElement>(null);

  // Buscar informações do vídeo quando URL mudar
  useEffect(() => {
    if (!youtubeUrl || disabled) {
      setVideoInfo(null);
      return;
    }

    const fetchVideoInfo = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Usar endpoint do backend para obter informações do vídeo
        const backendUrl = (typeof window !== 'undefined' && (window as any).__API_URL__) || 'http://localhost:3001';
        const response = await fetch(`${backendUrl}/api/youtube/info?url=${encodeURIComponent(youtubeUrl)}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Erro ao buscar informações do vídeo' }));
          throw new Error(errorData.error || 'Erro ao buscar informações do vídeo');
        }
        
        const data = await response.json();
        setVideoInfo(data);
        
        // Inicializar endTime com a duração total
        if (data.duration) {
          setEndTime(data.duration);
          onTimeRangeChange(0, data.duration);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar vídeo');
        setVideoInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce para evitar muitas requisições
    const timeoutId = setTimeout(fetchVideoInfo, 500);
    return () => clearTimeout(timeoutId);
  }, [youtubeUrl, disabled]);

  // Extrair video ID do YouTube URL
  const getVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = youtubeUrl ? getVideoId(youtubeUrl) : null;
  const embedUrl = videoId 
    ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`
    : null;

  // Converter segundos para formato MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Converter formato MM:SS para segundos
  const parseTime = (timeString: string): number => {
    const parts = timeString.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return parseInt(timeString) || 0;
  };

  // Atualizar range quando startTime ou endTime mudarem
  useEffect(() => {
    if (startTime >= 0 && endTime > startTime) {
      onTimeRangeChange(startTime, endTime);
    }
  }, [startTime, endTime, onTimeRangeChange]);

  // Validar e ajustar tempos
  const handleStartTimeChange = (value: string) => {
    const time = parseTime(value);
    const maxTime = videoInfo?.duration || 0;
    const newStart = Math.max(0, Math.min(time, endTime - 1, maxTime));
    setStartTime(newStart);
  };

  const handleEndTimeChange = (value: string) => {
    const time = parseTime(value);
    const maxTime = videoInfo?.duration || 0;
    const newEnd = Math.max(startTime + 1, Math.min(time, maxTime));
    setEndTime(newEnd);
  };

  // Definir início no tempo atual (placeholder - pode ser implementado com YouTube API)
  const setStartToCurrent = () => {
    // TODO: Implementar com YouTube IFrame API para obter tempo atual do player
    toast.info('Funcionalidade em desenvolvimento');
  };

  // Definir fim no tempo atual (placeholder - pode ser implementado com YouTube API)
  const setEndToCurrent = () => {
    // TODO: Implementar com YouTube IFrame API para obter tempo atual do player
    toast.info('Funcionalidade em desenvolvimento');
  };

  // Resetar para o vídeo completo
  const resetToFull = () => {
    if (videoInfo?.duration) {
      setStartTime(0);
      setEndTime(videoInfo.duration);
    }
  };

  // Calcular duração selecionada
  const selectedDuration = endTime - startTime;

  if (!youtubeUrl || disabled) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          Selecionar Trecho do Vídeo
        </CardTitle>
        <CardDescription>
          Escolha o início e fim do trecho que deseja processar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2">Carregando informações do vídeo...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {videoInfo && !isLoading && (
          <>
            {/* Preview do vídeo */}
            <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
              {embedUrl && (
                <iframe
                  ref={videoRef}
                  src={embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Informações do vídeo */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{videoInfo.title}</h3>
              <p className="text-sm text-gray-600">
                Duração total: {formatTime(videoInfo.duration)} ({videoInfo.duration}s)
              </p>
            </div>

            {/* Controles de seleção */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Início */}
                <div className="space-y-2">
                  <Label htmlFor="start-time">Início (MM:SS)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="start-time"
                      type="text"
                      value={formatTime(startTime)}
                      onChange={(e) => handleStartTimeChange(e.target.value)}
                      placeholder="00:00"
                      className="font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={setStartToCurrent}
                      title="Definir início no tempo atual"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {startTime}s ({formatTime(startTime)})
                  </p>
                </div>

                {/* Fim */}
                <div className="space-y-2">
                  <Label htmlFor="end-time">Fim (MM:SS)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="end-time"
                      type="text"
                      value={formatTime(endTime)}
                      onChange={(e) => handleEndTimeChange(e.target.value)}
                      placeholder="00:00"
                      className="font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={setEndToCurrent}
                      title="Definir fim no tempo atual"
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {endTime}s ({formatTime(endTime)})
                  </p>
                </div>
              </div>

              {/* Duração selecionada */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-900">Trecho selecionado:</p>
                    <p className="text-lg font-bold text-purple-700">
                      {formatTime(selectedDuration)} ({selectedDuration.toFixed(1)}s)
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetToFull}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Vídeo completo
                  </Button>
                </div>
              </div>

              {/* Barra visual do trecho */}
              <div className="space-y-2">
                <Label>Visualização do trecho</Label>
                <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
                  {/* Barra completa */}
                  <div className="absolute inset-0 bg-gray-300" />
                  
                  {/* Trecho selecionado */}
                  {videoInfo.duration > 0 && (
                    <div
                      className="absolute h-full bg-purple-600"
                      style={{
                        left: `${(startTime / videoInfo.duration) * 100}%`,
                        width: `${((endTime - startTime) / videoInfo.duration) * 100}%`,
                      }}
                    />
                  )}
                  
                  {/* Marcadores */}
                  <div className="absolute inset-0 flex items-center justify-between px-2 text-xs text-gray-600">
                    <span>{formatTime(startTime)}</span>
                    <span>{formatTime(endTime)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

