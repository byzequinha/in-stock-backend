/// <reference path="../types/express.d.ts" />
import { Request, Response, Router } from 'express';
import { pool } from '../db';
import { authenticateToken } from '../middleware/authMiddleware';
import bcrypt from 'bcrypt';

const userRoutes = Router();

// Listar usuários
userRoutes.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const user = req.user;

  if (!user || user.nivel !== 'Supervisor') {
    res.status(403).json({ message: 'Acesso negado: somente Supervisores podem listar usuários.' });
    return;
  }

  try {
    const result = await pool.query(
      'SELECT id, nome, matricula, nivel, last_login FROM users ORDER BY nome'
    );
    
    res.json({ 
      message: 'Usuários listados com sucesso!', 
      users: result.rows 
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
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
userRoutes.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const user = req.user;

  if (!user || user.nivel !== 'Supervisor') {
    res.status(403).json({ message: 'Acesso negado: somente Supervisores podem criar usuários.' });
    return;
  }

  const { nome, matricula, senha, nivel } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO users (nome, matricula, senha, nivel) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, matricula, senha, nivel]
    );
    
    res.status(201).json({ 
      message: 'Usuário criado com sucesso!', 
      user: result.rows[0] 
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
});

// Atualizar usuário
userRoutes.put('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const authUser = req.user;
  const { id } = req.params;

  if (!authUser) {
    res.status(401).json({ message: 'Usuário não autenticado.' });
    return;
  }

  // Se for o próprio usuário, permite atualizar apenas o nome
  if (authUser.id === parseInt(id)) {
    const { nome } = req.body;
    if (!nome) {
      res.status(400).json({ message: 'Nome é obrigatório.' });
      return;
    }

    try {
      const result = await pool.query(
        'UPDATE users SET nome = $1 WHERE id = $2 RETURNING *',
        [nome, id]
      );
      res.json({
        message: 'Nome atualizado com sucesso!',
        user: result.rows[0],
      });
      return;
    } catch (error) {
      console.error('Erro ao atualizar nome:', error);
      res.status(500).json({ message: 'Erro ao atualizar nome' });
      return;
    }
  }

  // Se for supervisor, permite atualizar todos os campos
  if (authUser.nivel !== 'Supervisor') {
    res.status(403).json({ message: 'Acesso negado: somente Supervisores podem atualizar outros usuários.' });
    return;
  }

  const { nome, matricula, senha, nivel } = req.body;

  try {
    const result = await pool.query(
      'UPDATE users SET nome = $1, matricula = $2, senha = $3, nivel = $4 WHERE id = $5 RETURNING *',
      [nome, matricula, senha, nivel, id]
    );
    
    res.json({
      message: `Usuário com ID ${id} atualizado com sucesso!`,
      updatedUser: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
});

// Remover usuário
userRoutes.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const user = req.user;

  if (!user || user.nivel !== 'Supervisor') {
    res.status(403).json({ message: 'Acesso negado: somente Supervisores podem remover usuários.' });
    return;
  }

  const { id } = req.params;

  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    
    res.json({ message: `Usuário com ID ${id} removido com sucesso!` });
  } catch (error) {
    console.error('Erro ao remover usuário:', error);
    res.status(500).json({ message: 'Erro ao remover usuário' });
  }
});

// Atualizar próprio perfil
userRoutes.put('/profile/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const user = req.user;
  const { id } = req.params;

  // Verifica se o usuário está tentando atualizar seu próprio perfil
  if (!user || user.id !== parseInt(id)) {
    res.status(403).json({ message: 'Você só pode atualizar seu próprio perfil.' });
    return;
  }

  const { nome } = req.body;

  try {
    const result = await pool.query(
      'UPDATE users SET nome = $1 WHERE id = $2 RETURNING *',
      [nome, id]
    );
    
    res.json({
      message: 'Perfil atualizado com sucesso!',
      updatedUser: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
});

// Atualizar nome do usuário autenticado
userRoutes.put('/profile/name', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const user = req.user;
  const { nome } = req.body;

  if (!user) {
    res.status(401).json({ message: 'Usuário não autenticado.' });
    return;
  }

  try {
    const result = await pool.query(
      'UPDATE users SET nome = $1 WHERE id = $2 RETURNING *',
      [nome, user.id]
    );
    
    res.json({
      message: 'Nome atualizado com sucesso!',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao atualizar nome:', error);
    res.status(500).json({ message: 'Erro ao atualizar nome' });
  }
});

// Alterar senha do usuário
userRoutes.put('/:id/password', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const authUser = req.user as any;
  const { id } = req.params;
  const { senhaAtual, novaSenha } = req.body;

  if (!authUser) {
    console.log('❌ Tentativa de alteração de senha sem autenticação');
    res.status(401).json({ message: 'Usuário não autenticado.' });
    return;
  }

  // Só permite alterar a própria senha
  if (authUser.id !== parseInt(id)) {
    console.log(`⚠️ Tentativa de alteração de senha de outro usuário. Auth ID: ${authUser.id}, Target ID: ${id}`);
    res.status(403).json({ message: 'Você só pode alterar sua própria senha.' });
    return;
  }

  try {
    console.log(`🔍 Verificando senha atual para usuário ID: ${id}`);
    const user = await pool.query('SELECT senha FROM users WHERE id = $1', [id]);
    
    if (user.rows.length === 0) {
      console.log(`⚠️ Usuário não encontrado com ID: ${id}`);
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }

    const senhaCorreta = await bcrypt.compare(senhaAtual, user.rows[0].senha);
    console.log(`🔐 Verificação de senha atual: ${senhaCorreta ? '✅ Válida' : '❌ Inválida'}`);
    
    if (!senhaCorreta) {
      res.status(401).json({ message: 'Senha atual incorreta.' });
      return;
    }

    // Gerar hash da nova senha
    const hashedPassword = await bcrypt.hash(novaSenha, 10);
    console.log('🔒 Nova senha criptografada gerada');

    // Atualizar senha
    await pool.query(
      'UPDATE users SET senha = $1 WHERE id = $2',
      [hashedPassword, id]
    );

    console.log(`✅ Senha atualizada com sucesso para usuário ID: ${id}`);
    res.json({ message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao alterar senha:', error);
    res.status(500).json({ message: 'Erro ao alterar senha' });
  }
});

export default userRoutes;
