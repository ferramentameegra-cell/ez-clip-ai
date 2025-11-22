import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
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

  const url = `https://${BUCKET}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;

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
    return `https://${BUCKET}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
  }
}

// Exportar também como getSignedUrl para compatibilidade
export { storageGetSignedUrl as getSignedUrl };

