import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { protect, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Get all visitors
// @route   GET /api/visitors
// @access  Private
router.get('/', [
  protect,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    const where: any = {
      companyId: req.user!.companyId,
      isActive: true
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { document: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [visitors, total] = await Promise.all([
      prisma.visitor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          document: true,
          phone: true,
          email: true,
          company: true,
          photo: true,
          createdAt: true
        }
      }),
      prisma.visitor.count({ where })
    ]);

    res.json({
      success: true,
      data: visitors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get visitors error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get visitor by ID
// @route   GET /api/visitors/:id
// @access  Private
router.get('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const visitor = await prisma.visitor.findFirst({
      where: {
        id: req.params.id,
        companyId: req.user!.companyId,
        isActive: true
      },
      include: {
        entries: {
          orderBy: { timestamp: 'desc' },
          take: 10,
          select: {
            id: true,
            type: true,
            timestamp: true,
            notes: true,
            photo: true
          }
        }
      }
    });

    if (!visitor) {
      return res.status(404).json({
        success: false,
        error: 'Visitor not found'
      });
    }

    res.json({
      success: true,
      visitor
    });
  } catch (error) {
    console.error('Get visitor error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new visitor
// @route   POST /api/visitors
// @access  Private
router.post('/', [
  protect,
  body('name').trim().isLength({ min: 2 }),
  body('document').optional().trim(),
  body('phone').optional().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('companyName').optional().trim(),
  body('photo').optional().trim()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, document, phone, email, companyName, photo } = req.body;

    // Check if visitor with same document already exists
    if (document) {
      const existingVisitor = await prisma.visitor.findFirst({
        where: {
          document,
          companyId: req.user!.companyId,
          isActive: true
        }
      });

      if (existingVisitor) {
        return res.status(400).json({
          success: false,
          error: 'Visitor with this document already exists'
        });
      }
    }

    const visitor = await prisma.visitor.create({
      data: {
        name,
        document,
        phone,
        email,
        companyName,
        photo,
        companyId: req.user!.companyId
      }
    });

    res.status(201).json({
      success: true,
      visitor
    });
  } catch (error) {
    console.error('Create visitor error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update visitor
// @route   PUT /api/visitors/:id
// @access  Private
router.put('/:id', [
  protect,
  body('name').optional().trim().isLength({ min: 2 }),
  body('document').optional().trim(),
  body('phone').optional().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('companyName').optional().trim(),
  body('photo').optional().trim()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, document, phone, email, companyName, photo } = req.body;

    // Check if visitor exists and belongs to company
    const existingVisitor = await prisma.visitor.findFirst({
      where: {
        id: req.params.id,
        companyId: req.user!.companyId,
        isActive: true
      }
    });

    if (!existingVisitor) {
      return res.status(404).json({
        success: false,
        error: 'Visitor not found'
      });
    }

    // Check if document is already used by another visitor
    if (document && document !== existingVisitor.document) {
      const duplicateVisitor = await prisma.visitor.findFirst({
        where: {
          document,
          companyId: req.user!.companyId,
          isActive: true,
          id: { not: req.params.id }
        }
      });

      if (duplicateVisitor) {
        return res.status(400).json({
          success: false,
          error: 'Document already used by another visitor'
        });
      }
    }

    const visitor = await prisma.visitor.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(document && { document }),
        ...(phone !== undefined && { phone }),
        ...(email && { email }),
        ...(companyName !== undefined && { companyName }),
        ...(photo !== undefined && { photo })
      }
    });

    res.json({
      success: true,
      visitor
    });
  } catch (error) {
    console.error('Update visitor error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete visitor (soft delete)
// @route   DELETE /api/visitors/:id
// @access  Private
router.delete('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const visitor = await prisma.visitor.findFirst({
      where: {
        id: req.params.id,
        companyId: req.user!.companyId,
        isActive: true
      }
    });

    if (!visitor) {
      return res.status(404).json({
        success: false,
        error: 'Visitor not found'
      });
    }

    await prisma.visitor.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'Visitor deleted successfully'
    });
  } catch (error) {
    console.error('Delete visitor error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;
