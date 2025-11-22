import { useState } from "react";
import * as React from "react";
import { Link } from "wouter";
import { 
  Sparkles, Scissors, Zap, Target, Youtube, Clock, 
  CheckCircle, Info, Layers, Type, ArrowRight, Rocket, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { RetentionVideoGallery } from "@/components/RetentionVideoGallery";
import { UserVideoSelector } from "@/components/UserVideoSelector";
import { EmojiGallery } from "@/components/EmojiGallery";
import { VideoPreview } from "@/components/VideoPreview";
import { VideoPreviewSelector } from "@/components/VideoPreviewSelector";
import { VerticalType, VERTICAIS_LIST } from "shared/verticais";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useI18n } from "@/hooks/useI18n";

type SecondaryContentType = 'none' | 'platform' | 'user' | 'emoji';
type PackageSize = '5' | '10' | '50' | '100';

// Presets por pacote
const PACKAGE_PRESETS: Record<PackageSize, { duration: number; label: string; description: string }> = {
  '5': { duration: 90, label: 'Pack 5', description: '5 clipes de ~90s cada' },
  '10': { duration: 60, label: 'Pack 10', description: '10 clipes de ~60s cada' },
  '50': { duration: 45, label: 'Pack 50', description: '50 clipes de ~45s cada' },
  '100': { duration: 30, label: 'Pack 100', description: '100 clipes de ~30s cada' },
};

