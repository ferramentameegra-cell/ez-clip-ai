import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

/**
 * Hash de senha usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/**
 * Verifica senha
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Gera token JWT
 */
export function generateToken(userId: number, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Verifica token JWT
 */
export function verifyToken(token: string): { userId: number; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Busca usuário por email
 */
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result[0] || null;
}

/**
 * Busca usuário por ID
 */
export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result[0] || null;
}

/**
 * Cria novo usuário
 */
export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  language?: 'pt-BR' | 'es' | 'en';
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Verificar se email já existe
  const existingUser = await getUserByEmail(data.email);
  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  // Hash da senha
  const passwordHash = await hashPassword(data.password);

  // Criar usuário
  const result = await db.insert(users).values({
    email: data.email,
    passwordHash,
    name: data.name,
    loginMethod: 'email',
    credits: 3, // 3 créditos grátis
    language: data.language || 'pt-BR',
    acceptedTerms: false,
  });

  const userId = Number(result[0].insertId);
  const user = await getUserById(userId);

  if (!user) throw new Error('Erro ao criar usuário');

  return user;
}

/**
 * Login com email e senha
 */
export async function loginUser(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('Email ou senha incorretos');
  }

  if (!user.passwordHash) {
    throw new Error('Conta criada com outro método de login');
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error('Email ou senha incorretos');
  }

  // Atualizar último login
  const db = await getDb();
  if (db) {
    await db
      .update(users)
      .set({ lastSignedIn: new Date() })
      .where(eq(users.id, user.id));
  }

  // Gerar token
  const token = generateToken(user.id, user.email || '');

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      credits: user.credits,
      language: user.language,
      avatarUrl: user.avatarUrl,
    },
    token,
  };
}

