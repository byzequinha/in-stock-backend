import { Router } from 'express';

const clientRoutes = Router();

clientRoutes.get('/', (req, res) => {
  // Listar todos os clientes
  res.send('Get all clients');
});

clientRoutes.post('/', (req, res) => {
  // Adicionar um cliente
  res.send('Add client');
});

clientRoutes.put('/:id', (req, res) => {
  // Atualizar informações de um cliente
  res.send(`Update client ${req.params.id}`);
});

clientRoutes.delete('/:id', (req, res) => {
  // Deletar um cliente
  res.send(`Delete client ${req.params.id}`);
});

export default clientRoutes;
