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
  console.log("🔍 Tentando login com matrícula:", matricula);

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE matricula = $1', [matricula]);
    console.log("🔎 Resultado da consulta SQL:", userResult.rows);

    if (userResult.rows.length === 0) {
      console.log("⚠️ Nenhum usuário encontrado com essa matrícula!");
      res.status(401).json({ message: "Credenciais inválidas!" });
      return;
    }

    const user = userResult.rows[0];
    console.log("🔐 Hash armazenado no banco:", user.senha);

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    console.log(`🔍 Comparação de senha: ${isPasswordValid ? "✅ Válida" : "❌ Inválida"}`);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Credenciais inválidas!" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, matricula: user.matricula, nivel: user.nivel, nome: user.nome },
      process.env.JWT_SECRET || 'defaultSecretKey',
      { expiresIn: '1h' }
    );

    console.log("✅ Login bem-sucedido! Token gerado:", token);
    res.json({ token, nome: user.nome });

  } catch (error) {
    console.error("❌ Erro ao processar login:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});


// Rota para buscar informações do usuário logado
authRoutes.get(
  '/user',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        res.status(401).json({ message: "Usuário não autenticado!" });
      }

      console.log(`🔍 Buscando informações do usuário com ID: ${userId}`);
      const userResult = await pool.query(
        'SELECT id, nome, nivel, last_login FROM users WHERE id = $1',
        [userId]
      );
      const user = userResult.rows[0];

      if (!user) {
        console.warn(`⚠️ Usuário não encontrado para ID: ${userId}`);
        res.status(404).json({ message: "Usuário não encontrado!" });
      }

      console.log("✅ Usuário retornado:", user);
      res.json(user);
    } catch (error) {
      console.error("❌ Erro ao buscar usuário:", error);
      res.status(500).json({ message: "Erro interno no servidor" });
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
