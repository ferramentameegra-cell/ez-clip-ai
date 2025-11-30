# ✅ Configurar Cloudflare R2 no Railway - Passo a Passo

## 🎉 Credenciais Obtidas!

Você tem tudo que precisa:

- ✅ Access Key ID: `5678184ebb4ec0655e6aa17914a4778f`
- ✅ Secret Access Key: `681c2a761fb74845efb37d7bd45b87c4e9331e72579012fc57aecad3ba805a61`
- ✅ Endpoint: `https://45a4af538d59d53aa52ef8179165e0da.r2.cloudflarestorage.com`
- ✅ Bucket: `ez-clip-ai`

---

## 🚀 Configurar no Railway

### Passo 1: Acessar Railway

1. Acesse: https://railway.app
2. Entre no seu projeto
3. Clique no serviço **ez-clip-ai**
4. Vá em **Variables**

---

### Passo 2: Adicionar Variáveis

Adicione estas **5 variáveis** (uma por uma):

#### Variável 1:
```
Nome: AWS_ACCESS_KEY_ID
Valor: 5678184ebb4ec0655e6aa17914a4778f
```

#### Variável 2:
```
Nome: AWS_SECRET_ACCESS_KEY
Valor: 681c2a761fb74845efb37d7bd45b87c4e9331e72579012fc57aecad3ba805a61
```

#### Variável 3:
```
Nome: AWS_REGION
Valor: auto
```

#### Variável 4:
```
Nome: AWS_S3_BUCKET
Valor: ez-clip-ai
```

#### Variável 5:
```
Nome: AWS_S3_ENDPOINT
Valor: https://45a4af538d59d53aa52ef8179165e0da.r2.cloudflarestorage.com
```

---

### Passo 3: Adicionar Cada Variável

Para cada variável:

1. Clique em **"New Variable"** ou **"Add Variable"**
2. Cole o **Nome** (ex: `AWS_ACCESS_KEY_ID`)
3. Cole o **Valor**
4. Clique em **"Add"** ou **"Save"**
5. Repita para todas as 5 variáveis

---

### Passo 4: Verificar

Depois de adicionar todas, você deve ter:

- ✅ `AWS_ACCESS_KEY_ID`
- ✅ `AWS_SECRET_ACCESS_KEY`
- ✅ `AWS_REGION` (auto)
- ✅ `AWS_S3_BUCKET` (ez-clip-ai)
- ✅ `AWS_S3_ENDPOINT`

---

### Passo 5: Deploy Automático

O Railway fará deploy automático (1-2 minutos).

---

## ✅ Depois de Configurar

1. Aguarde o deploy finalizar
2. Verifique os logs para confirmar que funcionou
3. Teste processando um vídeo

---

## 🎉 Pronto!

Depois de adicionar as 5 variáveis no Railway, o Cloudflare R2 estará configurado!

**Vou criar um resumo das variáveis para você copiar facilmente!** 🚀

