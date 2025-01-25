import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecretKey';

// Define o tipo do payload do JWT
interface CustomJwtPayload extends JwtPayload {
  id: number;
  matricula: string;
  nivel: string;
}

// Estende o tipo de Request para incluir o `user`
declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}

// Gerar Token
export const generateToken = (userId: number, matricula: string, nivel: string): string => {
  return jwt.sign(
    { id: userId, matricula, nivel },
    JWT_SECRET,
    { expiresIn: '2h' } // Tempo de expiração do token
  );
};

// Middleware para autenticar o token
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(403).json({ message: 'Token não fornecido!' });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    
    // Verifica se o payload é do tipo esperado
    if (typeof payload === 'object' && 'id' in payload && 'matricula' in payload && 'nivel' in payload) {
      req.user = payload as CustomJwtPayload;
      next();
    } else {
      throw new Error('Payload inválido!');
    }
  } catch (err) {
    console.error('Erro na verificação do token:', err instanceof Error ? err.message : err);
    res.status(401).json({ message: 'Token inválido ou expirado!' });
  }
};

// Middleware para autorizar por nível de usuário
export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      console.error('Usuário não autenticado!');
      res.status(403).json({ message: 'Usuário não autenticado!' });
      return;
    }

    if (!roles.includes(req.user.nivel)) {
      console.error(
        `Acesso negado! Nível necessário: ${roles.join(', ')}. Nível do usuário: ${req.user.nivel}`
      );
      res.status(403).json({ message: 'Acesso negado!' });
      return;
    }

    next();
  };
};
