import { PrismaClient, UserRole, CompanyStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpa dados existentes (cuidado em produção!)
  await prisma.document.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  // ============================================
  // 1. CRIAR ADMINISTRADOR
  // ============================================
  const adminPassword = await bcrypt.hash('123456', 10);
  
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Master',
      email: 'admin@docflow.com',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Administrador criado:', admin.email);

  // ============================================
  // 2. CRIAR EMPRESA DEMO
  // ============================================
  const demoCompany = await prisma.company.create({
    data: {
      cnpj: '12.345.678/0001-99',
      fantasyName: 'Tech Solutions Ltda',
      socialReason: 'Tech Solutions Comércio e Serviços Ltda',
      zipCode: '69000-000',
      address: 'Av. Torquato Tapajós',
      number: '123',
      complement: 'Sala 456',
      neighborhood: 'Flores',
      city: 'Manaus',
      state: 'AM',
      phone: '(92) 99999-9999',
      status: CompanyStatus.ACTIVE, // Já aprovada para testes
    },
  });

  console.log('✅ Empresa demo criada:', demoCompany.fantasyName);

  // ============================================
  // 3. CRIAR FORNECEDOR DEMO
  // ============================================
  const supplierPassword = await bcrypt.hash('123456', 10);
  
  const supplier = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao@tech.com',
      password: supplierPassword,
      role: UserRole.SUPPLIER,
      companyId: demoCompany.id,
    },
  });

  console.log('✅ Fornecedor demo criado:', supplier.email);

  // ============================================
  // 4. CRIAR EMPRESA PENDENTE PARA TESTES
  // ============================================
  const pendingCompany = await prisma.company.create({
    data: {
      cnpj: '98.765.432/0001-10',
      fantasyName: 'Inovação Brasil',
      socialReason: 'Inovação Brasil Tecnologia Ltda',
      zipCode: '69050-000',
      address: 'Rua das Américas',
      number: '789',
      neighborhood: 'Adrianópolis',
      city: 'Manaus',
      state: 'AM',
      phone: '(92) 98888-8888',
      status: CompanyStatus.PENDING, // Aguardando aprovação
    },
  });

  const pendingSupplier = await prisma.user.create({
    data: {
      name: 'Maria Santos',
      email: 'maria@inovacao.com',
      password: supplierPassword,
      role: UserRole.SUPPLIER,
      companyId: pendingCompany.id,
    },
  });

  console.log('✅ Empresa pendente criada:', pendingCompany.fantasyName);
  console.log('✅ Fornecedor pendente criado:', pendingSupplier.email);

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 Admin:');
  console.log('   Email: admin@docflow.com');
  console.log('   Senha: 123456');
  console.log('\n👤 Fornecedor (Ativo):');
  console.log('   Email: joao@tech.com');
  console.log('   Senha: 123456');
  console.log('\n👤 Fornecedor (Pendente):');
  console.log('   Email: maria@inovacao.com');
  console.log('   Senha: 123456');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });