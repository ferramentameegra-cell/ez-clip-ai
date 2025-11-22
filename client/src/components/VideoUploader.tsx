import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, CheckCircle2 } from 'lucide-react';
import { VerticalType, VERTICAIS_LIST } from 'shared/verticais';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

interface VideoUploaderProps {
  onUploadSuccess?: () => void;
}

export function VideoUploader({ onUploadSuccess }: VideoUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [vertical, setVertical] = useState<VerticalType | ''>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useUtils();
  const uploadMutation = trpc.userContent.uploadRetentionVideo.useMutation({
    onSuccess: () => {
      toast.success('Vídeo enviado com sucesso!');
      setSelectedFile(null);
      setVertical('');
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      utils.userContent.listRetentionVideos.invalidate();
      onUploadSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao enviar vídeo');
      setUploadProgress(0);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('O arquivo é muito grande. Tamanho máximo: 100MB');
      return;
    }

    if (!file.type.startsWith('video/')) {
      toast.error('Por favor, selecione um arquivo de vídeo');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !vertical) {
      toast.error('Selecione um arquivo e um vertical');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('vertical', vertical);
    formData.append('name', selectedFile.name);

    // Simular progresso (em produção, isso viria do backend)
    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await uploadMutation.mutateAsync({
        file: selectedFile,
        vertical: vertical as VerticalType,
        name: selectedFile.name
      });
      clearInterval(progressInterval);
      setUploadProgress(100);
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload de Vídeo de Retenção</CardTitle>
        <CardDescription>
          Envie seus próprios vídeos de retenção (máximo 100MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vertical">Vertical</Label>
          <Select value={vertical} onValueChange={(value) => setVertical(value as VerticalType)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o vertical" />
            </SelectTrigger>
            <SelectContent>
              {VERTICAIS_LIST.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.emoji} {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="video-file">Arquivo de Vídeo</Label>
          <div className="flex items-center gap-2">
            <Input
              id="video-file"
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              ref={fileInputRef}
              className="flex-1"
            />
            {selectedFile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {selectedFile && (
            <div className="text-sm text-muted-foreground">
              {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Enviando...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        {uploadProgress === 100 && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>Upload concluído!</span>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !vertical || uploadMutation.isPending || uploadProgress > 0}
          className="w-full"
        >
          {uploadMutation.isPending ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-pulse" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Enviar Vídeo
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

