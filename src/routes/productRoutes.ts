import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { validateBody } from '../middleware/validationMiddleware';
import { productSchema } from '../validations/productValidation';
import { authenticateToken } from '../middleware/authMiddleware';
import { EntryPayload } from '../types/product';

const productRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API para gerenciamento de produtos
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de produtos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   stock:
 *                     type: integer
 *                   min_stock:
 *                     type: integer
 */
productRoutes.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM products');

    if (result.rows.length === 0) {
      // Retorna uma mensagem amigável se não houver produtos
      res.status(200).json({ message: 'Nenhum produto encontrado no momento.' });
      return;
    }

    // Retorna os produtos encontrados
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({
      error: 'Erro interno no servidor',
      detalhes: err instanceof Error ? err.message : String(err),
    });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Adiciona um novo produto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               min_stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Produto criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 */
productRoutes.post('/', validateBody(productSchema), async (req: Request, res: Response) => {
  const { name, price, stock, min_stock } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO products (name, price, stock, min_stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, stock, min_stock]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               min_stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *       404:
 *         description: Produto não encontrado.
 *       400:
 *         description: Dados inválidos.
 */
productRoutes.put('/:id', validateBody(productSchema), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, stock, min_stock } = req.body;

  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, stock = $3, min_stock = $4 WHERE id = $5 RETURNING *',
      [name, price, stock, min_stock, id]
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

/**
 * @swagger
 * /api/products/{id}/sale:
 *   post:
 *     summary: Registra a venda de um produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto a ser vendido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: Quantidade vendida
 *     responses:
 *       200:
 *         description: Venda registrada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Produto não encontrado.
 */
productRoutes.post('/:id/sale', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    res.status(400).json({ error: 'Quantity must be greater than 0' });
    return;
  }

  try {
    const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (productResult.rowCount === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const product = productResult.rows[0];
    if (product.stock < quantity) {
      res.status(400).json({ error: 'Insufficient stock' });
      return;
    }

    const updatedProduct = await pool.query(
      'UPDATE products SET stock = stock - $1 WHERE id = $2 RETURNING *',
      [quantity, id]
    );
    res.json({ message: 'Product sale registered', product: updatedProduct.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Deleta um produto existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto a ser deletado
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso.
 *       404:
 *         description: Produto não encontrado.
 */
productRoutes.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json({ message: 'Product deleted successfully', product: result.rows[0] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

//Rotas para o Dashboard)

// Últimas entradas corrigida
productRoutes.get('/entries', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        name,
        quantity,
        entry_date as created_at
      FROM product_entries
      ORDER BY entry_date DESC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar entradas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Últimas saídas corrigida
productRoutes.get('/exits', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        name,
        quantity,
        created_at
      FROM product_exits
      ORDER BY created_at DESC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar saídas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Alertas de estoque
productRoutes.get('/alerts', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        descricao as name,
        saldo as stock,
        estoque_minimo as min_stock
      FROM estoque 
      WHERE saldo < estoque_minimo
      ORDER BY saldo ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar alertas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/products/{id}/entries:
 *   post:
 *     summary: Registra uma entrada de estoque para um produto específico
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto para registrar entrada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: Quantidade a ser adicionada ao estoque
 *               cost:
 *                 type: number
 *                 description: Custo unitário do produto
 *             required:
 *               - quantity
 *               - cost
 *     responses:
 *       200:
 *         description: Entrada registrada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Produto não encontrado
 */
productRoutes.post('/:id/entries', authenticateToken, async (req: Request<{ id: string }, any, EntryPayload>, res: Response) => {
  const { id } = req.params;
  const { quantity, cost } = req.body;

  if (!quantity || quantity <= 0) {
    res.status(400).json({ error: 'A quantidade deve ser maior que 0' });
    return;
  }

  if (!cost || cost < 0) {
    res.status(400).json({ error: 'O custo unitário deve ser maior ou igual a 0' });
    return;
  }

  try {
    const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (productResult.rowCount === 0) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }

    const product = productResult.rows[0];

    // Iniciar uma transação
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Atualizar o estoque do produto
      const updatedProduct = await client.query(
        'UPDATE products SET stock = stock + $1 WHERE id = $2 RETURNING *',
        [quantity, id]
      );

      // Registrar a entrada no histórico
      await client.query(
        'INSERT INTO product_entries (product_id, quantity, cost, entry_date, name) VALUES ($1, $2, $3, NOW(), $4)',
        [id, quantity, cost, product.name]
      );

      await client.query('COMMIT');
      
      res.json({
        message: 'Entrada registrada com sucesso',
        product: updatedProduct.rows[0]
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Erro ao registrar entrada:', err);
    res.status(500).json({ error: 'Erro ao processar a requisição' });
  }
});

export default productRoutes;
