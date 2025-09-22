/**
 * Interfaces compartilhadas para login e autenticação
 */

export interface LoginResponse {
  accessToken: string;
}

/**
 * Payload do JWT
 *
 * Usado para armazenar informações do usuário no token
 * sub: ID do usuário
 * role: Papel do usuário (ex: admin, user)
 */

export interface JwtPayload {
  sub: string;
  role: UserRole;
  name: string;
  iat?: number;
  exp?: number;
}

export type UserRole = 'ADMIN' | 'COSTUMER';
