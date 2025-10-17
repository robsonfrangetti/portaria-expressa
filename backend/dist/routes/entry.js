"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get('/', [
    auth_1.protect,
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }),
    (0, express_validator_1.query)('type').optional().isIn(['ENTRY', 'EXIT']),
    (0, express_validator_1.query)('date').optional().isISO8601(),
    (0, express_validator_1.query)('visitorId').optional().isString()
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const type = req.query.type;
        const date = req.query.date;
        const visitorId = req.query.visitorId;
        const where = {
            companyId: req.user.companyId
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
    }
    catch (error) {
        console.error('Get entries error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.get('/:id', auth_1.protect, async (req, res) => {
    try {
        const entry = await prisma.entry.findFirst({
            where: {
                id: req.params.id,
                companyId: req.user.companyId
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
    }
    catch (error) {
        console.error('Get entry error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.post('/', [
    auth_1.protect,
    (0, express_validator_1.body)('type').isIn(['ENTRY', 'EXIT']),
    (0, express_validator_1.body)('visitorId').optional().isString(),
    (0, express_validator_1.body)('notes').optional().trim(),
    (0, express_validator_1.body)('photo').optional().trim(),
    (0, express_validator_1.body)('temperature').optional().isFloat({ min: 30, max: 45 })
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { type, visitorId, notes, photo, temperature } = req.body;
        if (visitorId) {
            const visitor = await prisma.visitor.findFirst({
                where: {
                    id: visitorId,
                    companyId: req.user.companyId,
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
                userId: req.user.id,
                companyId: req.user.companyId
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
    }
    catch (error) {
        console.error('Create entry error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.put('/:id', [
    auth_1.protect,
    (0, express_validator_1.body)('notes').optional().trim(),
    (0, express_validator_1.body)('photo').optional().trim(),
    (0, express_validator_1.body)('temperature').optional().isFloat({ min: 30, max: 45 })
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { notes, photo, temperature } = req.body;
        const existingEntry = await prisma.entry.findFirst({
            where: {
                id: req.params.id,
                companyId: req.user.companyId
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
    }
    catch (error) {
        console.error('Update entry error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.delete('/:id', auth_1.protect, async (req, res) => {
    try {
        const entry = await prisma.entry.findFirst({
            where: {
                id: req.params.id,
                companyId: req.user.companyId
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
    }
    catch (error) {
        console.error('Delete entry error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.get('/dashboard/stats', auth_1.protect, async (req, res) => {
    try {
        const companyId = req.user.companyId;
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
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthlyEntries = await prisma.entry.count({
            where: {
                companyId,
                timestamp: {
                    gte: monthStart
                }
            }
        });
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
                }, {}),
                weeklyEntries,
                monthlyEntries,
                recentEntries
            }
        });
    }
    catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=entry.js.map