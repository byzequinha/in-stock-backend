import { Router, Request, Response } from 'express';
import pool from '../config/database';

const productRoutes = Router();

// Listar todos os produtos
productRoutes.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Adicionar produto (Usuário ou Supervisor)
productRoutes.post('/', async (req: Request, res: Response): Promise<void> => {
  const { name, price } = req.body;

  if (!name || !price) {
    res.status(400).json({ error: 'Name and price are required' });
    return;
  }

  try {
    const result = await pool.query(
      'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *',
      [name, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Atualizar informações de um produto (restrito ao Supervisor)
productRoutes.put('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, price } = req.body;

  if (!name || !price) {
    res.status(400).json({ error: 'Name and price are required' });
    return;
  }

  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *',
      [name, price, id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Registrar saída de produto (apenas Caixa ou Supervisor)
productRoutes.post('/:id/sale', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    res.status(400).json({ error: 'Quantity must be greater than 0' });
    return;
  }

  try {
    const result = await pool.query(
      'UPDATE products SET price = price - $1 WHERE id = $2 RETURNING *',
      [quantity, id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json({ message: `Product sale registered`, product: result.rows[0] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default productRoutes;
