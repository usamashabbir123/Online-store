const express = require('express');
const { body, validationResult, query } = require('express-validator');
const prisma = require('../lib/db');
const { requireSeller } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['tops', 'bottoms', 'dresses', 'outerwear', 'activewear', 'sleepwear', 'intimates', 'accessories', 'shoes']),
  body('gender').isIn(['men', 'women', 'unisex', 'kids']),
  body('ageGroup').isIn(['infant', 'toddler', 'child', 'teen', 'adult']),
  body('stockQuantity').optional().isInt({ min: 0 }),
  body('images').optional().isArray()
];

// GET /products - List products with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isIn(['tops', 'bottoms', 'dresses', 'outerwear', 'activewear', 'sleepwear', 'intimates', 'accessories', 'shoes']),
  query('gender').optional().isIn(['men', 'women', 'unisex', 'kids']),
  query('min_price').optional().isFloat({ min: 0 }),
  query('max_price').optional().isFloat({ min: 0 }),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'rating', 'newest'])
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

    const {
      page = 1,
      limit = 20,
      category,
      gender,
      search,
      min_price,
      max_price,
      sort = 'newest'
    } = req.query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      status: 'active'
    };

    if (category) where.category = category;
    if (gender) where.gender = gender;
    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price.gte = parseFloat(min_price);
      if (max_price) where.price.lte = parseFloat(max_price);
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Build orderBy clause
    let orderBy = {};
    switch (sort) {
      case 'price_asc':
        orderBy.price = 'asc';
        break;
      case 'price_desc':
        orderBy.price = 'desc';
        break;
      case 'rating':
        orderBy.rating = 'desc';
        break;
      case 'newest':
      default:
        orderBy.createdAt = 'desc';
        break;
    }

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
          }
        },
        orderBy,
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

// GET /products/:id - Get product details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            rating: true
          }
        },
        variants: true,
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get product',
      code: 'PRODUCT_FETCH_FAILED'
    });
  }
});

// POST /products - Create new product (seller only)
router.post('/', requireSeller, validateProduct, async (req, res) => {
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

    const {
      name,
      description,
      price,
      comparePrice,
      costPrice,
      sku,
      category,
      subcategory,
      gender,
      ageGroup,
      brand,
      material,
      careInstructions,
      countryOfOrigin,
      hasVariants,
      trackQuantity,
      stockQuantity,
      weight,
      dimensions,
      images,
      specifications
    } = req.body;

    // Check if user has an approved store
    const store = await prisma.store.findFirst({
      where: {
        ownerId: req.user.id,
        status: 'approved'
      }
    });

    if (!store) {
      return res.status(403).json({
        success: false,
        error: 'Store not approved or not found',
        code: 'STORE_NOT_APPROVED'
      });
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug is unique
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        error: 'Product with this name already exists',
        code: 'DUPLICATE_PRODUCT_NAME'
      });
    }

    const product = await prisma.product.create({
      data: {
        storeId: store.id,
        name,
        slug,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        sku,
        category,
        subcategory,
        gender,
        ageGroup,
        brand: brand || 'FashionHub',
        material,
        careInstructions,
        countryOfOrigin,
        hasVariants: hasVariants !== undefined ? hasVariants : true,
        trackQuantity: trackQuantity !== undefined ? trackQuantity : true,
        stockQuantity: stockQuantity || 0,
        weight: weight ? parseFloat(weight) : null,
        dimensions: dimensions || null,
        images: images || [],
        specifications: specifications || null
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      code: 'PRODUCT_CREATE_FAILED'
    });
  }
});

// PUT /products/:id - Update product (seller only)
router.put('/:id', requireSeller, validateProduct, async (req, res) => {
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
    const updateData = req.body;

    // Check if product exists and belongs to user's store
    const product = await prisma.product.findFirst({
      where: { id },
      include: { store: true }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    if (product.store.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this product',
        code: 'AUTH_INSUFFICIENT_PERMISSIONS'
      });
    }

    // Handle price fields
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.comparePrice) updateData.comparePrice = parseFloat(updateData.comparePrice);
    if (updateData.costPrice) updateData.costPrice = parseFloat(updateData.costPrice);
    if (updateData.weight) updateData.weight = parseFloat(updateData.weight);
    if (updateData.stockQuantity) updateData.stockQuantity = parseInt(updateData.stockQuantity);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      code: 'PRODUCT_UPDATE_FAILED'
    });
  }
});

// DELETE /products/:id - Delete product (seller only)
router.delete('/:id', requireSeller, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists and belongs to user's store
    const product = await prisma.product.findFirst({
      where: { id },
      include: { store: true }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    if (product.store.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this product',
        code: 'AUTH_INSUFFICIENT_PERMISSIONS'
      });
    }

    // Soft delete by setting status to archived
    await prisma.product.update({
      where: { id },
      data: { status: 'archived' }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
      code: 'PRODUCT_DELETE_FAILED'
    });
  }
});

// GET /products/categories - Get all product categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = [
      { value: 'tops', label: 'Tops', icon: '👕' },
      { value: 'bottoms', label: 'Bottoms', icon: '👖' },
      { value: 'dresses', label: 'Dresses', icon: '👗' },
      { value: 'outerwear', label: 'Outerwear', icon: '🧥' },
      { value: 'activewear', label: 'Activewear', icon: '🏃‍♀️' },
      { value: 'sleepwear', label: 'Sleepwear', icon: '😴' },
      { value: 'intimates', label: 'Intimates', icon: '👙' },
      { value: 'accessories', label: 'Accessories', icon: '👜' },
      { value: 'shoes', label: 'Shoes', icon: '👠' }
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get categories',
      code: 'CATEGORIES_FETCH_FAILED'
    });
  }
});

// GET /products/genders - Get all gender types
router.get('/genders/list', async (req, res) => {
  try {
    const genders = [
      { value: 'men', label: 'Men', icon: '👨' },
      { value: 'women', label: 'Women', icon: '👩' },
      { value: 'unisex', label: 'Unisex', icon: '👥' },
      { value: 'kids', label: 'Kids', icon: '👶' }
    ];

    res.json({
      success: true,
      data: genders
    });
  } catch (error) {
    console.error('Get genders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get genders',
      code: 'GENDERS_FETCH_FAILED'
    });
  }
});

module.exports = router;
