import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecretKey';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(403).json({ message: 'Token não fornecido!' });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number; matricula: string; nivel: string };
    req.user = payload; // Aqui adicionamos `user` ao objeto `req`
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido ou expirado!' });
  }
};
