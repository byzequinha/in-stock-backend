import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const authRoutes = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecretKey';

// Mock de Supervisor
const mockSupervisor = {
  id: 1,
  matricula: '123456',
  senha: bcrypt.hashSync('senha123', 10), // Senha criptografada
  nivel: 'Supervisor',
};

authRoutes.post('/login', (req: Request, res: Response): void => {
  const { matricula, senha } = req.body;

  if (matricula !== mockSupervisor.matricula || !bcrypt.compareSync(senha, mockSupervisor.senha)) {
    res.status(401).json({ message: 'Credenciais inválidas!' });
    return;
  }

  const token = jwt.sign(
    { id: mockSupervisor.id, matricula: mockSupervisor.matricula, nivel: mockSupervisor.nivel },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

export default authRoutes;
