const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.body;

    // Get order details
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, req.userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total_amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id.toString(),
        userId: req.userId.toString()
      }
    });

    // Update order with payment intent ID
    await pool.query(
      'UPDATE orders SET stripe_payment_intent_id = $1 WHERE id = $2',
      [paymentIntent.id, order.id]
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Webhook to handle payment events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Update order payment status
        await pool.query(
          'UPDATE orders SET payment_status = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE stripe_payment_intent_id = $3',
          ['paid', 'confirmed', paymentIntent.id]
        );
        
        console.log('Payment succeeded for order:', paymentIntent.metadata.orderId);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        
        // Update order payment status
        await pool.query(
          'UPDATE orders SET payment_status = $1, updated_at = CURRENT_TIMESTAMP WHERE stripe_payment_intent_id = $2',
          ['failed', failedPayment.id]
        );
        
        console.log('Payment failed for order:', failedPayment.metadata.orderId);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Get payment status
router.get('/status/:paymentIntentId', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ error: 'Failed to get payment status' });
  }
});

module.exports = router;