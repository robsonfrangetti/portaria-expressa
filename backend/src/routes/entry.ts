import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { protect, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Get all entries
// @route   GET /api/entries
// @access  Private
router.get('/', [
  protect,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('type').optional().isIn(['ENTRY', 'EXIT']),
  query('date').optional().isISO8601(),
  query('visitorId').optional().isString()
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
    const skip = (page - 1) * limit;
    const type = req.query.type as string;
    const date = req.query.date as string;
    const visitorId = req.query.visitorId as string;

    const where: any = {
      companyId: req.user!.companyId
    };

    if (type) {
      where.type = type;
    }

    if (visitorId) {
      where.visitorId = visitorId;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      where.timestamp = {
        gte: startDate,
        lte: endDate
      };
    }

    const [entries, total] = await Promise.all([
      prisma.entry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          visitor: {
            select: {
              id: true,
              name: true,
              document: true,
              companyName: true,
              photo: true
            }
          }
        }
      }),
      prisma.entry.count({ where })
    ]);

    res.json({
      success: true,
      data: entries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get entry by ID
// @route   GET /api/entries/:id
// @access  Private
router.get('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const entry = await prisma.entry.findFirst({
      where: {
        id: req.params.id,
        companyId: req.user!.companyId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        visitor: {
          select: {
            id: true,
            name: true,
            document: true,
            companyName: true,
            phone: true,
            email: true,
            photo: true
          }
        }
      }
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Entry not found'
      });
    }

    res.json({
      success: true,
      entry
    });
  } catch (error) {
    console.error('Get entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new entry
// @route   POST /api/entries
// @access  Private
router.post('/', [
  protect,
  body('type').isIn(['ENTRY', 'EXIT']),
  body('visitorId').optional().isString(),
  body('notes').optional().trim(),
  body('photo').optional().trim(),
  body('temperature').optional().isFloat({ min: 30, max: 45 })
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

    const { type, visitorId, notes, photo, temperature } = req.body;

    // If visitorId is provided, verify it belongs to the company
    if (visitorId) {
      const visitor = await prisma.visitor.findFirst({
        where: {
          id: visitorId,
          companyId: req.user!.companyId,
          isActive: true
        }
      });

      if (!visitor) {
        return res.status(400).json({
          success: false,
          error: 'Visitor not found'
        });
      }
    }

    const entry = await prisma.entry.create({
      data: {
        type,
        visitorId: visitorId || null,
        notes,
        photo,
        temperature,
        userId: req.user!.id,
        companyId: req.user!.companyId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        visitor: {
          select: {
            id: true,
            name: true,
            document: true,
            companyName: true,
            photo: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      entry
    });
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update entry
// @route   PUT /api/entries/:id
// @access  Private
router.put('/:id', [
  protect,
  body('notes').optional().trim(),
  body('photo').optional().trim(),
  body('temperature').optional().isFloat({ min: 30, max: 45 })
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

    const { notes, photo, temperature } = req.body;

    // Check if entry exists and belongs to company
    const existingEntry = await prisma.entry.findFirst({
      where: {
        id: req.params.id,
        companyId: req.user!.companyId
      }
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        error: 'Entry not found'
      });
    }

    const entry = await prisma.entry.update({
      where: { id: req.params.id },
      data: {
        ...(notes !== undefined && { notes }),
        ...(photo !== undefined && { photo }),
        ...(temperature !== undefined && { temperature })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        visitor: {
          select: {
            id: true,
            name: true,
            document: true,
            companyName: true,
            photo: true
          }
        }
      }
    });

    res.json({
      success: true,
      entry
    });
  } catch (error) {
    console.error('Update entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete entry
// @route   DELETE /api/entries/:id
// @access  Private
router.delete('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const entry = await prisma.entry.findFirst({
      where: {
        id: req.params.id,
        companyId: req.user!.companyId
      }
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Entry not found'
      });
    }

    await prisma.entry.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get dashboard statistics
// @route   GET /api/entries/dashboard
// @access  Private
router.get('/dashboard/stats', protect, async (req: AuthRequest, res) => {
  try {
    const companyId = req.user!.companyId;

    // Get today's entries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayEntries = await prisma.entry.count({
      where: {
        companyId,
        timestamp: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    // Get today's entries by type
    const todayEntriesByType = await prisma.entry.groupBy({
      by: ['type'],
      where: {
        companyId,
        timestamp: {
          gte: today,
          lt: tomorrow
        }
      },
      _count: true
    });

    // Get entries this week
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weeklyEntries = await prisma.entry.count({
      where: {
        companyId,
        timestamp: {
          gte: weekStart
        }
      }
    });

    // Get entries this month
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyEntries = await prisma.entry.count({
      where: {
        companyId,
        timestamp: {
          gte: monthStart
        }
      }
    });

    // Get recent entries (last 10)
    const recentEntries = await prisma.entry.findMany({
      where: { companyId },
      orderBy: { timestamp: 'desc' },
      take: 10,
      include: {
        visitor: {
          select: {
            id: true,
            name: true,
            document: true,
            companyName: true,
            photo: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({
      success: true,
      stats: {
        todayEntries,
        todayEntriesByType: todayEntriesByType.reduce((acc, item) => {
          acc[item.type] = item._count;
          return acc;
        }, {} as any),
        weeklyEntries,
        monthlyEntries,
        recentEntries
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;
