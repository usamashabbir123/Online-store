const express = require('express');
const { body, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prisma = require('../lib/db');
const { logSecurityEvent } = require('../utils/securityLogger');

const router = express.Router();

// Validation middleware
const validatePaymentIntent = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('currency').isIn(['usd', 'eur', 'gbp', 'cad']).withMessage('Invalid currency'),
  body('orderId').isUUID().withMessage('Invalid order ID'),
  body('paymentMethodId').optional().isUUID().withMessage('Invalid payment method ID')
];

const validatePaymentConfirmation = [
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
  body('orderId').isUUID().withMessage('Invalid order ID')
];

// Create payment intent (Stripe)
router.post('/intent', validatePaymentIntent, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { amount, currency, orderId, paymentMethodId } = req.body;

    // Verify order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.user.id,
        status: { in: ['pending', 'confirmed'] }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found or cannot be paid'
      });
    }

    // Verify amount matches order total
    if (parseFloat(amount) !== parseFloat(order.totalAmount)) {
      await logSecurityEvent(req.user.id, 'payment_failed', 'amount_mismatch', req.ip, req.get('User-Agent'), {
        expected: order.totalAmount,
        received: amount
      });
      return res.status(400).json({
        success: false,
        error: 'Payment amount does not match order total'
      });
    }

    // Create Stripe payment intent
    const paymentIntentData = {
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        orderId,
        userId: req.user.id
      },
      automatic_payment_methods: {
        enabled: true
      }
    };

    if (paymentMethodId) {
      paymentIntentData.payment_method = paymentMethodId;
      paymentIntentData.confirm = true;
      paymentIntentData.return_url = `${process.env.FRONTEND_URL}/payment/confirm`;
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

    // Update order with payment intent ID
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentIntentId: paymentIntent.id }
    });

    // Log payment intent creation
    await logSecurityEvent(req.user.id, 'payment_intent_created', 'stripe', req.ip, req.get('User-Agent'), {
      orderId,
      amount,
      currency,
      paymentIntentId: paymentIntent.id
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status
      }
    });
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    
    await logSecurityEvent(req.user.id, 'payment_failed', 'intent_creation_error', req.ip, req.get('User-Agent'), {
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to create payment intent',
      code: 'PAYMENT_INTENT_FAILED'
    });
  }
});

// Confirm payment (Stripe)
router.post('/confirm', validatePaymentConfirmation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { paymentIntentId, orderId } = req.body;

    // Verify order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.user.id
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order status
      await prisma.$transaction(async (tx) => {
        // Update order
        await tx.order.update({
          where: { id: orderId },
          data: { 
            status: 'confirmed',
            updatedAt: new Date()
          }
        });

        // Create payment record
        await tx.payment.create({
          data: {
            orderId,
            amount: order.totalAmount,
            currency: 'USD',
            status: 'completed',
            stripePaymentIntentId: paymentIntentId,
            paymentMethodId: req.body.paymentMethodId || null
          }
        });

        // Update product stock
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                decrement: item.quantity
              }
            }
          });
        }
      });

      // Log successful payment
      await logSecurityEvent(req.user.id, 'payment_success', 'stripe', req.ip, req.get('User-Agent'), {
        orderId,
        amount: order.totalAmount,
        paymentIntentId
      });

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        data: {
          orderId,
          status: 'confirmed',
          paymentIntentId
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment not completed',
        status: paymentIntent.status
      });
    }
  } catch (error) {
    console.error('Payment confirmation failed:', error);
    
    await logSecurityEvent(req.user.id, 'payment_failed', 'confirmation_error', req.ip, req.get('User-Agent'), {
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to confirm payment',
      code: 'PAYMENT_CONFIRMATION_FAILED'
    });
  }
});

// PayPal payment
router.post('/paypal', [
  body('orderId').isUUID().withMessage('Invalid order ID'),
  body('paypalOrderId').notEmpty().withMessage('PayPal order ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { orderId, paypalOrderId } = req.body;

    // Verify order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.user.id,
        status: { in: ['pending', 'confirmed'] }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found or cannot be paid'
      });
    }

    // Here you would verify the PayPal order with PayPal's API
    // For now, we'll simulate a successful payment

    // Update order and create payment record
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { 
          status: 'confirmed',
          updatedAt: new Date()
        }
      });

      await tx.payment.create({
        data: {
          orderId,
          amount: order.totalAmount,
          currency: 'USD',
          status: 'completed',
          paypalOrderId,
          method: 'paypal'
        }
      });
    });

    // Log successful PayPal payment
    await logSecurityEvent(req.user.id, 'payment_success', 'paypal', req.ip, req.get('User-Agent'), {
      orderId,
      amount: order.totalAmount,
      paypalOrderId
    });

    res.json({
      success: true,
      message: 'PayPal payment completed successfully',
      data: {
        orderId,
        status: 'confirmed',
        paypalOrderId
      }
    });
  } catch (error) {
    console.error('PayPal payment failed:', error);
    
    await logSecurityEvent(req.user.id, 'payment_failed', 'paypal_error', req.ip, req.get('User-Agent'), {
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'PayPal payment failed',
      code: 'PAYPAL_PAYMENT_FAILED'
    });
  }
});

