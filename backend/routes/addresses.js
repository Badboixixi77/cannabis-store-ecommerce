const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's addresses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// Create address
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { streetAddress, city, state, postalCode, country, isDefault } = req.body;

    // If this is set as default, unset other defaults
    if (isDefault) {
      await pool.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1',
        [req.userId]
      );
    }

    const result = await pool.query(
      `INSERT INTO addresses (user_id, street_address, city, state, postal_code, country, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.userId, streetAddress, city, state, postalCode, country, isDefault || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ error: 'Failed to create address' });
  }
});

// Update address
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { streetAddress, city, state, postalCode, country, isDefault } = req.body;

    // If this is set as default, unset other defaults
    if (isDefault) {
      await pool.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1 AND id != $2',
        [req.userId, id]
      );
    }

    const result = await pool.query(
      `UPDATE addresses SET 
       street_address = $1, city = $2, state = $3, postal_code = $4, 
       country = $5, is_default = $6
       WHERE id = $7 AND user_id = $8 RETURNING *`,
      [streetAddress, city, state, postalCode, country, isDefault || false, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
});

// Delete address
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

module.exports = router;