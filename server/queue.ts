/**
 * Sistema de fila de jobs usando Bull
 */

import Queue from 'bull';
import { processVideoJob } from './jobProcessor';

// Configurar Redis (usar REDIS_URL do .env ou padrão local)
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Criar fila de processamento de vídeo
export const videoQueue = new Queue('video-processing', {
  redis: redisUrl,
  defaultJobOptions: {
    attempts: 3, // Tentar até 3 vezes
    backoff: {
      type: 'exponential',
      delay: 2000, // 2s, 4s, 8s
    },
    removeOnComplete: {
      age: 24 * 3600, // Manter jobs completos por 24h
      count: 1000, // Manter últimos 1000 jobs
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Manter jobs falhados por 7 dias
    },
  },
});

// Processar jobs da fila
videoQueue.process(async (job) => {
  const { jobId } = job.data;
  console.log(`[Queue] Processando job ${jobId}...`);
  
  try {
    await processVideoJob(jobId);
    console.log(`[Queue] Job ${jobId} concluído com sucesso`);
    return { success: true, jobId };
  } catch (error: any) {
    console.error(`[Queue] Erro ao processar job ${jobId}:`, error.message);
    throw error; // Bull vai fazer retry automaticamente
  }
});

// Event listeners para monitoramento
videoQueue.on('completed', (job) => {
  console.log(`[Queue] ✅ Job ${job.data.jobId} completado`);
});

videoQueue.on('failed', (job, err) => {
  console.error(`[Queue] ❌ Job ${job?.data?.jobId} falhou:`, err.message);
});

videoQueue.on('stalled', (job) => {
  console.warn(`[Queue] ⚠️ Job ${job.data.jobId} travado`);
});

// Limpar fila ao encerrar
process.on('SIGTERM', async () => {
  console.log('[Queue] Encerrando fila...');
  await videoQueue.close();
});

export default videoQueue;

