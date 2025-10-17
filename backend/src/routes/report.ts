import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { protect, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Generate report
// @route   POST /api/reports/generate
// @access  Private
router.post('/generate', [
  protect,
  body('type').isIn(['DAILY', 'WEEKLY', 'MONTHLY']),
  body('period').isString(),
  body('format').optional().isIn(['JSON', 'PDF', 'EXCEL'])
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

    const { type, period, format = 'JSON' } = req.body;
    const companyId = req.user!.companyId;

    let startDate: Date;
    let endDate: Date;

    // Calculate date range based on type and period
    switch (type) {
      case 'DAILY':
        startDate = new Date(period);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(period);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      case 'WEEKLY':
        const weekStart = new Date(period);
        startDate = new Date(weekStart);
        startDate.setDate(weekStart.getDate() - weekStart.getDay());
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      case 'MONTHLY':
        startDate = new Date(period + '-01');
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid report type'
        });
    }

    // Get entries for the period
    const entries = await prisma.entry.findMany({
      where: {
        companyId,
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        visitor: {
          select: {
            id: true,
            name: true,
            document: true,
            company: true,
            phone: true,
            email: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { timestamp: 'asc' }
    });

    // Get company info
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        name: true,
        cnpj: true,
        address: true
      }
    });

    // Calculate statistics
    const totalEntries = entries.length;
    const entryCount = entries.filter(e => e.type === 'ENTRY').length;
    const exitCount = entries.filter(e => e.type === 'EXIT').length;
    const uniqueVisitors = new Set(entries.filter(e => e.visitorId).map(e => e.visitorId)).size;

    // Group by date for daily breakdown
    const dailyBreakdown = entries.reduce((acc, entry) => {
      const date = entry.timestamp.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { entries: 0, exits: 0, visitors: new Set() };
      }
      acc[date].entries += entry.type === 'ENTRY' ? 1 : 0;
      acc[date].exits += entry.type === 'EXIT' ? 1 : 0;
      if (entry.visitorId) {
        acc[date].visitors.add(entry.visitorId);
      }
      return acc;
    }, {} as any);

    // Convert Set to count for daily breakdown
    Object.keys(dailyBreakdown).forEach(date => {
      dailyBreakdown[date].visitors = dailyBreakdown[date].visitors.size;
    });

    const reportData = {
      company: company,
      reportType: type,
      period: period,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      generatedAt: new Date().toISOString(),
      statistics: {
        totalEntries,
        entryCount,
        exitCount,
        uniqueVisitors,
        dailyBreakdown
      },
      entries: entries.map(entry => ({
        id: entry.id,
        type: entry.type,
        timestamp: entry.timestamp.toISOString(),
        visitor: entry.visitor,
        user: entry.user,
        notes: entry.notes,
        temperature: entry.temperature
      }))
    };

    // Save report to database
    const report = await prisma.report.create({
      data: {
        type,
        period,
        data: reportData,
        companyId
      }
    });

    // TODO: Implement PDF/Excel generation based on format
    if (format === 'PDF') {
      // Generate PDF using puppeteer or similar
      // reportData.fileName = `report-${type.toLowerCase()}-${period}.pdf`;
      // reportData.fileUrl = await generatePDF(reportData);
    } else if (format === 'EXCEL') {
      // Generate Excel using exceljs or similar
      // reportData.fileName = `report-${type.toLowerCase()}-${period}.xlsx`;
      // reportData.fileUrl = await generateExcel(reportData);
    }

    res.json({
      success: true,
      report: {
        id: report.id,
        type: report.type,
        period: report.period,
        generatedAt: report.createdAt,
        data: reportData
      }
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
router.get('/', [
  protect,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('type').optional().isIn(['DAILY', 'WEEKLY', 'MONTHLY'])
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

    const where: any = {
      companyId: req.user!.companyId
    };

    if (type) {
      where.type = type;
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          period: true,
          fileName: true,
          fileUrl: true,
          createdAt: true
        }
      }),
      prisma.report.count({ where })
    ]);

    res.json({
      success: true,
      data: reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
router.get('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const report = await prisma.report.findFirst({
      where: {
        id: req.params.id,
        companyId: req.user!.companyId
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
router.delete('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const report = await prisma.report.findFirst({
      where: {
        id: req.params.id,
        companyId: req.user!.companyId
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    await prisma.report.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;
