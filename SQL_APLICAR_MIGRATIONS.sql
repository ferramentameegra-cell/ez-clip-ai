-- SQL para adicionar campos de onboarding na tabela users
-- Execute este SQL no banco de dados (Railway MySQL ou local)

-- Verificar se as colunas já existem
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME IN ('onboarding_use_case', 'onboarding_niche', 'onboarding_at');

-- Se não existirem, execute os comandos abaixo:

ALTER TABLE users 
ADD COLUMN onboarding_use_case TEXT,
ADD COLUMN onboarding_niche VARCHAR(255),
ADD COLUMN onboarding_at TIMESTAMP;

-- Verificar se foi criado com sucesso
DESCRIBE users;

