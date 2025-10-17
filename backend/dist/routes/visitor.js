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
    (0, express_validator_1.query)('search').optional().trim()
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
        const search = req.query.search;
        const skip = (page - 1) * limit;
        const where = {
            companyId: req.user.companyId,
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
    }
    catch (error) {
        console.error('Get visitors error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.get('/:id', auth_1.protect, async (req, res) => {
    try {
        const visitor = await prisma.visitor.findFirst({
            where: {
                id: req.params.id,
                companyId: req.user.companyId,
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
    }
    catch (error) {
        console.error('Get visitor error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.post('/', [
    auth_1.protect,
    (0, express_validator_1.body)('name').trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('document').optional().trim(),
    (0, express_validator_1.body)('phone').optional().trim(),
    (0, express_validator_1.body)('email').optional().isEmail().normalizeEmail(),
    (0, express_validator_1.body)('companyName').optional().trim(),
    (0, express_validator_1.body)('photo').optional().trim()
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
        const { name, document, phone, email, companyName, photo } = req.body;
        if (document) {
            const existingVisitor = await prisma.visitor.findFirst({
                where: {
                    document,
                    companyId: req.user.companyId,
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
                companyId: req.user.companyId
            }
        });
        res.status(201).json({
            success: true,
            visitor
        });
    }
    catch (error) {
        console.error('Create visitor error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.put('/:id', [
    auth_1.protect,
    (0, express_validator_1.body)('name').optional().trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('document').optional().trim(),
    (0, express_validator_1.body)('phone').optional().trim(),
    (0, express_validator_1.body)('email').optional().isEmail().normalizeEmail(),
    (0, express_validator_1.body)('companyName').optional().trim(),
    (0, express_validator_1.body)('photo').optional().trim()
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
        const { name, document, phone, email, companyName, photo } = req.body;
        const existingVisitor = await prisma.visitor.findFirst({
            where: {
                id: req.params.id,
                companyId: req.user.companyId,
                isActive: true
            }
        });
        if (!existingVisitor) {
            return res.status(404).json({
                success: false,
                error: 'Visitor not found'
            });
        }
        if (document && document !== existingVisitor.document) {
            const duplicateVisitor = await prisma.visitor.findFirst({
                where: {
                    document,
                    companyId: req.user.companyId,
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
    }
    catch (error) {
        console.error('Update visitor error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.delete('/:id', auth_1.protect, async (req, res) => {
    try {
        const visitor = await prisma.visitor.findFirst({
            where: {
                id: req.params.id,
                companyId: req.user.companyId,
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
    }
    catch (error) {
        console.error('Delete visitor error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=visitor.js.map