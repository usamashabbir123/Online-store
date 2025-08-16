const express = require('express');
const { body, validationResult, query } = require('express-validator');
const prisma = require('../lib/db');

const router = express.Router();

// Validation middleware
const validateOrderItem = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be positive')
];

const validateOrder = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').notEmpty(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('items.*.unitPrice').isFloat({ min: 0 }),
  body('shippingAddressId').notEmpty().withMessage('Shipping address is required'),
  body('billingAddressId').notEmpty().withMessage('Billing address is required')
];

// Helper function to generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// Helper function to calculate order totals
const calculateOrderTotals = (items, shippingAmount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const taxAmount = subtotal * 0.08; // 8% tax rate
  const totalAmount = subtotal + taxAmount + shippingAmount;
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    shippingAmount: parseFloat(shippingAmount.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2))
  };
};

// POST /orders - Create new order
router.post('/', validateOrder, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors.array()
      });
    }

    const { items, shippingAddressId, billingAddressId, notes } = req.body;

    // Verify addresses belong to user
    const [shippingAddress, billingAddress] = await Promise.all([
      prisma.address.findFirst({
        where: { id: shippingAddressId, userId: req.user.id }
      }),
      prisma.address.findFirst({
        where: { id: billingAddressId, userId: req.user.id }
      })
    ]);

    if (!shippingAddress || !billingAddress) {
      return res.status(400).json({
        success: false,
        error: 'Invalid shipping or billing address',
        code: 'INVALID_ADDRESS'
      });
    }

    // Verify products and check stock
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'active' }
    });

    if (products.length !== items.length) {
      return res.status(400).json({
        success: false,
        error: 'One or more products not found or unavailable',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    // Check stock availability
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (product.trackQuantity && product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${product.name}`,
          code: 'INSUFFICIENT_STOCK'
        });
      }
    }

    // Calculate totals
    const totals = calculateOrderTotals(items, 9.99); // Fixed shipping cost

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: req.user.id,
          status: 'pending',
          subtotal: totals.subtotal,
          taxAmount: totals.taxAmount,
          shippingAmount: totals.shippingAmount,
          totalAmount: totals.totalAmount,
          notes,
          shippingAddressId,
          billingAddressId
        }
      });

      // Create order items
      const orderItems = await Promise.all(
        items.map(item => 
          tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              productName: products.find(p => p.id === item.productId).name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.unitPrice * item.quantity,
              variantId: item.variantId || null
            }
          })
        )
      );

      // Update product stock
      await Promise.all(
        items.map(item => {
          const product = products.find(p => p.id === item.productId);
          if (product.trackQuantity) {
            return tx.product.update({
              where: { id: item.productId },
              data: { stockQuantity: product.stockQuantity - item.quantity }
            });
          }
          return Promise.resolve();
        })
      );

      // Clear user's cart
      await tx.cartItem.deleteMany({
        where: { userId: req.user.id }
      });

      return { ...newOrder, items: orderItems };
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      code: 'ORDER_CREATE_FAILED'
    });
  }
});

// GET /orders - List user orders
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors.array()
      });
    }

    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where = { userId: req.user.id };
    if (status) where.status = status;

    // Get orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true
                }
              }
            }
          },
          shippingAddress: true,
          billingAddress: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.order.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get orders',
      code: 'ORDERS_FETCH_FAILED'
    });
  }
});

// GET /orders/:id - Get order details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { id, userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                slug: true
              }
            }
          }
        },
        shippingAddress: true,
        billingAddress: true,
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        code: 'ORDER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get order',
      code: 'ORDER_FETCH_FAILED'
    });
  }
});

// PUT /orders/:id/cancel - Cancel order
router.put('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Check if order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        code: 'ORDER_NOT_FOUND'
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: 'Order cannot be cancelled at this stage',
        code: 'ORDER_CANNOT_CANCEL'
      });
    }

    // Cancel order and restore stock
    await prisma.$transaction(async (tx) => {
      // Update order status
      await tx.order.update({
        where: { id },
        data: { 
          status: 'cancelled',
          notes: reason ? `${order.notes || ''}\nCancelled: ${reason}`.trim() : order.notes
        }
      });

      // Restore product stock
      const orderItems = await tx.orderItem.findMany({
        where: { orderId: id },
        include: { product: true }
      });

      await Promise.all(
        orderItems.map(item => {
          if (item.product.trackQuantity) {
            return tx.product.update({
              where: { id: item.productId },
              data: { stockQuantity: item.product.stockQuantity + item.quantity }
            });
          }
          return Promise.resolve();
        })
      );
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel order',
      code: 'ORDER_CANCEL_FAILED'
    });
  }
});

// GET /orders/tracking/:id - Get order tracking information
router.get('/tracking/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { id, userId: req.user.id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        trackingNumber: true,
        notes: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        code: 'ORDER_NOT_FOUND'
      });
    }

    // Generate tracking timeline based on status
    const timeline = [];
    
    timeline.push({
      status: 'Order Placed',
      description: 'Your order has been placed successfully',
      timestamp: order.createdAt,
      completed: true
    });

    if (['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        status: 'Order Confirmed',
        description: 'Your order has been confirmed and is being processed',
        timestamp: order.status === 'pending' ? null : order.updatedAt,
        completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)
      });
    }

    if (['processing', 'shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        status: 'Processing',
        description: 'Your order is being prepared for shipment',
        timestamp: order.status === 'confirmed' ? null : order.updatedAt,
        completed: ['processing', 'shipped', 'delivered'].includes(order.status)
      });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        status: 'Shipped',
        description: order.trackingNumber 
          ? `Your order has been shipped. Tracking: ${order.trackingNumber}`
          : 'Your order has been shipped',
        timestamp: order.status === 'processing' ? null : order.updatedAt,
        completed: ['shipped', 'delivered'].includes(order.status)
      });
    }

    if (order.status === 'delivered') {
      timeline.push({
        status: 'Delivered',
        description: 'Your order has been delivered successfully',
        timestamp: order.updatedAt,
        completed: true
      });
    }

    res.json({
      success: true,
      data: {
        order,
        timeline
      }
    });
  } catch (error) {
    console.error('Get tracking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get tracking information',
      code: 'TRACKING_FETCH_FAILED'
    });
  }
});

module.exports = router;
