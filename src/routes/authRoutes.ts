import { Router, Request, Response, RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../config/database'; // Conexão com o banco de dados
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';

const authRoutes = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecretKey';

// Rota para login
authRoutes.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { matricula, senha } = req.body;

  try {
    console.log('Dados recebidos no login:', req.body);
    console.log(`Tentativa de login para matrícula: ${matricula}`);

    const userResult = await pool.query('SELECT * FROM users WHERE matricula = $1', [matricula]);
    console.log('Resultado da consulta SQL:', userResult.rows);

    const user = userResult.rows[0];

    if (!user) {
      console.log(`Usuário não encontrado para matrícula: ${matricula}`);
      res.status(401).json({ message: 'Credenciais inválidas!' });
      return;
    }

    console.log(`Senha enviada: ${senha}`);
    console.log(`Hash armazenado: ${user.senha}`);

    const isPasswordValid = bcrypt.compareSync(senha, user.senha);
    console.log(`Resultado da comparação de senha para matrícula ${matricula}: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log(`Senha incorreta para matrícula: ${matricula}`);
      res.status(401).json({ message: 'Credenciais inválidas!' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, matricula: user.matricula, nivel: user.nivel, nome: user.nome },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`Login bem-sucedido para matrícula: ${matricula}, Token gerado: ${token}`);

    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
    console.log(`Último login atualizado para o usuário ID: ${user.id}`);

    res.json({ token, nome: user.nome });
  } catch (error) {
    console.error('Erro ao processar login:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// Rota para buscar informações do usuário logado
authRoutes.get(
  '/user',
  authenticateToken as RequestHandler,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req.user as JwtPayload)?.id;

      if (!userId) {
        console.log('Token ausente ou inválido na requisição.');
        res.status(401).json({ message: 'Usuário não autenticado!' });
        return;
      }

      console.log(`Buscando informações para o usuário com ID: ${userId}`);

      const userResult = await pool.query(
        'SELECT matricula, nivel, last_login, nome FROM users WHERE id = $1',
        [userId]
      );
      const user = userResult.rows[0];

      if (!user) {
        console.log(`Usuário não encontrado para o ID: ${userId}`);
        res.status(404).json({ message: 'Usuário não encontrado!' });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
);

// Rota para criar novos usuários (somente para Supervisores)
authRoutes.post(
  '/register',
  authenticateToken as RequestHandler,
  authorizeRoles(['Supervisor']) as RequestHandler,
  async (req: Request, res: Response): Promise<void> => {
    const { matricula, senha, nivel, nome } = req.body;

    if (!matricula || !senha || !nivel || !nome) {
      console.log('Erro ao criar usuário: Dados incompletos');
      res.status(400).json({ message: 'Dados incompletos!' });
      return;
    }

    try {
      const hashedPassword = bcrypt.hashSync(senha, 10);
      console.log(`Senha criptografada para matrícula ${matricula}: ${hashedPassword}`);

      await pool.query(
        'INSERT INTO users (matricula, senha, nivel, nome) VALUES ($1, $2, $3, $4)',
        [matricula, hashedPassword, nivel, nome]
      );

      console.log(`Usuário criado com sucesso: Matrícula ${matricula}`);
      res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
);

export default authRoutes;
