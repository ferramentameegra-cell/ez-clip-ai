import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Loader2, Globe, Instagram, Youtube, Music } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useI18n } from '@/hooks/useI18n';
import type { Language } from 'shared/i18n';

export function Settings() {
  const { t, language, setLanguage } = useI18n();
  const [tiktokUsername, setTiktokUsername] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [youtubeChannelId, setYoutubeChannelId] = useState('');
  const [youtubeShortsEnabled, setYoutubeShortsEnabled] = useState(false);

  const { data: profile, isLoading } = trpc.auth.getProfile.useQuery();
  const updateSocialMedia = trpc.auth.updateSocialMedia.useMutation();
  const updateProfile = trpc.auth.updateProfile.useMutation();
  const initiateTikTok = trpc.oauth.initiateTikTok.useMutation();
  const initiateInstagram = trpc.oauth.initiateInstagram.useMutation();
  const initiateYouTube = trpc.oauth.initiateYouTube.useMutation();
  const disconnect = trpc.oauth.disconnect.useMutation();

  useEffect(() => {
    if (profile) {
      setTiktokUsername(profile.tiktokUsername || '');
      setInstagramUsername(profile.instagramUsername || '');
      setYoutubeChannelId(profile.youtubeChannelId || '');
      setYoutubeShortsEnabled(profile.youtubeShortsEnabled || false);
      
      // Carregar idioma do perfil se existir
      if (profile.language && ['pt-BR', 'en', 'es'].includes(profile.language)) {
        setLanguage(profile.language as Language);
      }
    }
  }, [profile, setLanguage]);

  const handleSave = async () => {
    try {
      await Promise.all([
        updateSocialMedia.mutateAsync({
          tiktokUsername: tiktokUsername || undefined,
          instagramUsername: instagramUsername || undefined,
          youtubeChannelId: youtubeChannelId || undefined,
          youtubeShortsEnabled,
        }),
        updateProfile.mutateAsync({
          language: language as Language,
        }),
      ]);
      toast.success(t('settings.saved'));
    } catch (error: any) {
      toast.error(error.message || t('common.error'));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">
      <Link href="/">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
      </Link>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('settings.preferences')}
          </CardTitle>
          <CardDescription>{t('settings.title')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">{t('settings.language')}</Label>
            <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
              <SelectTrigger id="language" className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">🇧🇷 Português</SelectItem>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="es">🇪🇸 Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5" />
            {t('settings.socialMedia')}
          </CardTitle>
          <CardDescription>
            Conecte suas redes sociais para publicar automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* TikTok */}
          <div className="space-y-2">
            <Label htmlFor="tiktok" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              {t('settings.tiktok')}
            </Label>
            <div className="flex gap-2">
              <Input
                id="tiktok"
                placeholder={tiktokUsername ? tiktokUsername : "@seu_usuario"}
                value={tiktokUsername}
                onChange={(e) => setTiktokUsername(e.target.value)}
                className="h-12"
                disabled={!!tiktokUsername}
              />
              {!tiktokUsername ? (
                <Button
                  type="button"
                  onClick={async () => {
                    try {
                      const result = await initiateTikTok.mutateAsync();
                      window.location.href = result.authUrl;
                    } catch (error: any) {
                      toast.error(error.message || 'Erro ao conectar TikTok');
                    }
                  }}
                  className="h-12"
                >
                  Conectar
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    try {
                      await disconnect.mutateAsync({ platform: 'tiktok' });
                      setTiktokUsername('');
                      toast.success('TikTok desconectado');
                    } catch (error: any) {
                      toast.error(error.message || 'Erro ao desconectar');
                    }
                  }}
                  className="h-12"
                >
                  Desconectar
                </Button>
              )}
            </div>
          </div>

          {/* Instagram */}
          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              {t('settings.instagram')}
            </Label>
            <div className="flex gap-2">
              <Input
                id="instagram"
                placeholder={instagramUsername ? instagramUsername : "@seu_usuario"}
                value={instagramUsername}
                onChange={(e) => setInstagramUsername(e.target.value)}
                className="h-12"
                disabled={!!instagramUsername}
              />
              {!instagramUsername ? (
                <Button
                  type="button"
                  onClick={async () => {
                    try {
                      const result = await initiateInstagram.mutateAsync();
                      window.location.href = result.authUrl;
                    } catch (error: any) {
                      toast.error(error.message || 'Erro ao conectar Instagram');
                    }
                  }}
                  className="h-12"
                >
                  Conectar
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    try {
                      await disconnect.mutateAsync({ platform: 'instagram' });
                      setInstagramUsername('');
                      toast.success('Instagram desconectado');
                    } catch (error: any) {
                      toast.error(error.message || 'Erro ao desconectar');
                    }
                  }}
                  className="h-12"
                >
                  Desconectar
                </Button>
              )}
            </div>
          </div>

          {/* YouTube */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtube" className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                {t('settings.youtube')}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="youtube"
                  placeholder={youtubeChannelId ? youtubeChannelId : "ID do Canal (ex: UCxxxxx)"}
                  value={youtubeChannelId}
                  onChange={(e) => setYoutubeChannelId(e.target.value)}
                  className="h-12"
                  disabled={!!youtubeChannelId}
                />
                {!youtubeChannelId ? (
                  <Button
                    type="button"
                    onClick={async () => {
                      try {
                        const result = await initiateYouTube.mutateAsync();
                        window.location.href = result.authUrl;
                      } catch (error: any) {
                        toast.error(error.message || 'Erro ao conectar YouTube');
                      }
                    }}
                    className="h-12"
                  >
                    Conectar
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      try {
                        await disconnect.mutateAsync({ platform: 'youtube' });
                        setYoutubeChannelId('');
                        setYoutubeShortsEnabled(false);
                        toast.success('YouTube desconectado');
                      } catch (error: any) {
                        toast.error(error.message || 'Erro ao desconectar');
                      }
                    }}
                    className="h-12"
                  >
                    Desconectar
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="youtube-shorts"
                checked={youtubeShortsEnabled}
                onCheckedChange={(checked) => setYoutubeShortsEnabled(checked === true)}
                disabled={!youtubeChannelId}
              />
              <Label htmlFor="youtube-shorts" className="cursor-pointer">
                {t('settings.youtubeShorts')} - {youtubeShortsEnabled ? t('settings.enabled') : t('settings.disabled')}
              </Label>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={updateSocialMedia.isPending || updateProfile.isPending}
            className="w-full"
          >
            {updateSocialMedia.isPending || updateProfile.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('common.loading')}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {t('settings.save')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

