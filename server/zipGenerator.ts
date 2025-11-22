/**
 * Gerador de ZIP para download de clipes
 */

import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { getSignedUrl } from './storage';
import { storagePut } from './storage';
import { getClipsByJobId } from './db';
import { randomBytes } from 'crypto';

export interface ZipResult {
  zipKey: string;
  zipUrl: string;
}

/**
 * Gera ZIP com todos os clipes de um job
 */
export async function generateJobZip(jobId: number): Promise<ZipResult> {
  console.log(`[Zip] Gerando ZIP para job ${jobId}...`);

  // Obter todos os clipes do job
  const clips = await getClipsByJobId(jobId);
  
  if (clips.length === 0) {
    throw new Error('Nenhum clipe encontrado para este job');
  }

  const tempDir = '/tmp/viral-clips';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const zipPath = path.join(tempDir, `job_${jobId}_${randomBytes(4).toString('hex')}.zip`);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', async () => {
      console.log(`[Zip] ZIP criado: ${zipPath} (${archive.pointer()} bytes)`);

      try {
        // Upload ZIP para S3
        const zipBuffer = fs.readFileSync(zipPath);
        const zipKey = `zips/job_${jobId}_${Date.now()}.zip`;
        const { url: zipUrl } = await storagePut(zipKey, zipBuffer, 'application/zip');

        // Limpar arquivo temporário
        fs.unlinkSync(zipPath);

        console.log(`[Zip] ZIP enviado para S3: ${zipUrl}`);

        resolve({ zipKey, zipUrl });
      } catch (error: any) {
        // Limpar arquivo temporário mesmo em caso de erro
        if (fs.existsSync(zipPath)) {
          fs.unlinkSync(zipPath);
        }
        reject(error);
      }
    });

    archive.on('error', (err) => {
      console.error(`[Zip] Erro ao criar ZIP:`, err);
      reject(err);
    });

    archive.pipe(output);

    // Adicionar cada clipe ao ZIP
    let addedCount = 0;
    const downloadPromises = clips.map(async (clip, index) => {
      if (!clip.videoKey) {
        console.warn(`[Zip] Clipe ${clip.id} sem videoKey, pulando...`);
        return;
      }

      try {
        // Obter URL assinada do S3 (válida por 1 hora)
        const signedUrl = await getSignedUrl(clip.videoKey, 3600);
        
        // Baixar vídeo temporariamente
        const response = await fetch(signedUrl);
        if (!response.ok) {
          throw new Error(`Erro ao baixar clipe: ${response.statusText}`);
        }

        const videoBuffer = Buffer.from(await response.arrayBuffer());
        const clipFilename = `clip_${String(clip.clipNumber || index + 1).padStart(3, '0')}.mp4`;
        
        // Adicionar ao ZIP
        archive.append(videoBuffer, { name: clipFilename });
        addedCount++;

        console.log(`[Zip] Clipe ${clip.id} adicionado ao ZIP`);
      } catch (error: any) {
        console.error(`[Zip] Erro ao adicionar clipe ${clip.id}:`, error.message);
        // Continuar mesmo se um clipe falhar
      }
    });

    // Aguardar todos os downloads
    Promise.all(downloadPromises).then(() => {
      if (addedCount === 0) {
        archive.abort();
        reject(new Error('Nenhum clipe pôde ser adicionado ao ZIP'));
        return;
      }

      console.log(`[Zip] ${addedCount} clipes adicionados, finalizando ZIP...`);
      archive.finalize();
    });
  });
}

