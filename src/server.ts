import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database';
import { setupSwagger } from './config/swagger'; 
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Verifica se as variáveis de ambiente estão configuradas corretamente
if (!process.env.CLIENT_URL) {
  console.error('Erro: Variável de ambiente CLIENT_URL não configurada.');
  process.exit(1);
}

// 🔧 Configurar CORS
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`🚨 CORS bloqueado para a origem: ${origin}`);
        callback(new Error(`A origem ${origin} não está permitida pelo CORS.`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

console.log(`✅ CORS configurado com as origens permitidas: ${allowedOrigins.join(', ')}`);

// Middleware para leitura de JSON
app.use(express.json());

// Configuração do Swagger
setupSwagger(app);

// 🏠 **Rota raiz**
app.get('/', (req, res) => {
  res.send('🚀 Bem-vindo à API do In Stock!');
});

// 🟢 **Rota para verificar status da API e conexão com o banco**
app.get('/api/status', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'OK',
      database: 'Connected',
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', database: 'Disconnected' });
  }
});

// 🚀 **Registrar todas as rotas**
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// ❌ **Middleware para rotas não encontradas**
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada!' });
});

// ❌ **Middleware global para tratamento de erros**
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro no servidor:', err.stack);
  res.status(500).json({ message: 'Erro interno do servidor!' });
});

// 🚀 **Inicia o servidor apenas se for executado diretamente**
if (require.main === module) {
  app.listen(port, () => {
    console.log(`✅ Servidor rodando em http://localhost:${port}`);
    console.log(`📄 Documentação Swagger disponível em http://localhost:${port}/api-docs`);
  });
}

export default app;
