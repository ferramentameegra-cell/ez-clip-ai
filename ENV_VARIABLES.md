# Variáveis de Ambiente Necessárias

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL=mysql://user:pass@host:port/database

# Manus Forge API (Whisper)
BUILT_IN_FORGE_API_KEY=sua_key
BUILT_IN_FORGE_API_URL=https://api.manus.im

# S3 Storage
AWS_ACCESS_KEY_ID=sua_key
AWS_SECRET_ACCESS_KEY=sua_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=viral-clips

# OAuth APIs (opcional)
YOUTUBE_CLIENT_ID=seu_client_id
YOUTUBE_CLIENT_SECRET=seu_secret
TIKTOK_CLIENT_KEY=seu_key
TIKTOK_CLIENT_SECRET=seu_secret
INSTAGRAM_CLIENT_ID=seu_id
INSTAGRAM_CLIENT_SECRET=seu_secret

# JWT
JWT_SECRET=seu_secret_aleatorio

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

