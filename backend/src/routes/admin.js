const express = require('express');
const { body, validationResult, query } = require('express-validator');
const prisma = require('../lib/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply admin middleware to all routes
router.use(requireAdmin);

// Validation middleware
const validateStoreApproval = [
  body('notes').optional().trim().notEmpty()
];

const validateStoreRejection = [
  body('reason').notEmpty().withMessage('Rejection reason is required'),
  body('notes').optional().trim().notEmpty()
];

const validateUserStatusUpdate = [
  body('status').isIn(['active', 'suspended', 'banned']).withMessage('Invalid status'),
  body('reason').optional().trim().notEmpty()
];

// GET /admin/dashboard - Get admin dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    // Get platform statistics
    const [
      totalUsers,
      totalStores,
      totalProducts,
      totalOrders,
      pendingStoreApplications,
      totalRevenue
    ] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.product.count({ where: { status: 'active' } }),
      prisma.order.count(),
      prisma.store.count({ where: { status: 'pending' } }),
      prisma.payment.aggregate({
        where: { status: 'completed' },
        _sum: { amount: true }
      })
    ]);

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Get recent store applications
    const recentApplications = await prisma.store.findMany({
      where: { status: 'pending' },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: {
        statistics: {
          totalUsers,
          totalStores,
          totalProducts,
          totalOrders,
          pendingStoreApplications,
          totalRevenue: totalRevenue._sum.amount || 0
        },
        recentOrders,
        recentApplications
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard data',
      code: 'DASHBOARD_FETCH_FAILED'
    });
  }
});

// GET /admin/stores - List all stores
router.get('/stores', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'approved', 'rejected', 'suspended', 'closed'])
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
    const where = {};
    if (status) where.status = status;

    // Get stores with pagination
    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          _count: {
            select: { products: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.store.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: stores,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get stores',
      code: 'STORES_FETCH_FAILED'
    });
  }
});

// GET /admin/stores/:id - Get store details
router.get('/stores/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            createdAt: true
          }
        },
        products: {
          take: 20,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            status: true,
            price: true,
            createdAt: true
          }
        },
        _count: {
          select: { products: true }
        }
      }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        error: 'Store not found',
        code: 'STORE_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get store',
      code: 'STORE_FETCH_FAILED'
    });
  }
});

// PUT /admin/stores/:id/approve - Approve store application
router.put('/stores/:id/approve', validateStoreApproval, async (req, res) => {
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

    const { id } = req.params;
    const { notes } = req.body;

    // Check if store exists and is pending
    const store = await prisma.store.findUnique({
      where: { id }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        error: 'Store not found',
        code: 'STORE_NOT_FOUND'
      });
    }

    if (store.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Store is not pending approval',
        code: 'STORE_NOT_PENDING'
      });
    }

    // Approve store
    const updatedStore = await prisma.store.update({
      where: { id },
      data: {
        status: 'approved',
        notes: notes || 'Store approved by admin'
      },
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Store approved successfully',
      data: updatedStore
    });
  } catch (error) {
    console.error('Approve store error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve store',
      code: 'STORE_APPROVE_FAILED'
    });
  }
});

// PUT /admin/stores/:id/reject - Reject store application
router.put('/stores/:id/reject', validateStoreRejection, async (req, res) => {
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

    const { id } = req.params;
    const { reason, notes } = req.body;

    // Check if store exists and is pending
    const store = await prisma.store.findUnique({
      where: { id }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        error: 'Store not found',
        code: 'STORE_NOT_FOUND'
      });
    }

    if (store.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Store is not pending approval',
        code: 'STORE_NOT_PENDING'
      });
    }

    // Reject store
    const updatedStore = await prisma.store.update({
      where: { id },
      data: {
        status: 'rejected',
        notes: `${notes || 'Store rejected'}\nReason: ${reason}`
      },
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Store rejected successfully',
      data: updatedStore
    });
  } catch (error) {
    console.error('Reject store error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject store',
      code: 'STORE_REJECT_FAILED'
    });
  }
});

// PUT /admin/stores/:id/suspend - Suspend store
router.put('/stores/:id/suspend', [
  body('reason').notEmpty().withMessage('Suspension reason is required')
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

    const { id } = req.params;
    const { reason } = req.body;

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        error: 'Store not found',
        code: 'STORE_NOT_FOUND'
      });
    }

    if (store.status === 'suspended') {
      return res.status(400).json({
        success: false,
        error: 'Store is already suspended',
        code: 'STORE_ALREADY_SUSPENDED'
      });
    }

    // Suspend store
    const updatedStore = await prisma.store.update({
      where: { id },
      data: {
        status: 'suspended',
        notes: `${store.notes || ''}\nSuspended: ${reason}`.trim()
      }
    });

    res.json({
      success: true,
      message: 'Store suspended successfully',
      data: updatedStore
    });
  } catch (error) {
    console.error('Suspend store error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to suspend store',
      code: 'STORE_SUSPEND_FAILED'
    });
  }
});

// GET /admin/users - List all users
router.get('/users', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['customer', 'seller', 'admin']),
  query('status').optional().isIn(['active', 'suspended', 'banned', 'pending_verification'])
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

    const { page = 1, limit = 20, role, status } = req.query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          emailVerified: true,
          lastLogin: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              addresses: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users',
      code: 'USERS_FETCH_FAILED'
    });
  }
});

// PUT /admin/users/:id/status - Update user status
router.put('/users/:id/status', validateUserStatusUpdate, async (req, res) => {
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

    const { id } = req.params;
    const { status, reason } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Prevent admin from changing their own status
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot change your own status',
        code: 'CANNOT_CHANGE_OWN_STATUS'
      });
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status }
    });

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        status: updatedUser.status,
        reason: reason || null
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user status',
      code: 'USER_STATUS_UPDATE_FAILED'
    });
  }
});

// GET /admin/orders - List all orders
router.get('/orders', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
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
    const where = {};
    if (status) where.status = status;

    // Get orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          items: {
            take: 3,
            select: {
              productName: true,
              quantity: true,
              unitPrice: true
            }
          },
          _count: {
            select: { items: true }
          }
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

// GET /admin/products - List all products
router.get('/products', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['active', 'draft', 'archived', 'out_of_stock'])
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
    const where = {};
    if (status) where.status = status;

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          store: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          _count: {
            select: { reviews: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.product.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get products',
      code: 'PRODUCTS_FETCH_FAILED'
    });
  }
});

module.exports = router;
