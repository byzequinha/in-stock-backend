import express from 'express';
import cors from 'cors'; 
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';
import { setupSwagger } from './config/swagger'; // Configuração do Swagger
import pool from './config/database';
import authRoutes from './routes/authRoutes';

dotenv.config();

const port = process.env.PORT || 3001;

if (!process.env.CLIENT_URL || !process.env.PORT) {
  console.error('Variáveis de ambiente não configuradas corretamente.');
  process.exit(1); // Encerra o processo se faltar algo
}

const app = express();

// Configurar CORS
defineCORS();

function defineCORS() {
  const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:3000'];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.error(`CORS bloqueado para a origem: ${origin}`);
          callback(new Error(`A origem ${origin} não está permitida pelo CORS.`));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  console.log(`CORS configurado com as origens permitidas: ${allowedOrigins.join(', ')}`);
}

// Middleware para parsear JSON
app.use(express.json());

// Configurar Swagger
setupSwagger(app);

// Rota raiz
app.get('/', (req, res) => {
  res.send('Welcome to the In Stock API!');
});

// Rotas para produtos
app.use('/api/products', productRoutes);
app.use('/api', authRoutes);

// Rota /api para verificar status da API
app.get('/api', async (req, res) => {
  try {
    const dbStatus = await pool.query('SELECT 1');
    res.json({
      message: 'API is working!',
      version: '1.0.0',
      database: dbStatus ? 'Connected' : 'Disconnected',
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao verificar o status do banco de dados.' });
  }
});

// Middleware para tratar rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Rota não encontrada!' });
});

// Middleware para tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Algo deu errado!'
    : err.message || 'Erro interno do servidor!';
  res.status(status).json({ message });
});

// Exportar o `app` para uso em testes
export default app;

// Inicializar o servidor somente se o arquivo for executado diretamente
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
  });
}
