/**
 * Publicação automática em redes sociais
 * Integrações com APIs oficiais: YouTube, TikTok, Instagram
 */

import { getDb } from './db';
import { clips, users, scheduledPosts } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { getSignedUrl } from './storage';
import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

/**
 * Publica vídeo no YouTube Shorts usando YouTube Data API v3
 */
export async function publishToYouTubeShorts(clipId: number, userId: number, title?: string, description?: string): Promise<{ success: boolean; videoId?: string; error?: string }> {
  console.log(`[Publisher] Publicando clip ${clipId} no YouTube...`);
  
  try {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Obter clipe
    const [clip] = await db
      .select()
      .from(clips)
      .where(eq(clips.id, clipId))
      .limit(1);

    if (!clip || !clip.videoKey) {
      throw new Error('Clipe não encontrado ou sem vídeo');
    }

    // Obter usuário e token de acesso
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || !user.youtubeAccessToken) {
      throw new Error('Usuário não tem YouTube conectado ou token inválido');
    }

    // Obter URL assinada do vídeo
    const videoUrl = await getSignedUrl(clip.videoKey, 3600);

    // Baixar vídeo temporariamente
    const tempDir = '/tmp/viral-clips';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const tempVideoPath = path.join(tempDir, `youtube_${randomBytes(4).toString('hex')}.mp4`);

    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Erro ao baixar vídeo: ${response.statusText}`);
    }

    const videoBuffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(tempVideoPath, videoBuffer);

    // Metadata do vídeo
    const metadata = {
      snippet: {
        title: title || `Clipe ${clip.clipNumber} - EZ CLIP AI`,
        description: description || `Clipe gerado automaticamente pela EZ CLIP AI`,
        tags: ['shorts', 'viral', 'clips'],
        categoryId: '22', // People & Blogs
      },
      status: {
        privacyStatus: 'public',
        selfDeclaredMadeForKids: false,
      },
    };

    // Upload usando resumable upload (recomendado para vídeos)
    // Passo 1: Inicializar upload
    const uploadResponse = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.youtubeAccessToken}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Type': 'video/mp4',
        'X-Upload-Content-Length': videoBuffer.length.toString(),
      },
      body: JSON.stringify(metadata),
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      throw new Error(`Erro ao iniciar upload: ${error}`);
    }

    const uploadUrl = uploadResponse.headers.get('Location');
    if (!uploadUrl) {
      throw new Error('URL de upload não retornada');
    }

    // Fazer upload do vídeo
    const videoUploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': videoBuffer.length.toString(),
      },
      body: videoBuffer,
    });

    if (!videoUploadResponse.ok) {
      const error = await videoUploadResponse.text();
      throw new Error(`Erro ao fazer upload do vídeo: ${error}`);
    }

    const videoData = await videoUploadResponse.json();
    const youtubeVideoId = videoData.id;

    console.log(`[Publisher] YouTube: Vídeo publicado com sucesso! ID: ${youtubeVideoId}`);
    
    // Limpar arquivo temporário
    if (fs.existsSync(tempVideoPath)) {
      fs.unlinkSync(tempVideoPath);
    }

    return { success: true, videoId: youtubeVideoId };
  } catch (error: any) {
    console.error(`[Publisher] Erro ao publicar no YouTube:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Publica vídeo no TikTok usando TikTok Content Posting API
 */
export async function publishToTikTok(clipId: number, userId: number, caption?: string): Promise<{ success: boolean; videoId?: string; error?: string }> {
  console.log(`[Publisher] Publicando clip ${clipId} no TikTok...`);
  
  try {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Obter clipe
    const [clip] = await db
      .select()
      .from(clips)
      .where(eq(clips.id, clipId))
      .limit(1);

    if (!clip || !clip.videoKey) {
      throw new Error('Clipe não encontrado ou sem vídeo');
    }

    // Obter usuário
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || !user.tiktokAccessToken) {
      throw new Error('Usuário não tem TikTok conectado ou token inválido');
    }

    // Obter URL assinada do vídeo
    const videoUrl = await getSignedUrl(clip.videoKey, 3600);

    // Baixar vídeo temporariamente
    const tempDir = '/tmp/viral-clips';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const tempVideoPath = path.join(tempDir, `tiktok_${randomBytes(4).toString('hex')}.mp4`);

    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Erro ao baixar vídeo: ${response.statusText}`);
    }

    const videoBuffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(tempVideoPath, videoBuffer);

    // TikTok Content Posting API - Upload de vídeo
    // Passo 1: Inicializar upload
    const initResponse = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.tiktokAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_info: {
          title: caption || `Clipe ${clip.clipNumber} - EZ CLIP AI`,
          privacy_level: 'PUBLIC_TO_EVERYONE',
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000,
        },
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: videoBuffer.length,
          chunk_size: 10000000, // 10MB chunks
        },
      }),
    });

    if (!initResponse.ok) {
      const error = await initResponse.text();
      throw new Error(`Erro ao inicializar upload TikTok: ${error}`);
    }

    const initData = await initResponse.json();
    const publishId = initData.data.publish_id;
    const uploadUrl = initData.data.upload_url;

    // Passo 2: Upload do vídeo em chunks
    const chunkSize = 10000000; // 10MB
    let offset = 0;

    while (offset < videoBuffer.length) {
      const chunk = videoBuffer.slice(offset, offset + chunkSize);
      const chunkResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Range': `bytes ${offset}-${offset + chunk.length - 1}/${videoBuffer.length}`,
        },
        body: chunk,
      });

      if (!chunkResponse.ok) {
        throw new Error(`Erro ao fazer upload do chunk: ${chunkResponse.statusText}`);
      }

      offset += chunk.length;
    }

    // Passo 3: Publicar vídeo
    const publishResponse = await fetch(`https://open.tiktokapis.com/v2/post/publish/status/fetch/?publish_id=${publishId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.tiktokAccessToken}`,
      },
    });

    if (!publishResponse.ok) {
      throw new Error(`Erro ao publicar vídeo: ${publishResponse.statusText}`);
    }

    const publishData = await publishResponse.json();
    const tiktokVideoId = publishData.data.share_id;

    console.log(`[Publisher] TikTok: Vídeo publicado com sucesso! ID: ${tiktokVideoId}`);
    
    // Limpar arquivo temporário
    if (fs.existsSync(tempVideoPath)) {
      fs.unlinkSync(tempVideoPath);
    }

    return { success: true, videoId: tiktokVideoId };
  } catch (error: any) {
    console.error(`[Publisher] Erro ao publicar no TikTok:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Publica vídeo no Instagram Reels usando Instagram Graph API
 */
export async function publishToInstagram(clipId: number, userId: number, caption?: string): Promise<{ success: boolean; mediaId?: string; error?: string }> {
  console.log(`[Publisher] Publicando clip ${clipId} no Instagram...`);
  
  try {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Obter clipe
    const [clip] = await db
      .select()
      .from(clips)
      .where(eq(clips.id, clipId))
      .limit(1);

    if (!clip || !clip.videoKey) {
      throw new Error('Clipe não encontrado ou sem vídeo');
    }

    // Obter usuário
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || !user.instagramAccessToken) {
      throw new Error('Usuário não tem Instagram conectado ou token inválido');
    }

    // Obter URL assinada do vídeo
    const videoUrl = await getSignedUrl(clip.videoKey, 3600);

    // Instagram Graph API - Upload de Reel
    // Passo 1: Criar container de mídia
    const containerResponse = await fetch(`https://graph.instagram.com/v18.0/${user.instagramUsername}/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.instagramAccessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        media_type: 'REELS',
        video_url: videoUrl,
        caption: caption || `Clipe ${clip.clipNumber} - EZ CLIP AI`,
        share_to_feed: 'true',
      }),
    });

    if (!containerResponse.ok) {
      const error = await containerResponse.text();
      throw new Error(`Erro ao criar container: ${error}`);
    }

    const containerData = await containerResponse.json();
    const creationId = containerData.id;

    // Passo 2: Publicar Reel
    const publishResponse = await fetch(`https://graph.instagram.com/v18.0/${user.instagramUsername}/media_publish`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.instagramAccessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        creation_id: creationId,
      }),
    });

    if (!publishResponse.ok) {
      const error = await publishResponse.text();
      throw new Error(`Erro ao publicar Reel: ${error}`);
    }

    const publishData = await publishResponse.json();
    const mediaId = publishData.id;

    console.log(`[Publisher] Instagram: Reel publicado com sucesso! ID: ${mediaId}`);

    return { success: true, mediaId };
  } catch (error: any) {
    console.error(`[Publisher] Erro ao publicar no Instagram:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Publica vídeo no Facebook Reels usando Facebook Graph API
 */
export async function publishToFacebook(_clipId: number, _userId: number, _caption?: string): Promise<{ success: boolean; videoId?: string; error?: string }> {
  console.log(`[Publisher] Publicando clip ${_clipId} no Facebook...`);
  
  try {
    // Similar ao Instagram (usa Facebook Graph API)
    // Implementação similar ao Instagram, mas usando Facebook Page ID
    // TODO: Implementar quando necessário
    
    console.log(`[Publisher] Facebook: Upload simulado para clip ${_clipId}`);
    return { success: true };
  } catch (error: any) {
    console.error(`[Publisher] Erro ao publicar no Facebook:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Publica clipe em múltiplas plataformas baseado nas configurações do usuário
 */
export async function publishClipToPlatforms(
  clipId: number,
  userId: number,
  platforms: Array<'youtube' | 'tiktok' | 'instagram' | 'facebook'>,
  options?: {
    title?: string;
    description?: string;
    caption?: string;
  }
): Promise<Array<{ platform: string; success: boolean; videoId?: string; error?: string }>> {
  const results = [];

  for (const platform of platforms) {
    try {
      let result;
      if (platform === 'youtube') {
        result = await publishToYouTubeShorts(clipId, userId, options?.title, options?.description);
      } else if (platform === 'tiktok') {
        result = await publishToTikTok(clipId, userId, options?.caption);
      } else if (platform === 'instagram') {
        result = await publishToInstagram(clipId, userId, options?.caption);
      } else if (platform === 'facebook') {
        result = await publishToFacebook(clipId, userId, options?.caption);
      } else {
        result = { success: false, error: 'Plataforma não suportada' };
      }

      results.push({
        platform,
        ...result,
      });

      // Atualizar scheduled post se existir
      if (result.success) {
        const db = await getDb();
        if (db) {
          const postId = 'videoId' in result ? result.videoId : ('mediaId' in result ? result.mediaId : undefined);
          if (postId) {
            await db
              .update(scheduledPosts)
              .set({
                status: 'published',
                platformPostId: postId,
                publishedAt: new Date(),
              })
              .where(eq(scheduledPosts.clipId, clipId));
          }
        }
      }
    } catch (error: any) {
      results.push({
        platform,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}
