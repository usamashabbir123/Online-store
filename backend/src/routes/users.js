const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/db');

const router = express.Router();

// Validation middleware
const validateProfileUpdate = [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('phone').optional().trim().notEmpty(),
  body('dateOfBirth').optional().isISO8601()
];

const validateAddress = [
  body('type').isIn(['shipping', 'billing']),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('address1').trim().notEmpty(),
  body('city').trim().notEmpty(),
  body('state').trim().notEmpty(),
  body('zipCode').trim().notEmpty(),
  body('country').trim().notEmpty()
];

// GET /users/profile - Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true,
        addresses: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Remove sensitive information
    const { passwordHash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile',
      code: 'PROFILE_FETCH_FAILED'
    });
  }
});

// PUT /users/profile - Update user profile
router.put('/profile', validateProfileUpdate, async (req, res) => {
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

    const { firstName, lastName, phone, dateOfBirth, preferences } = req.body;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) })
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        updatedAt: true
      }
    });

    // Update or create profile
    if (preferences || dateOfBirth) {
      await prisma.userProfile.upsert({
        where: { userId: req.user.id },
        update: {
          ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
          ...(preferences && { preferences })
        },
        create: {
          userId: req.user.id,
          ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
          ...(preferences && { preferences })
        }
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      code: 'PROFILE_UPDATE_FAILED'
    });
  }
});

// GET /users/addresses - Get user addresses
router.get('/addresses', async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: addresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get addresses',
      code: 'ADDRESSES_FETCH_FAILED'
    });
  }
});

// POST /users/addresses - Create new address
router.post('/addresses', validateAddress, async (req, res) => {
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

    const { type, firstName, lastName, company, address1, address2, city, state, zipCode, country, phone, isDefault } = req.body;

    // If this is the first address or marked as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id, type },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: req.user.id,
        type,
        firstName,
        lastName,
        company,
        address1,
        address2,
        city,
        state,
        zipCode,
        country,
        phone,
        isDefault: isDefault || false
      }
    });

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: address
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create address',
      code: 'ADDRESS_CREATE_FAILED'
    });
  }
});

// PUT /users/addresses/:id - Update address
router.put('/addresses/:id', validateAddress, async (req, res) => {
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
    const { type, firstName, lastName, company, address1, address2, city, state, zipCode, country, phone, isDefault } = req.body;

    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        error: 'Address not found',
        code: 'ADDRESS_NOT_FOUND'
      });
    }

    // If marked as default, unset other defaults of same type
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id, type, id: { not: id } },
        data: { isDefault: false }
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        type,
        firstName,
        lastName,
        company,
        address1,
        address2,
        city,
        state,
        zipCode,
        country,
        phone,
        isDefault: isDefault || false
      }
    });

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: updatedAddress
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update address',
      code: 'ADDRESS_UPDATE_FAILED'
    });
  }
});

// DELETE /users/addresses/:id - Delete address
router.delete('/addresses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if address belongs to user
    const address = await prisma.address.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Address not found',
        code: 'ADDRESS_NOT_FOUND'
      });
    }

    await prisma.address.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete address',
      code: 'ADDRESS_DELETE_FAILED'
    });
  }
});

// GET /users/cart - Get user cart items
router.get('/cart', async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            stockQuantity: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: cartItems
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cart',
      code: 'CART_FETCH_FAILED'
    });
  }
});

// POST /users/cart - Add item to cart
router.post('/cart', [
  body('productId').notEmpty(),
  body('quantity').isInt({ min: 1 })
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

    const { productId, quantity, variantId } = req.body;

    // Check if product exists and is active
    const product = await prisma.product.findFirst({
      where: { id: productId, status: 'active' }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found or unavailable',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    // Check stock
    if (product.trackQuantity && product.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient stock',
        code: 'INSUFFICIENT_STOCK'
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: req.user.id,
        productId,
        variantId: variantId || null
      }
    });

    let cartItem;
    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              stockQuantity: true,
              status: true
            }
          }
        }
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: req.user.id,
          productId,
          quantity,
          variantId
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              stockQuantity: true,
              status: true
            }
          }
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cartItem
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add item to cart',
      code: 'CART_ADD_FAILED'
    });
  }
});

// PUT /users/cart/:id - Update cart item quantity
router.put('/cart/:id', [
  body('quantity').isInt({ min: 1 })
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
    const { quantity } = req.body;

    // Check if cart item belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: { id, userId: req.user.id },
      include: { product: true }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found',
        code: 'CART_ITEM_NOT_FOUND'
      });
    }

    // Check stock
    if (cartItem.product.trackQuantity && cartItem.product.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient stock',
        code: 'INSUFFICIENT_STOCK'
      });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            stockQuantity: true,
            status: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cart item',
      code: 'CART_UPDATE_FAILED'
    });
  }
});

// DELETE /users/cart/:id - Remove item from cart
router.delete('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if cart item belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found',
        code: 'CART_ITEM_NOT_FOUND'
      });
    }

    await prisma.cartItem.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove item from cart',
      code: 'CART_REMOVE_FAILED'
    });
  }
});

module.exports = router;
