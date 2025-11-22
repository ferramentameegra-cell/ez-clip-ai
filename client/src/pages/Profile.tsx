import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useI18n } from '@/hooks/useI18n';

export function Profile() {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = trpc.auth.getProfile.useQuery();
  const updateProfile = trpc.auth.updateProfile.useMutation();
  const uploadAvatar = trpc.auth.uploadAvatar.useMutation();

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatarUrl || null);
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        name,
        bio,
      });
      setIsEditing(false);
      toast.success(t('profile.saved'));
    } catch (error: any) {
      toast.error(error.message || t('common.error'));
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    try {
      const result = await uploadAvatar.mutateAsync({ file });
      setAvatarUrl(result.avatarUrl);
      toast.success('Foto atualizada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer upload da foto');
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
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Link href="/">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('profile.title')}</CardTitle>
          <CardDescription>{t('profile.edit')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={avatarUrl || undefined} alt={name} />
              <AvatarFallback className="text-2xl">
                {name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
                disabled={uploadAvatar.isPending}
              />
              <Button
                variant="outline"
                disabled={uploadAvatar.isPending}
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                {uploadAvatar.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    {avatarUrl ? t('profile.changePhoto') : t('profile.uploadPhoto')}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('profile.name')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('profile.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="h-12 bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                O e-mail não pode ser alterado
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">{t('profile.bio')}</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!isEditing}
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Conte um pouco sobre você..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={updateProfile.isPending}
                  className="flex-1"
                >
                  {updateProfile.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t('profile.save')}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    // Resetar valores
                    if (profile) {
                      setName(profile.name || '');
                      setBio(profile.bio || '');
                    }
                  }}
                  className="flex-1"
                >
                  {t('profile.cancel')}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex-1"
              >
                {t('profile.edit')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

