# 🚀 Como Configurar Cloudflare R2 (Passo a Passo)

## 📋 Resumo

Cloudflare R2 é **97% mais barato que AWS S3** porque não cobra taxas de download (egress). Ideal para vídeos!

---

## 🎯 Passo a Passo Completo

### Passo 1: Criar Conta Cloudflare (Grátis)

1. Acesse: https://dash.cloudflare.com/sign-up
2. Preencha:
   - Email
   - Senha
3. Clique em **"Sign up"**
4. Verifique seu email (vai receber link de confirmação)

**⏱️ Tempo:** 2 minutos

---

### Passo 2: Ativar R2 (Se necessário)

1. Faça login no dashboard: https://dash.cloudflare.com
2. No menu lateral, procure por **"R2"**
3. Se aparecer "R2 is now available", clique para ativar
4. Aceite os termos (se necessário)

**⏱️ Tempo:** 1 minuto

---

### Passo 3: Criar Bucket

1. No dashboard, clique em **"R2"** no menu lateral
2. Clique no botão **"Create bucket"**
3. Preencha:
   - **Bucket name:** `ez-clip-ai` (ou outro nome)
   - **Location:** `auto` (ou escolha uma região próxima)
4. Clique em **"Create bucket"**

**✅ Pronto! Bucket criado!**

**⏱️ Tempo:** 2 minutos

---

### Passo 4: Criar API Token (Credenciais)

1. No dashboard R2, vá em **"Manage R2 API Tokens"** (no menu lateral ou no topo)
2. Clique em **"Create API token"**
3. Preencha:
   - **Token name:** `ez-clip-ai-token`
   - **Permissions:** Selecione **"Admin Read & Write"** (ou crie permissões customizadas)
   - **TTL:** Deixe vazio (sem expiração) ou defina data
4. Clique em **"Create API Token"**
5. **⚠️ IMPORTANTE:** Copie as credenciais que aparecerem:
   - **Access Key ID** (ex: `a1b2c3d4e5f6...`)
   - **Secret Access Key** (ex: `xyz123...`)

**⚠️ ATENÇÃO:** A Secret Access Key só aparece UMA vez! Guarde em local seguro!

**⏱️ Tempo:** 3 minutos

---

### Passo 5: Encontrar Account ID e Endpoint

O endpoint do R2 usa seu Account ID. Para encontrar:

1. No dashboard, clique em **"R2"** → **"Manage R2 API Tokens"**
2. O **Account ID** aparece no topo da página (ex: `a1b2c3d4e5f6...`)
3. **Anote este Account ID!**

**Endpoint format:**
```
https://[ACCOUNT_ID].r2.cloudflarestorage.com
```

Exemplo:
```
https://a1b2c3d4e5f6789.r2.cloudflarestorage.com
```

**⏱️ Tempo:** 1 minuto

---

### Passo 6: Configurar no Railway

1. Acesse seu projeto no Railway
2. Vá em **Variables**
3. Adicione/atualize estas variáveis:

```env
AWS_ACCESS_KEY_ID=[seu-access-key-id-do-passo-4]
AWS_SECRET_ACCESS_KEY=[seu-secret-access-key-do-passo-4]
AWS_REGION=auto
AWS_S3_BUCKET=ez-clip-ai
AWS_S3_ENDPOINT=https://[SEU-ACCOUNT-ID].r2.cloudflarestorage.com
```

**Substitua:**
- `[seu-access-key-id-do-passo-4]` → O Access Key ID que você copiou
- `[seu-secret-access-key-do-passo-4]` → O Secret Access Key que você copiou
- `[SEU-ACCOUNT-ID]` → O Account ID do Passo 5
- `ez-clip-ai` → O nome do bucket que você criou (se diferente)

**Exemplo completo:**
```env
AWS_ACCESS_KEY_ID=a1b2c3d4e5f6g7h8i9j0
AWS_SECRET_ACCESS_KEY=xyz123abc456def789ghi012jkl345
AWS_REGION=auto
AWS_S3_BUCKET=ez-clip-ai
AWS_S3_ENDPOINT=https://a1b2c3d4e5f6789.r2.cloudflarestorage.com
```

4. Clique em **Add** ou **Save** para cada variável
5. Aguarde o deploy automático (1-2 minutos)

**⏱️ Tempo:** 3 minutos

---

### Passo 7: Verificar se Funcionou

1. No Railway, vá em **Deployments**
2. Veja os logs do último deployment
3. Procure por mensagens de erro relacionadas a S3
4. Se não houver erros, está funcionando! ✅

**Para testar:**
1. Acesse seu site
2. Faça upload de um arquivo ou processe um vídeo
3. Veja os logs para confirmar que o upload funcionou

**⏱️ Tempo:** 2 minutos

---

## ✅ Checklist Completo

- [ ] Conta Cloudflare criada
- [ ] R2 ativado
- [ ] Bucket criado
- [ ] API Token criado
- [ ] Access Key ID copiado
- [ ] Secret Access Key copiado
- [ ] Account ID encontrado
- [ ] Variáveis adicionadas no Railway:
  - [ ] `AWS_ACCESS_KEY_ID`
  - [ ] `AWS_SECRET_ACCESS_KEY`
  - [ ] `AWS_REGION=auto`
  - [ ] `AWS_S3_BUCKET`
  - [ ] `AWS_S3_ENDPOINT`
- [ ] Deploy finalizado
- [ ] Teste de upload realizado

---

## 💰 Comparação de Custos

### Exemplo: 100GB de vídeos, 500GB de downloads/mês

| Serviço | Armazenamento | Download | **Total** |
|---------|---------------|----------|-----------|
| **AWS S3** | $2.30 | $45.00 | **$47.30/mês** |
| **Cloudflare R2** | $1.50 | **$0.00** | **$1.50/mês** |

**💰 Economia: $45.80/mês (97% mais barato!)**

---

## 🔒 Segurança

Cloudflare R2 é tão seguro quanto AWS S3:
- ✅ Criptografia em repouso
- ✅ Criptografia em trânsito (HTTPS)
- ✅ Compliance (GDPR, SOC 2, etc.)
- ✅ Controle de acesso granular

---

## 🆘 Problemas Comuns

### Erro: "Access Denied"

**Solução:**
- Verifique se o Access Key ID está correto
- Verifique se o Secret Access Key está correto
- Verifique se o bucket name está correto

### Erro: "Endpoint not found"

**Solução:**
- Verifique se `AWS_S3_ENDPOINT` está no formato correto
- Deve ser: `https://[ACCOUNT_ID].r2.cloudflarestorage.com`
- Certifique-se de que não tem `/` no final

### Erro: "Bucket not found"

**Solução:**
- Verifique se o nome do bucket está correto em `AWS_S3_BUCKET`
- Verifique se o bucket existe no dashboard da Cloudflare

---

## 📞 Precisa de Ajuda?

Se tiver problemas:
1. Veja os logs do Railway
2. Verifique se todas as variáveis estão corretas
3. Confirme que o bucket existe no Cloudflare

---

## 🎉 Pronto!

Agora você está usando Cloudflare R2 e economizando 97% comparado ao AWS S3! 🚀

**Tempo total:** ~15 minutos  
**Economia:** ~$45/mês 💰

