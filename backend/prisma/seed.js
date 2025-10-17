"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seed...');
    const superAdminCompany = await prisma.company.upsert({
        where: { cnpj: '00000000000000' },
        update: {},
        create: {
            cnpj: '00000000000000',
            name: 'Portaria Expressa - Administração',
            email: 'admin@portariaexpressa.com',
            phone: '(11) 99999-9999',
            address: 'São Paulo, SP'
        }
    });
    const hashedPassword = await bcryptjs_1.default.hash('admin123', 10);
    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@portariaexpressa.com' },
        update: {},
        create: {
            email: 'admin@portariaexpressa.com',
            password: hashedPassword,
            name: 'Super Administrador',
            role: 'SUPER_ADMIN',
            companyId: superAdminCompany.id
        }
    });
    const sampleCompany = await prisma.company.upsert({
        where: { cnpj: '12345678000195' },
        update: {},
        create: {
            cnpj: '12345678000195',
            name: 'Empresa Exemplo Ltda',
            email: 'contato@empresaexemplo.com',
            phone: '(11) 3333-4444',
            address: 'Rua das Flores, 123 - São Paulo, SP'
        }
    });
    const sampleAdminPassword = await bcryptjs_1.default.hash('admin123', 10);
    const sampleAdmin = await prisma.user.upsert({
        where: { email: 'admin@empresaexemplo.com' },
        update: {},
        create: {
            email: 'admin@empresaexemplo.com',
            password: sampleAdminPassword,
            name: 'Administrador da Empresa',
            role: 'ADMIN',
            companyId: sampleCompany.id
        }
    });
    const sampleOperatorPassword = await bcryptjs_1.default.hash('operador123', 10);
    const sampleOperator = await prisma.user.upsert({
        where: { email: 'operador@empresaexemplo.com' },
        update: {},
        create: {
            email: 'operador@empresaexemplo.com',
            password: sampleOperatorPassword,
            name: 'Operador da Portaria',
            role: 'OPERATOR',
            companyId: sampleCompany.id
        }
    });
    const visitors = await Promise.all([
        prisma.visitor.upsert({
            where: { id: 'visitor-1' },
            update: {},
            create: {
                id: 'visitor-1',
                name: 'João Silva',
                document: '12345678901',
                phone: '(11) 99999-1111',
                email: 'joao.silva@email.com',
                companyName: 'Fornecedor ABC',
                companyId: sampleCompany.id
            }
        }),
        prisma.visitor.upsert({
            where: { id: 'visitor-2' },
            update: {},
            create: {
                id: 'visitor-2',
                name: 'Maria Santos',
                document: '98765432100',
                phone: '(11) 99999-2222',
                email: 'maria.santos@email.com',
                companyName: 'Cliente XYZ',
                companyId: sampleCompany.id
            }
        }),
        prisma.visitor.upsert({
            where: { id: 'visitor-3' },
            update: {},
            create: {
                id: 'visitor-3',
                name: 'Pedro Oliveira',
                document: '11122233344',
                phone: '(11) 99999-3333',
                companyName: 'Técnico de Manutenção',
                companyId: sampleCompany.id
            }
        })
    ]);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sampleEntries = await Promise.all([
        prisma.entry.create({
            data: {
                type: 'ENTRY',
                timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30),
                notes: 'Visita agendada',
                visitorId: visitors[0].id,
                userId: sampleOperator.id,
                companyId: sampleCompany.id
            }
        }),
        prisma.entry.create({
            data: {
                type: 'EXIT',
                timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 45),
                notes: 'Reunião finalizada',
                visitorId: visitors[0].id,
                userId: sampleOperator.id,
                companyId: sampleCompany.id
            }
        }),
        prisma.entry.create({
            data: {
                type: 'ENTRY',
                timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 15),
                notes: 'Entrega de documentos',
                visitorId: visitors[1].id,
                userId: sampleOperator.id,
                companyId: sampleCompany.id
            }
        }),
        prisma.entry.create({
            data: {
                type: 'EXIT',
                timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30),
                notes: 'Entrega realizada',
                visitorId: visitors[1].id,
                userId: sampleOperator.id,
                companyId: sampleCompany.id
            }
        })
    ]);
    console.log('✅ Seed completed successfully!');
    console.log('👤 Super Admin:', superAdmin.email, '(password: admin123)');
    console.log('🏢 Sample Company Admin:', sampleAdmin.email, '(password: admin123)');
    console.log('👷 Sample Operator:', sampleOperator.email, '(password: operador123)');
    console.log('👥 Sample Visitors:', visitors.length);
    console.log('📝 Sample Entries:', sampleEntries.length);
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map