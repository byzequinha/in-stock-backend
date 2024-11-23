/// <reference path="../types/express.d.ts" />
import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';

const userRoutes = Router();

// Listar usuários
userRoutes.get('/', authenticateToken, (req: Request, res: Response): void => {
  const user = req.user;

  if (!user || user.nivel !== 'Supervisor') {
    res.status(403).json({ message: 'Acesso negado: somente Supervisores podem listar usuários.' });
    return;
  }

  res.json({ message: 'Usuários listados com sucesso!', users: [] });
});

// Testar autenticação
userRoutes.get('/test', authenticateToken, (req: Request, res: Response): void => {
  console.log('Usuário autenticado:', req.user);

  if (!req.user) {
    res.status(403).json({ message: 'Nenhum usuário autenticado.' });
    return;
  }

  res.json({ message: 'Usuário autenticado!', user: req.user });
});

// Criar usuário
userRoutes.post('/', authenticateToken, (req: Request, res: Response): void => {
  const user = req.user;

  if (!user || user.nivel !== 'Supervisor') {
    res.status(403).json({ message: 'Acesso negado: somente Supervisores podem criar usuários.' });
    return;
  }

  const { nome, matricula, senha, nivel } = req.body;

  res.status(201).json({ message: 'Usuário criado com sucesso!', user: { nome, matricula, nivel } });
});

// Atualizar usuário
userRoutes.put('/:id', authenticateToken, (req: Request, res: Response): void => {
  const user = req.user;

  if (!user || user.nivel !== 'Supervisor') {
    res.status(403).json({ message: 'Acesso negado: somente Supervisores podem atualizar usuários.' });
    return;
  }

  const { id } = req.params;
  const { nome, matricula, senha, nivel } = req.body;

  res.json({
    message: `Usuário com ID ${id} atualizado com sucesso!`,
    updatedUser: { id, nome, matricula, senha, nivel },
  });
});

// Remover usuário
userRoutes.delete('/:id', authenticateToken, (req: Request, res: Response): void => {
  const user = req.user;

  if (!user || user.nivel !== 'Supervisor') {
    res.status(403).json({ message: 'Acesso negado: somente Supervisores podem remover usuários.' });
    return;
  }

  const { id } = req.params;

  res.json({ message: `Usuário com ID ${id} removido com sucesso!` });
});

export default userRoutes;
