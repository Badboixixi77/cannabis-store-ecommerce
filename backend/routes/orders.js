const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get user's orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, a.street_address, a.city, a.state, a.postal_code, a.country
       FROM orders o
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [req.userId]
    );

    // Get order items for each order
    for (let order of result.rows) {
      const itemsResult = await pool.query(
        `SELECT oi.*, p.name, p.image_url
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1`,
        [order.id]
      );
      order.items = itemsResult.rows;
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT o.*, a.street_address, a.city, a.state, a.postal_code, a.country
       FROM orders o
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.id = $1 AND o.user_id = $2`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = result.rows[0];

    // Get order items
    const itemsResult = await pool.query(
      `SELECT oi.*, p.name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [order.id]
    );
    order.items = itemsResult.rows;

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order
router.post('/', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { items, addressId, notes } = req.body;
    
    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];
    
    for (let item of items) {
      const productResult = await client.query(
        'SELECT price, stock_quantity FROM products WHERE id = $1 AND is_active = true',
        [item.productId]
      );
      
      if (productResult.rows.length === 0) {
        throw new Error(`Product ${item.productId} not found`);
      }
      
      const product = productResult.rows[0];
      
      if (product.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      });
    }
    
    // Create order
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, address_id, total_amount, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.userId, addressId, totalAmount, notes]
    );
    
    const order = orderResult.rows[0];
    
    // Create order items and update stock
    for (let item of orderItems) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.productId, item.quantity, item.price]
      );
      
      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [item.quantity, item.productId]
      );
    }
    
    // Clear cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.userId]);
    
    await client.query('COMMIT');
    
    res.status(201).json(order);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  } finally {
    client.release();
  }
});

// Admin: Get all orders
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT o.*, u.first_name, u.last_name, u.email,
             a.street_address, a.city, a.state, a.postal_code, a.country
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN addresses a ON o.address_id = a.id
    `;
    
    const params = [];
    if (status) {
      query += ' WHERE o.status = $1';
      params.push(status);
    }
    
    query += ` ORDER BY o.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin: Update order status
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;