import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { protect, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Get company info
// @route   GET /api/companies/me
// @access  Private
router.get('/me', protect, async (req: AuthRequest, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.user!.companyId },
      select: {
        id: true,
        name: true,
        cnpj: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    res.json({
      success: true,
      company
    });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update company info
// @route   PUT /api/companies/me
// @access  Private (Admin only)
router.put('/me', [
  protect,
  authorize('ADMIN', 'SUPER_ADMIN'),
  body('name').optional().trim().isLength({ min: 2 }),
  body('phone').optional().trim(),
  body('address').optional().trim()
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

    const { name, phone, address } = req.body;

    const company = await prisma.company.update({
      where: { id: req.user!.companyId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(address && { address })
      },
      select: {
        id: true,
        name: true,
        cnpj: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      company
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get company statistics
// @route   GET /api/companies/stats
// @access  Private
router.get('/stats', protect, async (req: AuthRequest, res) => {
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

    // Get total visitors
    const totalVisitors = await prisma.visitor.count({
      where: {
        companyId,
        isActive: true
      }
    });

    // Get entries this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlyEntries = await prisma.entry.count({
      where: {
        companyId,
        timestamp: {
          gte: thisMonth
        }
      }
    });

    // Get active users
    const activeUsers = await prisma.user.count({
      where: {
        companyId,
        isActive: true
      }
    });

    res.json({
      success: true,
      stats: {
        todayEntries,
        totalVisitors,
        monthlyEntries,
        activeUsers
      }
    });
  } catch (error) {
    console.error('Get company stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;
