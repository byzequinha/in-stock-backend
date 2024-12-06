import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes'; // Rotas de produtos
import { setupSwagger } from './config/swagger'; // Configuração do Swagger

dotenv.config();

const port = process.env.PORT || 3001;

const app = express();

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

// Rota /api para verificar status da API
app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Middleware para tratar rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Rota não encontrada!' });
});

// Middleware para tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo deu errado!' });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});
