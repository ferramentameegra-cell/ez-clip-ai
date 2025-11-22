import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import { getDb } from '../db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Router de OAuth para integração com redes sociais
 * Suporta: YouTube, TikTok, Instagram
 */

export const oauthRouter = router({
  // Iniciar fluxo OAuth do YouTube
  initiateYouTube: protectedProcedure
    .mutation(async ({ ctx }) => {
      const clientId = process.env.YOUTUBE_CLIENT_ID;
      const redirectUri = process.env.YOUTUBE_REDIRECT_URI || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/youtube/callback`;
      
      if (!clientId) {
        throw new Error('YouTube OAuth não configurado. Configure YOUTUBE_CLIENT_ID no .env');
      }

      const scope = 'https://www.googleapis.com/auth/youtube.upload';
      const state = Buffer.from(JSON.stringify({ userId: ctx.user.id })).toString('base64');
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(scope)}&` +
        `access_type=offline&` +
        `prompt=consent&` +
        `state=${encodeURIComponent(state)}`;

      return { authUrl, state };
    }),

  // Callback do YouTube OAuth
  callbackYouTube: publicProcedure
    .input(z.object({
      code: z.string(),
      state: z.string(),
    }))
    .mutation(async ({ input }) => {
      const clientId = process.env.YOUTUBE_CLIENT_ID;
      const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
      const redirectUri = process.env.YOUTUBE_REDIRECT_URI || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/youtube/callback`;

      if (!clientId || !clientSecret) {
        throw new Error('YouTube OAuth não configurado');
      }

      // Decodificar state
      const stateData = JSON.parse(Buffer.from(input.state, 'base64').toString());
      const userId = stateData.userId;

      // Trocar code por access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code: input.code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        throw new Error(`Erro ao obter token: ${error}`);
      }

      const tokens = await tokenResponse.json();

      // Salvar tokens no banco (em produção, use criptografia)
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      // Obter informações do canal
      const channelResponse = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      });

      let channelId = null;
      if (channelResponse.ok) {
        const channelData = await channelResponse.json();
        channelId = channelData.items?.[0]?.id || null;
      }

      await db
        .update(users)
        .set({
          youtubeChannelId: channelId,
          youtubeAccessToken: tokens.access_token,
          youtubeRefreshToken: tokens.refresh_token || null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return { success: true, message: 'YouTube conectado com sucesso!' };
    }),

  // Iniciar fluxo OAuth do TikTok
  initiateTikTok: protectedProcedure
    .mutation(async ({ ctx }) => {
      const clientKey = process.env.TIKTOK_CLIENT_KEY;
      const redirectUri = process.env.TIKTOK_REDIRECT_URI || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/tiktok/callback`;

      if (!clientKey) {
        throw new Error('TikTok OAuth não configurado. Configure TIKTOK_CLIENT_KEY no .env');
      }

      const scope = 'user.info.basic,video.upload';
      const state = Buffer.from(JSON.stringify({ userId: ctx.user.id })).toString('base64');
      
      const authUrl = `https://www.tiktok.com/v2/auth/authorize?` +
        `client_key=${encodeURIComponent(clientKey)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(scope)}&` +
        `state=${encodeURIComponent(state)}`;

      return { authUrl, state };
    }),

  // Callback do TikTok OAuth
  callbackTikTok: publicProcedure
    .input(z.object({
      code: z.string(),
      state: z.string(),
    }))
    .mutation(async ({ input }) => {
      const clientKey = process.env.TIKTOK_CLIENT_KEY;
      const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
      const redirectUri = process.env.TIKTOK_REDIRECT_URI || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/tiktok/callback`;

      if (!clientKey || !clientSecret) {
        throw new Error('TikTok OAuth não configurado');
      }

      // Decodificar state
      const stateData = JSON.parse(Buffer.from(input.state, 'base64').toString());
      const userId = stateData.userId;

      // Trocar code por access token
      const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_key: clientKey,
          client_secret: clientSecret,
          code: input.code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        throw new Error(`Erro ao obter token: ${error}`);
      }

      const tokens = await tokenResponse.json();

      // Salvar tokens no banco
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      // Obter informações do usuário TikTok
      const userInfoResponse = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      });

      let username = null;
      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json();
        username = userInfo.data?.user?.display_name || null;
      }

      await db
        .update(users)
        .set({
          tiktokUsername: username,
          tiktokAccessToken: tokens.access_token,
          tiktokRefreshToken: tokens.refresh_token || null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return { success: true, message: 'TikTok conectado com sucesso!' };
    }),

  // Iniciar fluxo OAuth do Instagram
  initiateInstagram: protectedProcedure
    .mutation(async ({ ctx }) => {
      const appId = process.env.INSTAGRAM_APP_ID;
      const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/instagram/callback`;

      if (!appId) {
        throw new Error('Instagram OAuth não configurado. Configure INSTAGRAM_APP_ID no .env');
      }

      const scope = 'user_profile,user_media';
      const state = Buffer.from(JSON.stringify({ userId: ctx.user.id })).toString('base64');
      
      const authUrl = `https://api.instagram.com/oauth/authorize?` +
        `client_id=${encodeURIComponent(appId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `response_type=code&` +
        `state=${encodeURIComponent(state)}`;

      return { authUrl, state };
    }),

  // Callback do Instagram OAuth
  callbackInstagram: publicProcedure
    .input(z.object({
      code: z.string(),
      state: z.string(),
    }))
    .mutation(async ({ input }) => {
      const appId = process.env.INSTAGRAM_APP_ID;
      const appSecret = process.env.INSTAGRAM_APP_SECRET;
      const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/instagram/callback`;

      if (!appId || !appSecret) {
        throw new Error('Instagram OAuth não configurado');
      }

      // Decodificar state
      const stateData = JSON.parse(Buffer.from(input.state, 'base64').toString());
      const userId = stateData.userId;

      // Trocar code por access token
      const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: appId,
          client_secret: appSecret,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code: input.code,
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        throw new Error(`Erro ao obter token: ${error}`);
      }

      const tokens = await tokenResponse.json();

      // Salvar tokens no banco
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      // Obter informações do usuário Instagram
      const userInfoResponse = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${tokens.access_token}`);

      let username = null;
      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json();
        username = userInfo.username || userInfo.id || null;
      }

      await db
        .update(users)
        .set({
          instagramUsername: username,
          instagramAccessToken: tokens.access_token,
          instagramRefreshToken: tokens.refresh_token || null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return { success: true, message: 'Instagram conectado com sucesso!' };
    }),

  // Desconectar rede social
  disconnect: protectedProcedure
    .input(z.object({
      platform: z.enum(['youtube', 'tiktok', 'instagram']),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const updateData: any = {};
      if (input.platform === 'youtube') {
        updateData.youtubeChannelId = null;
        updateData.youtubeShortsEnabled = false;
        updateData.youtubeAccessToken = null;
        updateData.youtubeRefreshToken = null;
      } else if (input.platform === 'tiktok') {
        updateData.tiktokUsername = null;
        updateData.tiktokAccessToken = null;
        updateData.tiktokRefreshToken = null;
      } else if (input.platform === 'instagram') {
        updateData.instagramUsername = null;
        updateData.instagramAccessToken = null;
        updateData.instagramRefreshToken = null;
      }

      await db
        .update(users)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id));

      return { success: true, message: `${input.platform} desconectado com sucesso!` };
    }),
});

