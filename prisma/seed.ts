import { PrismaClient, UserRole, FeeType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const PRODUCT_IDS = {
  COURSE: randomUUID(),
  EBOOK: randomUUID(),
  MEMBERSHIP: randomUUID(),
};

const USER_IDS = {
  PRODUCER: randomUUID(),
  AFFILIATE: randomUUID(),
  COPRODUCER: randomUUID(),
  PLATFORM: randomUUID(),
  CUSTOMER: randomUUID(),
};

async function main() {
  console.log('Seeding database...');

  const defaultPassword = 'password123';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const producer = await prisma.user.upsert({
    where: { email: 'joao.silva@example.com' },
    update: {
      name: 'João Silva',
      passwordHash,
      role: UserRole.PRODUCER,
    },
    create: {
      id: USER_IDS.PRODUCER,
      name: 'João Silva',
      email: 'joao.silva@example.com',
      passwordHash,
      role: UserRole.PRODUCER,
    },
  });

  const producerId = producer.id;

  const findOrCreateProduct = async (
    name: string,
    description: string | null,
    defaultId: string,
  ) => {
    const existing = await prisma.product.findFirst({
      where: { name },
    });

    if (existing) {
      return await prisma.product.update({
        where: { id: existing.id },
        data: {
          name,
          description,
          producerId: producerId,
        },
      });
    }

    return await prisma.product.create({
      data: {
        id: defaultId,
        name,
        description,
        producerId: producerId,
      },
    });
  };

  const courseProduct = await findOrCreateProduct(
    'Curso Completo de Desenvolvimento Web',
    'Curso completo com mais de 100 horas de conteúdo sobre desenvolvimento web moderno',
    PRODUCT_IDS.COURSE,
  );

  const ebookProduct = await findOrCreateProduct(
    'Guia Definitivo de TypeScript',
    'E-book completo sobre TypeScript com exemplos práticos e casos de uso',
    PRODUCT_IDS.EBOOK,
  );

  const membershipProduct = await findOrCreateProduct(
    'Plano Premium Mensal',
    'Acesso mensal a todos os cursos e materiais exclusivos da plataforma',
    PRODUCT_IDS.MEMBERSHIP,
  );

  console.log('Products created:', {
    course: courseProduct.id,
    ebook: ebookProduct.id,
    membership: membershipProduct.id,
  });

  const affiliate = await prisma.user.upsert({
    where: { email: 'maria.santos@example.com' },
    update: {},
    create: {
      id: USER_IDS.AFFILIATE,
      name: 'Maria Santos',
      email: 'maria.santos@example.com',
      passwordHash,
      role: UserRole.AFFILIATE,
    },
  });

  const coproducer = await prisma.user.upsert({
    where: { email: 'pedro.oliveira@example.com' },
    update: {},
    create: {
      id: USER_IDS.COPRODUCER,
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@example.com',
      passwordHash,
      role: UserRole.COPRODUCER,
    },
  });

  const platform = await prisma.user.upsert({
    where: { email: 'admin@payments-platform.com' },
    update: {},
    create: {
      id: USER_IDS.PLATFORM,
      name: 'Plataforma Payments',
      email: 'admin@payments-platform.com',
      passwordHash,
      role: UserRole.PLATFORM,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'cliente@example.com' },
    update: {},
    create: {
      id: USER_IDS.CUSTOMER,
      name: 'Carlos Cliente',
      email: 'cliente@example.com',
      passwordHash,
      role: UserRole.CUSTOMER,
    },
  });

  console.log('Users created');

  await prisma.balance.upsert({
    where: { userId: producer.id },
    update: {},
    create: {
      id: randomUUID(),
      userId: producer.id,
      amount: new Decimal(0),
    },
  });

  await prisma.balance.upsert({
    where: { userId: affiliate.id },
    update: {},
    create: {
      id: randomUUID(),
      userId: affiliate.id,
      amount: new Decimal(0),
    },
  });

  await prisma.balance.upsert({
    where: { userId: coproducer.id },
    update: {},
    create: {
      id: randomUUID(),
      userId: coproducer.id,
      amount: new Decimal(0),
    },
  });

  await prisma.balance.upsert({
    where: { userId: platform.id },
    update: {},
    create: {
      id: randomUUID(),
      userId: platform.id,
      amount: new Decimal(0),
    },
  });

  await prisma.balance.upsert({
    where: { userId: customer.id },
    update: {},
    create: {
      id: randomUUID(),
      userId: customer.id,
      amount: new Decimal(0),
    },
  });

  console.log('Balances initialized');

  await prisma.fee.upsert({
    where: { countryCode: 'BR' },
    update: {},
    create: {
      id: randomUUID(),
      countryCode: 'BR',
      feePercentage: new Decimal(4.5),
      feeType: FeeType.NATIONAL,
      isDefault: false,
    },
  });

  await prisma.fee.upsert({
    where: { countryCode: 'US' },
    update: {},
    create: {
      id: randomUUID(),
      countryCode: 'US',
      feePercentage: new Decimal(5.5),
      feeType: FeeType.INTERNATIONAL,
      isDefault: false,
    },
  });

  await prisma.fee.upsert({
    where: { countryCode: 'CA' },
    update: {},
    create: {
      id: randomUUID(),
      countryCode: 'CA',
      feePercentage: new Decimal(5.0),
      feeType: FeeType.INTERNATIONAL,
      isDefault: false,
    },
  });

  await prisma.fee.upsert({
    where: { countryCode: 'GB' },
    update: {},
    create: {
      id: randomUUID(),
      countryCode: 'GB',
      feePercentage: new Decimal(5.5),
      feeType: FeeType.INTERNATIONAL,
      isDefault: false,
    },
  });

  await prisma.fee.upsert({
    where: { countryCode: 'DE' },
    update: {},
    create: {
      id: randomUUID(),
      countryCode: 'DE',
      feePercentage: new Decimal(5.0),
      feeType: FeeType.INTERNATIONAL,
      isDefault: false,
    },
  });

  const existingDefault = await prisma.fee.findFirst({
    where: { isDefault: true },
  });

  if (!existingDefault) {
    await prisma.fee.create({
      data: {
        id: randomUUID(),
        countryCode: 'DEFAULT',
        feePercentage: new Decimal(6.0),
        feeType: FeeType.INTERNATIONAL,
        isDefault: true,
      },
    });
  }

  console.log('Fees created for BR, US, CA, GB, DE and DEFAULT');

  const createCommissionsForProduct = async (
    productId: string,
    producerPercent: number,
    affiliatePercent: number,
    coproducerPercent: number,
    platformPercent: number,
  ) => {
    await prisma.commission.upsert({
      where: {
        role_productId: {
          role: UserRole.PRODUCER,
          productId,
        },
      },
      update: {},
      create: {
        id: randomUUID(),
        role: UserRole.PRODUCER,
        percentage: new Decimal(producerPercent),
        productId,
      },
    });

    await prisma.commission.upsert({
      where: {
        role_productId: {
          role: UserRole.AFFILIATE,
          productId,
        },
      },
      update: {},
      create: {
        id: randomUUID(),
        role: UserRole.AFFILIATE,
        percentage: new Decimal(affiliatePercent),
        productId,
      },
    });

    await prisma.commission.upsert({
      where: {
        role_productId: {
          role: UserRole.COPRODUCER,
          productId,
        },
      },
      update: {},
      create: {
        id: randomUUID(),
        role: UserRole.COPRODUCER,
        percentage: new Decimal(coproducerPercent),
        productId,
      },
    });

    await prisma.commission.upsert({
      where: {
        role_productId: {
          role: UserRole.PLATFORM,
          productId,
        },
      },
      update: {},
      create: {
        id: randomUUID(),
        role: UserRole.PLATFORM,
        percentage: new Decimal(platformPercent),
        productId,
      },
    });
  };

  await createCommissionsForProduct(courseProduct.id, 60, 20, 10, 10);

  await createCommissionsForProduct(ebookProduct.id, 70, 15, 5, 10);

  await createCommissionsForProduct(membershipProduct.id, 50, 25, 10, 15);

  console.log('Commissions created for all products');
  console.log('\nSeed completed successfully!');
  console.log('\n=== Test Users ===');
  console.log('Producer: joao.silva@example.com');
  console.log('Affiliate: maria.santos@example.com');
  console.log('Coproducer: pedro.oliveira@example.com');
  console.log('Platform: admin@payments-platform.com');
  console.log('Customer: cliente@example.com');
  console.log('\nDefault password for all users: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
