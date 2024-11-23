import { Router } from 'express';

const productRoutes = Router();

productRoutes.get('/', (req, res) => {
  // Listar todos os produtos
  res.send('Get all products');
});

productRoutes.post('/', (req, res) => {
  // Adicionar produto (Usuário ou Supervisor)
  res.send('Add product');
});

productRoutes.put('/:id', (req, res) => {
  // Atualizar informações de um produto (restrito ao Supervisor)
  res.send(`Update product ${req.params.id}`);
});

productRoutes.post('/:id/sale', (req, res) => {
  // Registrar saída de produto (apenas Caixa ou Supervisor)
  res.send(`Register product sale ${req.params.id}`);
});

export default productRoutes;