export function Home() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const [packageSize, setPackageSize] = useState<PackageSize | ''>('');
  const [vertical, setVertical] = useState<VerticalType | ''>('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [clipDuration, setClipDuration] = useState('60');
  const [addSubtitles, setAddSubtitles] = useState(true);
  const [secondaryType, setSecondaryType] = useState<SecondaryContentType>('none');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [headline, setHeadline] = useState('');
  const [videoStartTime, setVideoStartTime] = useState<number | undefined>(undefined);
  const [videoEndTime, setVideoEndTime] = useState<number | undefined>(undefined);

  const createJob = trpc.video.create.useMutation({
    onSuccess: () => {
      // Decrementar créditos baseado no pacote
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        const creditsUsed = packageSize ? parseInt(packageSize) : 1;
        userData.credits = Math.max(0, userData.credits - creditsUsed);
        localStorage.setItem('user', JSON.stringify(userData));
        
        if (userData.credits === 0) {
          toast.warning('Você usou todos os seus créditos grátis! Faça upgrade para continuar.');
        } else {
          toast.success(`Job criado com sucesso! ${creditsUsed} crédito(s) consumido(s). Você tem ${userData.credits} créditos restantes.`);
        }
      }
      
      setTimeout(() => {
        setLocation('/jobs');
      }, 1500);
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao criar job');
    },
  });

  // Verificar se há job pendente após login
  React.useEffect(() => {
    const pendingJob = localStorage.getItem('pendingJob');
    const user = localStorage.getItem('user');
    
    if (pendingJob && user) {
      try {
        const jobData = JSON.parse(pendingJob);
        const userData = JSON.parse(user);
        
        // Verificar créditos
        if (userData.credits <= 0) {
          toast.error('Você não tem créditos suficientes. Faça upgrade do seu plano!');
          localStorage.removeItem('pendingJob');
          return;
        }

        // Criar o job
        createJob.mutate(jobData);
        localStorage.removeItem('pendingJob');
      } catch (error) {
        console.error('Erro ao processar job pendente:', error);
      }
    }
  }, []);

  // Verificar se há job pendente após login
  React.useEffect(() => {
    const pendingJob = localStorage.getItem('pendingJob');
    const user = localStorage.getItem('user');
    
    if (pendingJob && user) {
      try {
        const jobData = JSON.parse(pendingJob);
        const userData = JSON.parse(user);
        
        // Verificar créditos
        if (userData.credits <= 0) {
          toast.error('Você não tem créditos suficientes. Faça upgrade do seu plano!');
          localStorage.removeItem('pendingJob');
          return;
        }

        // Criar o job
        createJob.mutate(jobData);
        localStorage.removeItem('pendingJob');
      } catch (error) {
        console.error('Erro ao processar job pendente:', error);
      }
    }
  }, []);

  const handleCreateJob = () => {
    if (!youtubeUrl) {
      toast.error('Por favor, insira a URL do YouTube');
      return;
    }

    // Validar pacote ou duração
    if (!packageSize && !clipDuration) {
      toast.error('Por favor, selecione um pacote ou defina a duração dos clipes');
      return;
    }

    // Validar vertical (sempre obrigatório)
    if (!vertical) {
      toast.error('Por favor, selecione um nicho');
      return;
    }

    if (secondaryType !== 'none' && !selectedVideo && !selectedEmoji) {
      toast.error('Por favor, selecione um conteúdo secundário');
      return;
    }

    // Verificar se usuário está logado
    const user = localStorage.getItem('user');
    if (!user) {
      // Salvar dados do formulário no localStorage para recuperar após login
      const creditsNeeded = packageSize ? parseInt(packageSize) : 1;
      const formData = {
        youtubeUrl,
        packageSize: packageSize || undefined,
        clipDuration: packageSize ? undefined : Number(clipDuration),
        withSubtitles: addSubtitles,
        vertical: vertical ? (vertical as VerticalType) : undefined,
        secondaryContentType: secondaryType !== 'none' ? secondaryType : undefined,
        secondaryContentId: secondaryType !== 'none' && (selectedVideo || selectedEmoji) ? (selectedVideo || selectedEmoji || undefined) : undefined,
        headline: headline || undefined,
        creditsNeeded
      };
      
      localStorage.setItem('pendingJob', JSON.stringify(formData));
      setLocation('/login?redirect=create-job');
      return;
    }

    // Verificar créditos
    const userData = JSON.parse(user);
    const creditsNeeded = packageSize ? parseInt(packageSize) : 1;
    if (userData.credits < creditsNeeded) {
      toast.error(`Você precisa de ${creditsNeeded} crédito(s) para este pacote. Você tem ${userData.credits} crédito(s). Faça upgrade do seu plano!`);
      return;
    }

    // Criar o job diretamente
    createJob.mutate({
      youtubeUrl,
      packageSize: packageSize || undefined, // Novo sistema de pacotes
      clipDuration: packageSize ? undefined : Number(clipDuration), // Usar clipDuration apenas se não usar pacote
      withSubtitles: addSubtitles,
      vertical: vertical as VerticalType,
      secondaryContentType: secondaryType !== 'none' ? secondaryType : undefined,
      secondaryContentId: secondaryType !== 'none' && (selectedVideo || selectedEmoji) ? (selectedVideo || selectedEmoji || undefined) : undefined,
      headline: headline || undefined,
      startTime: videoStartTime !== undefined ? videoStartTime : undefined,
      endTime: videoEndTime !== undefined ? videoEndTime : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SEÇÃO 1: HERO */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 py-12 md:py-20 px-4">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative max-w-4xl mx-auto text-center text-white space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {t('home.title')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-purple-100 max-w-3xl mx-auto">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-medium">{t('home.badge1')}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Rocket className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-medium">{t('home.badge2')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: COMO FUNCIONA */}
      <div className="py-8 md:py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {/* Card 1: Cortes Sequenciais */}
            <div className="group relative bg-white p-4 md:p-8 rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <Scissors className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Cortes Sequenciais</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Divide o vídeo em partes cronológicas de 1 minuto cada
                </p>
              </div>
            </div>

            {/* Card 2: Legendas Virais */}
            <div className="group relative bg-white p-4 md:p-8 rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Legendas Virais</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Legendas automáticas estilizadas no estilo TikTok
                </p>
              </div>
            </div>

            {/* Card 3: Fundos de Retenção */}
            <div className="group relative bg-white p-4 md:p-8 rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Fundos de Retenção</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Adiciona vídeos satisfatórios para aumentar retenção
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: FORMULÁRIO */}
      <div className="py-8 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 md:p-8 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('home.createJob')}</h2>
              <p className="text-sm md:text-base text-purple-100">{t('home.createJobDesc')}</p>
            </div>
            <div className="p-4 md:p-8 space-y-6 md:space-y-8">
              {/* Mostrar créditos do usuário se logado */}
              {(() => {
                const user = localStorage.getItem('user');
                if (user) {
                  try {
                    const userData = JSON.parse(user);
                    return (
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3 md:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm md:text-base font-medium text-green-800">
                              {t('home.creditsAvailable')}: <span className="text-lg md:text-xl font-bold">{userData.credits}</span>
                            </p>
                            {userData.credits === 0 && (
                              <p className="text-xs md:text-sm text-red-600 mt-1">
                                {t('home.creditsUsed')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  } catch (e) {
                    return null;
                  }
                }
                return null;
              })()}
              
              {/* Campo 1: URL do YouTube */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Youtube className="h-5 w-5 text-red-600" />
                  {t('home.youtubeUrl')}
                </Label>
                <Input 
                  className="h-12 text-base border-2 hover:border-purple-300 transition-colors"
                  placeholder="https://www.youtube.com/watch?v=..." 
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    // Resetar tempos quando URL mudar
                    setVideoStartTime(undefined);
                    setVideoEndTime(undefined);
                  }}
                />
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  {t('home.youtubeUrlDesc')}
                </p>
              </div>

              {/* Preview e Seleção de Trecho */}
              {youtubeUrl && (
                <VideoPreviewSelector
                  youtubeUrl={youtubeUrl}
                  onTimeRangeChange={(start, end) => {
                    setVideoStartTime(start);
                    setVideoEndTime(end);
                  }}
                  disabled={!youtubeUrl}
                />
              )}

              {/* Campo 2: Pacote de Clipes (NOVO) */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-600" />
                  Pacote de Clipes
                </Label>
                <Select
                  value={packageSize}
                  onValueChange={(value) => {
                    setPackageSize(value as PackageSize);
                    // Aplicar preset automaticamente
                    if (value && PACKAGE_PRESETS[value as PackageSize]) {
                      const preset = PACKAGE_PRESETS[value as PackageSize];
                      setClipDuration(preset.duration.toString());
                    }
                  }}
                >
                  <SelectTrigger className="h-12 text-base border-2 hover:border-purple-300 transition-colors">
                    <SelectValue placeholder="Selecione um pacote" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">
                      <div className="flex items-center justify-between w-full">
                        <span>Pack 5</span>
                        <span className="text-xs text-muted-foreground ml-4">5 créditos • ~90s cada</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="10">
                      <div className="flex items-center justify-between w-full">
                        <span>Pack 10</span>
                        <span className="text-xs text-muted-foreground ml-4">10 créditos • ~60s cada</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="50">
                      <div className="flex items-center justify-between w-full">
                        <span>Pack 50</span>
                        <span className="text-xs text-muted-foreground ml-4">50 créditos • ~45s cada</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="100">
                      <div className="flex items-center justify-between w-full">
                        <span>Pack 100</span>
                        <span className="text-xs text-muted-foreground ml-4">100 créditos • ~30s cada</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {packageSize && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>{PACKAGE_PRESETS[packageSize].label}:</strong> {PACKAGE_PRESETS[packageSize].description}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Custo: <strong>{packageSize} crédito(s)</strong> (1 crédito por clipe)
                    </p>
                  </div>
                )}
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Escolha quantos clipes sequenciais você deseja gerar
                </p>
              </div>

              {/* Campo 3: Duração (mostrar apenas se não usar pacote) */}
              {!packageSize && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    {t('home.clipDuration')}
                  </Label>
                  <Input 
                    className="h-12 text-base border-2 hover:border-purple-300 transition-colors"
                    type="number" 
                    value={clipDuration}
                    onChange={(e) => setClipDuration(e.target.value)}
                    placeholder="60"
                    min="30"
                    max="180"
                  />
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {t('home.clipDurationDesc')}
                  </p>
                </div>
              )}

              {/* Campo 4: Legendas */}
              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl border-2 border-purple-100">
                <Checkbox 
                  id="subtitles" 
                  checked={addSubtitles}
                  onCheckedChange={(checked) => setAddSubtitles(checked === true)}
                  className="h-5 w-5"
                />
                <Label htmlFor="subtitles" className="text-base font-medium cursor-pointer flex-1">
                  {t('home.addSubtitles')}
                </Label>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  +40% retenção
                </Badge>
              </div>

              {/* Campo 5: Escolha o Nicho */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  {t('home.chooseNiche')}
                </Label>
                <Select
                  value={vertical}
                  onValueChange={(value) => setVertical(value as VerticalType)}
                >
                  <SelectTrigger className="h-12 text-base border-2 hover:border-purple-300 transition-colors">
                    {vertical ? (
                      <span>{VERTICAIS_LIST.find(v => v.id === vertical)?.emoji} {VERTICAIS_LIST.find(v => v.id === vertical)?.name}</span>
                    ) : (
                      <SelectValue placeholder="Selecione o nicho do seu conteúdo" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {VERTICAIS_LIST.map((v: { id: string; emoji: string; name: string }) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.emoji} {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  {t('home.nicheDesc')}
                </p>
              </div>

              {/* Campo 6: Tipo de Conteúdo Secundário */}
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-600" />
                  {t('home.secondaryContent')}
                </Label>
                <RadioGroup 
                  value={secondaryType} 
                  onValueChange={(value) => {
                    setSecondaryType(value as SecondaryContentType);
                    setSelectedVideo(null);
                    setSelectedEmoji(null);
                  }} 
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all cursor-pointer">
                    <RadioGroupItem value="none" id="none" className="h-5 w-5" />
                    <Label htmlFor="none" className="flex-1 cursor-pointer font-medium">
                      {t('home.noSecondary')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all cursor-pointer">
                    <RadioGroupItem value="platform" id="platform" className="h-5 w-5" />
                    <Label htmlFor="platform" className="flex-1 cursor-pointer font-medium">
                      {t('home.platformVideos')}
                    </Label>
                    <Badge variant="outline">Popular</Badge>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all cursor-pointer">
                    <RadioGroupItem value="user" id="user" className="h-5 w-5" />
                    <Label htmlFor="user" className="flex-1 cursor-pointer font-medium">
                      {t('home.myVideos')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all cursor-pointer">
                    <RadioGroupItem value="emoji" id="emoji" className="h-5 w-5" />
                    <Label htmlFor="emoji" className="flex-1 cursor-pointer font-medium">
                      {t('home.emoji3D')}
                    </Label>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Novo</Badge>
                  </div>
                </RadioGroup>
              </div>

              {/* Campo 6: Galeria Condicional */}
              {secondaryType === 'platform' && vertical && (
                <div className="space-y-3 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-100">
                  <Label className="text-base font-semibold">Escolha o Vídeo de Retenção</Label>
                  <RetentionVideoGallery 
                    vertical={vertical as VerticalType}
                    selectedVideoId={selectedVideo}
                    onVideoSelect={setSelectedVideo}
                  />
                </div>
              )}

              {secondaryType === 'user' && vertical && (
                <div className="space-y-3 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-100">
                  <Label className="text-base font-semibold">Escolha Seu Vídeo</Label>
                  <UserVideoSelector 
                    vertical={vertical as VerticalType}
                    selectedVideoId={selectedVideo}
                    onVideoSelect={setSelectedVideo}
                  />
                  <p className="text-sm text-muted-foreground">
                    Não tem vídeos? <Link to="/my-retention-videos" className="text-purple-600 hover:text-purple-700 font-medium underline">Faça upload aqui</Link>
                  </p>
                </div>
              )}

              {secondaryType === 'emoji' && (
                <div className="space-y-3 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-100">
                  <Label className="text-base font-semibold">Escolha o Emoji 3D</Label>
                  <EmojiGallery 
                    selectedEmojiId={selectedEmoji}
                    onEmojiSelect={setSelectedEmoji}
                  />
                </div>
              )}

              {/* Campo 7: Headline */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Type className="h-5 w-5 text-purple-600" />
                  {t('home.headline')}
                </Label>
                <Input 
                  className="h-12 text-base border-2 hover:border-purple-300 transition-colors"
                  placeholder="Ex: Como Ganhar R$ 10k/mês" 
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  maxLength={100}
                />
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  {t('home.headlineDesc')}
                </p>
              </div>

              {/* Botão Final */}
              <Button 
                size="lg" 
                className="w-full h-12 md:h-14 text-base md:text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all text-white"
                onClick={handleCreateJob}
                disabled={!youtubeUrl || !vertical || createJob.isPending}
              >
                {createJob.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 md:h-6 md:w-6 animate-spin" />
                    {t('home.creating')}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                    {t('home.createJobButton')}
                    <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 4: PREVIEW */}
      <VideoPreview 
        hasSecondaryContent={secondaryType !== 'none'}
        hasSubtitles={addSubtitles}
        headline={headline || undefined}
      />
    </div>
  );
}
