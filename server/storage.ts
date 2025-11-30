import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

// Suporta AWS S3, Cloudflare R2, Backblaze B2, DigitalOcean Spaces, etc.
// (todos são compatíveis com S3 API)
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.AWS_S3_ENDPOINT || undefined, // Para Cloudflare R2, Backblaze B2, etc.
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: process.env.AWS_S3_ENDPOINT ? true : false, // Necessário para R2 e outras alternativas
});

const BUCKET = process.env.AWS_S3_BUCKET || 'viral-clips';

/**
 * Upload de arquivo para S3
 */
export async function storagePut(
  key: string,
  body: Buffer | string,
  contentType: string
): Promise<{ url: string; key: string }> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Construir URL baseado no endpoint configurado
  let url: string;
  if (process.env.AWS_S3_ENDPOINT) {
    // Para Cloudflare R2, Backblaze B2, etc. (usando path-style)
    const endpoint = process.env.AWS_S3_ENDPOINT.replace(/\/$/, ''); // Remove trailing slash
    url = `${endpoint}/${BUCKET}/${key}`;
  } else {
    // Para AWS S3 padrão (virtual-hosted style)
    url = `https://${BUCKET}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
  }

  return { url, key };
}

/**
 * Gera URL assinada para download
 */
export async function storageGetSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error: any) {
    console.error('[storageGetSignedUrl] Erro:', error);
    // Se S3 não estiver configurado, retornar URL pública como fallback
    if (process.env.AWS_S3_ENDPOINT) {
      const endpoint = process.env.AWS_S3_ENDPOINT.replace(/\/$/, '');
      return `${endpoint}/${BUCKET}/${key}`;
    }
    return `https://${BUCKET}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
  }
}

// Exportar também como getSignedUrl para compatibilidade
export { storageGetSignedUrl as getSignedUrl };

