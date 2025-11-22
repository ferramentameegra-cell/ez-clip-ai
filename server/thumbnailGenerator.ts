/**
 * Gerador de thumbnails para clipes
 */

import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { storagePut } from './storage';
import { randomBytes } from 'crypto';

/**
 * Gera thumbnail de um vídeo (frame do meio)
 */
export async function generateThumbnail(
  videoPath: string,
  clipDuration: number
): Promise<{ thumbnailKey: string; thumbnailUrl: string }> {
  const tempDir = '/tmp/viral-clips';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const thumbnailPath = path.join(tempDir, `thumb_${randomBytes(4).toString('hex')}.jpg`);
  const frameTime = clipDuration / 2; // Frame do meio do vídeo

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: [frameTime],
        filename: path.basename(thumbnailPath),
        folder: path.dirname(thumbnailPath),
        size: '1080x1920', // Mesmo tamanho do vídeo
      })
      .on('end', async () => {
        try {
          // Upload thumbnail para S3
          const thumbnailBuffer = fs.readFileSync(thumbnailPath);
          const thumbnailKey = `thumbnails/${Date.now()}_${randomBytes(4).toString('hex')}.jpg`;
          const { url: thumbnailUrl } = await storagePut(thumbnailKey, thumbnailBuffer, 'image/jpeg');

          // Limpar arquivo temporário
          fs.unlinkSync(thumbnailPath);

          console.log(`[Thumbnail] Gerado: ${thumbnailUrl}`);
          resolve({ thumbnailKey, thumbnailUrl });
        } catch (error: any) {
          // Limpar arquivo temporário mesmo em caso de erro
          if (fs.existsSync(thumbnailPath)) {
            fs.unlinkSync(thumbnailPath);
          }
          reject(error);
        }
      })
      .on('error', (err) => {
        console.error(`[Thumbnail] Erro:`, err);
        reject(err);
      });
  });
}