// Crypto payment (Coinbase Commerce)
router.post('/crypto', [
  body('orderId').isUUID().withMessage('Invalid order ID'),
  body('cryptoAmount').isFloat({ min: 0.000001 }).withMessage('Invalid crypto amount'),
  body('cryptoCurrency').isIn(['BTC', 'ETH', 'USDC', 'USDT']).withMessage('Invalid crypto currency')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { orderId, cryptoAmount, cryptoCurrency } = req.body;

    // Verify order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.user.id,
        status: { in: ['pending', 'confirmed'] }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found or cannot be paid'
      });
    }

    // Here you would create a Coinbase Commerce charge
    // For now, we'll simulate the process

    // Update order and create payment record
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { 
          status: 'confirmed',
          updatedAt: new Date()
        }
      });

      await tx.payment.create({
        data: {
          orderId,
          amount: order.totalAmount,
          currency: 'USD',
          status: 'completed',
          cryptoTransactionHash: `simulated_${Date.now()}`,
          method: 'crypto'
        }
      });
    });

    // Log successful crypto payment
    await logSecurityEvent(req.user.id, 'payment_success', 'crypto', req.ip, req.get('User-Agent'), {
      orderId,
      amount: order.totalAmount,
      cryptoAmount,
      cryptoCurrency
    });

    res.json({
      success: true,
      message: 'Crypto payment completed successfully',
      data: {
        orderId,
        status: 'confirmed',
        cryptoAmount,
        cryptoCurrency
      }
    });
  } catch (error) {
    console.error('Crypto payment failed:', error);
    
    await logSecurityEvent(req.user.id, 'payment_failed', 'crypto_error', req.ip, req.get('User-Agent'), {
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Crypto payment failed',
      code: 'CRYPTO_PAYMENT_FAILED'
    });
  }
});

// Stripe webhook handler
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
        await handlePaymentSuccess(paymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handlePaymentFailure(failedPayment);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Handle successful payment
async function handlePaymentSuccess(paymentIntent) {
  try {
    const { orderId } = paymentIntent.metadata;
    
    if (orderId) {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: orderId },
          data: { status: 'confirmed' }
        });

        await tx.payment.create({
          data: {
            orderId,
            amount: paymentIntent.amount / 100, // Convert from cents
            currency: paymentIntent.currency.toUpperCase(),
            status: 'completed',
            stripePaymentIntentId: paymentIntent.id
          }
        });
      });
    }
  } catch (error) {
    console.error('Failed to handle payment success:', error);
  }
}

// Handle payment failure
async function handlePaymentFailure(paymentIntent) {
  try {
    const { orderId } = paymentIntent.metadata;
    
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'cancelled' }
      });
    }
  } catch (error) {
    console.error('Failed to handle payment failure:', error);
  }
}

// Get payment methods for user
router.get('/methods', async (req, res) => {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId: req.user.id },
      orderBy: { isDefault: 'desc' }
    });

    res.json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    console.error('Failed to get payment methods:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment methods'
    });
  }
});

// Add payment method
router.post('/methods', [
  body('type').isIn(['stripe_card', 'paypal', 'apple_pay', 'google_pay']).withMessage('Invalid payment method type'),
  body('name').notEmpty().withMessage('Payment method name is required'),
  body('isDefault').optional().isBoolean().withMessage('isDefault must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { type, name, isDefault, metadata } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: req.user.id, isDefault: true },
        data: { isDefault: false }
      });
    }

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId: req.user.id,
        type,
        name,
        isDefault: isDefault || false,
        metadata
      }
    });

    res.status(201).json({
      success: true,
      data: paymentMethod
    });
  } catch (error) {
    console.error('Failed to add payment method:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add payment method'
    });
  }
});

// Get payment history
router.get('/history', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: { order: { userId: req.user.id } },
        include: {
          order: {
            select: {
              orderNumber: true,
              status: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: offset
      }),
      prisma.payment.count({
        where: { order: { userId: req.user.id } }
      })
    ]);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Failed to get payment history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment history'
    });
  }
});

module.exports = router;
