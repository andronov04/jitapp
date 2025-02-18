import {
  PrismaClient,
  BoxMode,
  MessageRole,
  MessageKind,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1) Создадим несколько моделей:
  const [gpt4, deepSeek] = await Promise.all([
    prisma.model.create({
      data: {
        name: 'GPT-4o-mini',
        provider: 'OpenAI',
        key: 'gpt-4o-mini',
        params: {
          maxTokens: 2000,
          temperature: 0.7,
        },
      },
    }),
    prisma.model.create({
      data: {
        name: 'DeepSeek',
        provider: 'CustomAI',
        key: 'deepseek-r1',
        params: {
          maxTokens: 1500,
          temperature: 0.8,
        },
      },
    }),
  ]);

  // 2) Создадим несколько генераторов:
  const [bootstrapUI, materialUI] = await Promise.all([
    prisma.generator.create({
      data: {
        name: 'BootstrapUI',
        description: 'Generate code using Bootstrap components',
        params: {
          version: '5.3',
        },
      },
    }),
    prisma.generator.create({
      data: {
        name: 'MaterialUI',
        description: 'Generate code using MaterialUI components',
        params: {
          version: '5.0',
        },
      },
    }),
  ]);

  prisma.user.create({
    data: {
      username: 'andronov04',
      email: 'andronov04@gmail.com',
    },
  });
  prisma.user.create({
    data: {
      username: 'elonmusk',
      email: 'elonmusk@gmail.com',
    },
  });

  console.log('Seed data has been successfully created!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
