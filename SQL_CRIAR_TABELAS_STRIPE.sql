-- Script SQL para criar tabelas do Stripe
-- Execute este script no Railway (MySQL Dashboard > Query)

-- Adicionar coluna stripeCustomerId na tabela users (se não existir)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(256) UNIQUE;

-- Criar tabela subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  stripe_customer_id VARCHAR(256) NOT NULL,
  stripe_subscription_id VARCHAR(256) UNIQUE NOT NULL,
  price_id VARCHAR(256) NOT NULL,
  plan_key VARCHAR(256) NOT NULL,
  billing_interval VARCHAR(256) NOT NULL,
  status VARCHAR(256) NOT NULL,
  current_period_start TIMESTAMP NULL,
  current_period_end TIMESTAMP NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Criar tabela credit_ledgers
CREATE TABLE IF NOT EXISTS credit_ledgers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  delta INT NOT NULL,
  reason VARCHAR(256) NOT NULL,
  meta JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Verificar se foram criadas
DESCRIBE subscriptions;
DESCRIBE credit_ledgers;

