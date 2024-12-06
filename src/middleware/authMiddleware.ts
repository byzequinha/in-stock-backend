import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecretKey';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido!' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number; nivel: string };
    req.user = payload; // Adiciona os dados do usuário ao objeto `req`
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado!' });
  }
};

// Middleware para verificar permissões
export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.nivel)) {
      return res.status(403).json({ message: 'Acesso negado!' });
    }
    next();
  };
};
