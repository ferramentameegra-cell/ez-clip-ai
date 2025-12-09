import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Scissors, RotateCcw, Loader2, GripVertical, Clock } from 'lucide-react';

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
  const [isDragging, setIsDragging] = useState<'start' | 'end' | 'range' | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartValue, setDragStartValue] = useState(0);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

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
        // @ts-ignore - import.meta.env é injetado pelo Vite
        const trpcUrl = import.meta.env?.VITE_TRPC_URL || '';
        let backendUrl = trpcUrl 
          ? trpcUrl.replace('/trpc', '') 
          : '';
        
        // Se não tiver VITE_TRPC_URL, usar URL atual menos /trpc ou localhost
        if (!backendUrl) {
          if (typeof window !== 'undefined') {
            const currentOrigin = window.location.origin;
            backendUrl = currentOrigin.includes('localhost') 
              ? 'http://localhost:3001'
              : currentOrigin;
          } else {
            backendUrl = 'http://localhost:3001';
          }
        }
        
        const apiUrl = `${backendUrl}/api/youtube/info?url=${encodeURIComponent(youtubeUrl)}`;
        console.log('[VideoPreviewSelector] Buscando informações em:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Erro ao buscar informações do vídeo' }));
          throw new Error(errorData.error || `Erro ao buscar informações do vídeo (${response.status})`);
        }
        
        const data = await response.json();
        setVideoInfo(data);
        
        // Inicializar endTime com a duração total
        if (data.duration) {
          setEndTime(data.duration);
          onTimeRangeChange(0, data.duration);
        }
      } catch (err: any) {
        console.error('[VideoPreviewSelector] Erro:', err);
        setError(err.message || 'Erro ao carregar vídeo');
        setVideoInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce para evitar muitas requisições
    const timeoutId = setTimeout(fetchVideoInfo, 500);
    return () => clearTimeout(timeoutId);
  }, [youtubeUrl, disabled, onTimeRangeChange]);

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
    ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`
    : null;

  // Converter segundos para formato HH:MM:SS ou MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Converter formato MM:SS ou HH:MM:SS para segundos
  const parseTime = (timeString: string): number => {
    const parts = timeString.split(':').map(p => parseInt(p) || 0);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return parseInt(timeString) || 0;
  };

  // Atualizar range quando startTime ou endTime mudarem
  useEffect(() => {
    if (videoInfo && startTime >= 0 && endTime > startTime && endTime <= videoInfo.duration) {
      onTimeRangeChange(startTime, endTime);
    }
  }, [startTime, endTime, videoInfo, onTimeRangeChange]);

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


  // Handler de mouse/touch para arrastar
  const handleMouseDown = useCallback((e: React.MouseEvent, type: 'start' | 'end' | 'range') => {
    e.preventDefault();
    setIsDragging(type);
    setDragStartX(e.clientX);
    if (type === 'start') {
      setDragStartValue(startTime);
    } else if (type === 'end') {
      setDragStartValue(endTime);
    } else {
      setDragStartValue(startTime);
    }
  }, [startTime, endTime]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !videoInfo || !sliderRef.current) return;

    const deltaX = e.clientX - dragStartX;
    const rect = sliderRef.current.getBoundingClientRect();
    const deltaPercent = deltaX / rect.width;
    const deltaTime = deltaPercent * videoInfo.duration;

    if (isDragging === 'start') {
      const newStart = Math.max(0, Math.min(dragStartValue + deltaTime, endTime - 1));
      setStartTime(newStart);
    } else if (isDragging === 'end') {
      const newEnd = Math.max(startTime + 1, Math.min(dragStartValue + deltaTime, videoInfo.duration));
      setEndTime(newEnd);
    } else if (isDragging === 'range') {
      const newStart = Math.max(0, Math.min(dragStartValue + deltaTime, videoInfo.duration - (endTime - startTime)));
      const newEnd = newStart + (endTime - startTime);
      if (newEnd <= videoInfo.duration) {
        setStartTime(newStart);
        setEndTime(newEnd);
      }
    }
  }, [isDragging, dragStartX, dragStartValue, videoInfo, startTime, endTime]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Event listeners para arrastar
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

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

  const startPercent = videoInfo ? (startTime / videoInfo.duration) * 100 : 0;
  const endPercent = videoInfo ? (endTime / videoInfo.duration) * 100 : 0;
  const widthPercent = endPercent - startPercent;

  return (
    <Card className="mt-4 border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-purple-600" />
          Selecionar Trecho do Vídeo (Trim)
        </CardTitle>
        <CardDescription>
          Escolha exatamente qual parte do vídeo deseja processar - similar ao editor do YouTube
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
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
            <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{videoInfo.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Duração total: {formatTime(videoInfo.duration)}</span>
                </div>
                {videoInfo.author && (
                  <span>• {videoInfo.author}</span>
                )}
              </div>
            </div>

            {/* Slider de seleção de trecho (similar ao YouTube) */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <GripVertical className="h-4 w-4" />
                Arraste os marcadores para selecionar o trecho
              </Label>
              
              <div 
                ref={sliderRef}
                className="relative h-12 bg-gray-200 rounded-lg overflow-hidden cursor-pointer select-none"
                style={{ touchAction: 'none' }}
              >
                {/* Barra de fundo completa */}
                <div className="absolute inset-0 bg-gray-300" />
                
                {/* Trecho selecionado (destaque) */}
                <div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-80 cursor-move"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'range')}
                />
                
                {/* Marcador de início */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-purple-600 cursor-ew-resize z-10 hover:w-2 transition-all"
                  style={{ left: `${startPercent}%` }}
                  onMouseDown={(e) => handleMouseDown(e, 'start')}
                >
                  <div className="absolute -top-1 -left-2 w-5 h-5 bg-purple-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <GripVertical className="h-3 w-3 text-white" />
                  </div>
                </div>
                
                {/* Marcador de fim */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-blue-600 cursor-ew-resize z-10 hover:w-2 transition-all"
                  style={{ left: `${endPercent}%` }}
                  onMouseDown={(e) => handleMouseDown(e, 'end')}
                >
                  <div className="absolute -top-1 -right-2 w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <GripVertical className="h-3 w-3 text-white" />
                  </div>
                </div>
                
                {/* Marcadores de tempo */}
                <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-medium text-gray-700 pointer-events-none">
                  <span className="bg-white/90 px-1 rounded">{formatTime(startTime)}</span>
                  <span className="bg-white/90 px-1 rounded">{formatTime(endTime)}</span>
                </div>
              </div>

              {/* Informação do trecho selecionado */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-900">Trecho selecionado:</p>
                    <p className="text-xl font-bold text-purple-700 mt-1">
                      {formatTime(selectedDuration)} ({selectedDuration.toFixed(1)}s)
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      De {formatTime(startTime)} até {formatTime(endTime)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetToFull}
                    className="border-purple-300 hover:bg-purple-100"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Resetar
                  </Button>
                </div>
              </div>
            </div>

            {/* Controles numéricos (opcionais para ajuste fino) */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="start-time" className="text-sm">Início (opcional)</Label>
                <Input
                  id="start-time"
                  type="text"
                  value={formatTime(startTime)}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  placeholder="00:00"
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time" className="text-sm">Fim (opcional)</Label>
                <Input
                  id="end-time"
                  type="text"
                  value={formatTime(endTime)}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                  placeholder="00:00"
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
