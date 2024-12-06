/// <reference path="../types/express.d.ts" />

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecretKey';

// Middleware para autenticar o token JWT
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido!' });
  }

  try {
    // Verifica e decodifica o token JWT
    const payload = jwt.verify(token, JWT_SECRET) as { id: number; nivel: string };
    req.user = payload; // Adiciona os dados do usuário ao objeto `req`
    console.log('User on Request:', req.user);
    next();
  } catch (err) {
    console.error('Erro ao verificar token:', err);
    return res.status(401).json({ message: 'Token inválido ou expirado!' });
  }
};

// Middleware para verificar permissões
export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({ message: 'Usuário não autenticado!' });
    }

    if (!roles.includes(req.user.nivel)) {
      return res.status(403).json({ message: 'Acesso negado! Permissão insuficiente.' });
    }

    next();
  };
};
