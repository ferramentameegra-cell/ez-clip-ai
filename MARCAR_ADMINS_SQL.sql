-- SQL para marcar os administradores com créditos ilimitados
-- Execute este SQL no banco de dados (Railway MySQL ou local)

-- Marcar os dois emails como admin
UPDATE users 
SET role = 'admin' 
WHERE email IN ('daniel.braun@hotmail.com', 'Josyasborba@hotmail.com');

-- Verificar se foram atualizados
SELECT id, email, role, credits 
FROM users 
WHERE email IN ('daniel.braun@hotmail.com', 'Josyasborba@hotmail.com');

-- Se quiser, pode também dar créditos iniciais altos (opcional)
-- UPDATE users 
-- SET credits = 10000 
-- WHERE email IN ('daniel.braun@hotmail.com', 'Josyasborba@hotmail.com');

