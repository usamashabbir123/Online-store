const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { body, validationResult, query } = require('express-validator');
const prisma = require('../lib/db');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 5 * 1024 * 1024, // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.UPLOAD_ALLOWED_TYPES || 'image/jpeg,image/png,image/webp').split(',');
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Ensure upload directory exists
const ensureUploadDir = async () => {
  const uploadPath = process.env.UPLOAD_PATH || './uploads';
  try {
    await fs.access(uploadPath);
  } catch {
    await fs.mkdir(uploadPath, { recursive: true });
  }
  return uploadPath;
};

// Generate unique filename
const generateFilename = (originalname, type) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const ext = path.extname(originalname);
  return `${type}_${timestamp}_${random}${ext}`;
};

// Process and save image
const processImage = async (buffer, filename, type) => {
  const uploadPath = await ensureUploadDir();
  const filePath = path.join(uploadPath, filename);
  
  // Process image with Sharp
  const processedImage = await sharp(buffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  
  // Save processed image
  await fs.writeFile(filePath, processedImage);
  
  // Generate thumbnail
  const thumbnailFilename = filename.replace(/\.[^/.]+$/, '_thumb.jpg');
  const thumbnailPath = path.join(uploadPath, thumbnailFilename);
  
  const thumbnail = await sharp(buffer)
    .resize(200, 200, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toBuffer();
  
  await fs.writeFile(thumbnailPath, thumbnail);
  
  return {
    filename,
    thumbnailFilename,
    size: processedImage.length
  };
};

// Validation middleware
const validateImageUpload = [
  body('type').isIn(['product', 'store_logo', 'store_banner', 'avatar']).withMessage('Invalid upload type')
];

// POST /upload/image - Upload single image
router.post('/image', upload.single('image'), validateImageUpload, async (req, res) => {
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided',
        code: 'NO_IMAGE_FILE'
      });
    }

    const { type } = req.body;
    const { buffer, originalname, mimetype, size } = req.file;

    // Validate file size
    const maxSize = parseInt(process.env.UPLOAD_MAX_SIZE) || 5 * 1024 * 1024;
    if (size > maxSize) {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds limit',
        code: 'FILE_SIZE_EXCEEDED'
      });
    }

    // Generate filename and process image
    const filename = generateFilename(originalname, type);
    const result = await processImage(buffer, filename, type);

    // Generate URLs (in production, these would be CDN URLs)
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
    const url = `${baseUrl}/uploads/${result.filename}`;
    const thumbnailUrl = `${baseUrl}/uploads/${result.thumbnailFilename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url,
        thumbnailUrl,
        filename: result.filename,
        size: result.size,
        type,
        mimetype
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image',
      code: 'IMAGE_UPLOAD_FAILED'
    });
  }
});

// POST /upload/images - Upload multiple images
router.post('/images', upload.array('images', 10), validateImageUpload, async (req, res) => {
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

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No image files provided',
        code: 'NO_IMAGE_FILES'
      });
    }

    const { type } = req.body;
    const maxFiles = 10;
    
    if (req.files.length > maxFiles) {
      return res.status(400).json({
        success: false,
        error: `Maximum ${maxFiles} files allowed`,
        code: 'TOO_MANY_FILES'
      });
    }

    const results = [];
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';

    // Process each image
    for (const file of req.files) {
      const { buffer, originalname, size } = file;
      
      // Validate file size
      const maxSize = parseInt(process.env.UPLOAD_MAX_SIZE) || 5 * 1024 * 1024;
      if (size > maxSize) {
        continue; // Skip oversized files
      }

      const filename = generateFilename(originalname, type);
      const result = await processImage(buffer, filename, type);
      
      results.push({
        url: `${baseUrl}/uploads/${result.filename}`,
        thumbnailUrl: `${baseUrl}/uploads/${result.thumbnailFilename}`,
        filename: result.filename,
        size: result.size,
        type,
        originalname
      });
    }

    res.json({
      success: true,
      message: `${results.length} images uploaded successfully`,
      data: results
    });
  } catch (error) {
    console.error('Multiple images upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload images',
      code: 'IMAGES_UPLOAD_FAILED'
    });
  }
});

// POST /upload/document - Upload document
router.post('/document', upload.single('document'), [
  body('type').isIn(['business_license', 'tax_certificate', 'id_document']).withMessage('Invalid document type')
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No document file provided',
        code: 'NO_DOCUMENT_FILE'
      });
    }

    const { type } = req.body;
    const { buffer, originalname, mimetype, size } = req.file;

    // Validate file size (documents can be larger)
    const maxSize = 10 * 1024 * 1024; // 10MB for documents
    if (size > maxSize) {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds limit',
        code: 'FILE_SIZE_EXCEEDED'
      });
    }

    // Validate document types
    const allowedDocTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedDocTypes.includes(mimetype)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid document type. Only PDF, JPEG, and PNG allowed',
        code: 'INVALID_DOCUMENT_TYPE'
      });
    }

    // Generate filename and save document
    const filename = generateFilename(originalname, type);
    const uploadPath = await ensureUploadDir();
    const filePath = path.join(uploadPath, filename);
    
    await fs.writeFile(filePath, buffer);

    // Generate URL
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
    const url = `${baseUrl}/uploads/${filename}`;

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        url,
        filename,
        size,
        type,
        mimetype
      }
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload document',
      code: 'DOCUMENT_UPLOAD_FAILED'
    });
  }
});

// DELETE /upload/:filename - Delete uploaded file
router.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Security check: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filename',
        code: 'INVALID_FILENAME'
      });
    }

    const uploadPath = await ensureUploadDir();
    const filePath = path.join(uploadPath, filename);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        error: 'File not found',
        code: 'FILE_NOT_FOUND'
      });
    }

    // Delete file
    await fs.unlink(filePath);

    // Try to delete thumbnail if it exists
    const thumbnailFilename = filename.replace(/\.[^/.]+$/, '_thumb.jpg');
    const thumbnailPath = path.join(uploadPath, thumbnailFilename);
    
    try {
      await fs.unlink(thumbnailPath);
    } catch {
      // Thumbnail doesn't exist, ignore
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete file',
      code: 'FILE_DELETE_FAILED'
    });
  }
});

// GET /upload/list - List uploaded files for user
router.get('/list', [
  query('type').optional().isIn(['product', 'store_logo', 'store_banner', 'avatar', 'business_license', 'tax_certificate', 'id_document']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
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

    const { type, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // In a real application, you would store file metadata in the database
    // For now, we'll return a simple response
    res.json({
      success: true,
      message: 'File listing not implemented in this demo',
      data: [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
        totalPages: 0
      }
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list files',
      code: 'FILES_LIST_FAILED'
    });
  }
});

module.exports = router;
