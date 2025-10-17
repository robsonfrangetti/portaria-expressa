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
router.get('/me', auth_1.protect, async (req, res) => {
    try {
        const company = await prisma.company.findUnique({
            where: { id: req.user.companyId },
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
    }
    catch (error) {
        console.error('Get company error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.put('/me', [
    auth_1.protect,
    (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'),
    (0, express_validator_1.body)('name').optional().trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('phone').optional().trim(),
    (0, express_validator_1.body)('address').optional().trim()
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
        const { name, phone, address } = req.body;
        const company = await prisma.company.update({
            where: { id: req.user.companyId },
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
    }
    catch (error) {
        console.error('Update company error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.get('/stats', auth_1.protect, async (req, res) => {
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
        const totalVisitors = await prisma.visitor.count({
            where: {
                companyId,
                isActive: true
            }
        });
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
    }
    catch (error) {
        console.error('Get company stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=company.js.map