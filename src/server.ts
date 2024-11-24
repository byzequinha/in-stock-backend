import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes'; // Importando as rotas de produtos
dotenv.config();

const port = process.env.PORT || 3001;

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configurar a rota raiz
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Rotas para produtos
app.use('/api/products', productRoutes);

// Rota /api para verificar status da API
app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
