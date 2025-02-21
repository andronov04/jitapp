import { PrismaClient } from '@prisma/client';
import { getSystemPrompt } from '@/lib/llm/llm/prompts';

const prisma = new PrismaClient();

async function main() {
  //
  // const box = await prisma.box.findFirst({
  //   where: {
  //     id: "1b947572-b736-4fd1-b88a-630d16cee9ef"
  //   }
  // });
  // if (box) {
  //   const messages = await prisma.message.findMany({
  //     where: {
  //       boxId: box.id,
  //     },
  //   });
  //   const modelIds = messages
  //     .map((message) => message.modelId)
  //     .filter((id): id is string => Boolean(id));
  //   console.log(modelIds);
  //   const generatorIds = messages
  //     .map((message) => message.generatorId)
  //     .filter((id): id is string => Boolean(id));
  //   console.log([...new Set(generatorIds)]);
  //
  //   if (modelIds.length > 0) {
  //     // «Подключаем» (connect) все модели к боксу (Many-to-Many)
  //     await prisma.box.update({
  //       where: { id: box.id },
  //       data: {
  //         useModels: {
  //           connect: modelIds.map((id) => ({ id })),
  //         },
  //       },
  //     });
  //   }
  //   if (generatorIds.length > 0) {
  //     await prisma.box.update({
  //       where: { id: box.id },
  //       data: {
  //         useGenerators: {
  //           connect: [...new Set(generatorIds)].map((id) => ({ id })),
  //         },
  //       },
  //     });
  //   }
  // }
  //
  // return;
  const models = [
    {
      id: '505680da-28ba-4dc9-873b-036387fa938f',
      modelKey: 'gpt-4o-mini',
      modelLabel: 'gpt-4o-mini',
      providerLabel: 'OpenAI',
      providerKey: 'openai',
      headline: '',
      description:
        'GPT-4o mini from OpenAI is their most advanced and cost-efficient small model. It is multi-modal (accepting text or image inputs and outputting text) and has higher intelligence than gpt-3.5-turbo but is just as fast.',
      tags: [],
      order: 1,
      active: true,
      params: {},
    },
    {
      id: '775e4c03-fa51-43e9-bfa8-7d5030d49dc5',
      modelKey: 'deepseek-reasoner',
      modelLabel: 'DeepSeek R1',
      providerLabel: 'DeepSeek',
      providerKey: 'deepseek',
      headline: '',
      description:
        "DeepSeek Reasoner is a specialized model developed by DeepSeek that uses Chain of Thought (CoT) reasoning to improve response accuracy. Before providing a final answer, it generates detailed reasoning steps that are accessible through the API, allowing users to examine and leverage the model's thought process, served by Fireworks AI.\n",
      tags: [],
      order: 2,
      active: true,
      params: {},
    },
    {
      id: '3537a564-cbaa-40c5-b514-1877ebe48fd7',
      modelKey: 'claude-3.5-sonnet',
      modelLabel: 'claude-3.5-sonnet',
      providerLabel: 'Anthropic',
      providerKey: 'anthropic',
      headline: '',
      description:
        'Claude 3.5 Sonnet strikes the ideal balance between intelligence and speed—particularly for enterprise workloads. It delivers strong performance at a lower cost compared to its peers, and is engineered for high endurance in large-scale AI deployments.',
      tags: [],
      order: 3,
      active: true,
      params: {},
    },
    {
      id: '4058eb62-28c2-4131-8633-1f2a844c25f8',
      modelKey: 'o3-mini',
      modelLabel: 'o3-mini (High)',
      providerLabel: 'OpenAI',
      providerKey: 'openai',
      headline: '',
      description:
        'o3-mini with high reasoning effort - enhanced reasoning power exceeding o1 in many STEM domains.',
      tags: [],
      order: 4,
      active: true,
      params: {},
    },
  ];

  try {
    await Promise.all(
      models.map((model) => {
        return prisma.model.create({ data: model as any });
      }),
    );
  } catch (error) {
    console.log(error);
  }

  const oldGenerators = [
    {
      created: '2024-06-12 17:15:12.268578',
      updated: '2025-02-20 08:12:17.990046',
      uuid: '94cbddf8-64cc-44d1-bc48-fdd5bd3b2bbc',
      deleted: null,
      id: 26,
      type: 'generator',
      views: 'web,files',
      slug: 'web-code-generator',
      active: true,
      published: true,
      is_main: true,
      order: 0.0,
      meta: {
        key: 'web',
        tab: 'Web',
        code: 'WB',
        name: 'Web Code Generator',
        color: '#B3B3B3',
        prevSlug: 'web',
        shortName: 'Web Generator',
      },
      content: {
        title: 'Web Code Generator',
        heading: 'Web Code Generator. Make frontend faster.',
        summary:
          'The Web Code Generator is an AI-powered tool that automates the process of generating web code, ensuring efficiency and optimization for your website development projects.',
        category: 'Languages',
        examples: [
          'Create a webpage with a responsive navigation bar and a header section.',
          'Design a contact form with input fields for name, email, and message.',
          'Generate code for a responsive grid layout displaying images.',
          'Create a slideshow of images with navigation buttons and auto-play functionality.',
          'Implement a button that changes the background color of the page on click.',
          'Design a modal popup window with a close button and fade-in animation.',
          'Write JavaScript code for a simple interactive quiz with multiple-choice questions.',
          'Create a countdown timer that displays the time remaining in hours, minutes, and seconds.',
          'Generate a webpage with a fixed-position sidebar and a scrollable content area.',
          "Design a product card with an image, title, price, and a 'Buy Now' button.",
        ],
        subheading: 'Generate Web Code with AI',
        description:
          'Effortlessly generate frontend code for your web projects with our AI-powered Web Code Generator. Create HTML, CSS, and JavaScript code in seconds.',
        promptExamples: [
          'Create a webpage with a responsive navigation bar and a header section.',
          'Design a contact form with input fields for name, email, and message.',
          'Generate code for a responsive grid layout displaying images.',
          'Create a slideshow of images with navigation buttons and auto-play functionality.',
          'Implement a button that changes the background color of the page on click.',
          'Design a modal popup window with a close button and fade-in animation.',
          'Write JavaScript code for a simple interactive quiz with multiple-choice questions.',
          'Create a countdown timer that displays the time remaining in hours, minutes, and seconds.',
          'Generate a webpage with a fixed-position sidebar and a scrollable content area.',
          "Design a product card with an image, title, price, and a 'Buy Now' button.",
        ],
        formPlaceholder:
          'Enter your prompt to generate HTML, CSS and JavaScript code.',
      },
      metrics: { numRepos: 0 },
      page_private_id: 26,
      num_repos: 426149,
      markdown:
        "# Web Code Generator\n\nIn the ever-evolving world of web development, efficiency and innovation are paramount. Enter the Web Code Generator, a cutting-edge tool designed to streamline the coding process using advanced AI technology. Whether you're a seasoned developer or a beginner, this tool promises to enhance your coding experience by generating high-quality code quickly and accurately.\n\n![Web Code Generator](https://lpalozfqzbxclrffiqcm.supabase.co/storage/v1/object/public/public/pages/web_code_generator.png)\n\n## Accessible AI-Powered Coding for Free\n\nOne of the standout features of the Web Code Generator is its accessibility. Leveraging basic AI models, this tool is available for free to users, making it an invaluable resource for individuals and small teams. No need for expensive software or subscriptions – simply input your requirements, and let the AI do the heavy lifting.\n\n## How it works\n\nAt the core of the Web Code Generator is its sophisticated text-to-code technology. This innovative system translates natural language descriptions into functional code snippets. By understanding user inputs and converting them into precise code, the generator eliminates the tedious aspects of coding, allowing developers to focus on creativity and problem-solving.\n\n## Frontend development made easy\n\nFrontend development can often be time-consuming and intricate. The Web Code Generator simplifies this process by providing clean, efficient code tailored to your specifications. Whether you need responsive design elements, interactive features, or aesthetic enhancements, the generator delivers top-notch solutions to meet your frontend development needs.\n\nEmbrace the future of coding with the Web Code Generator and experience the power of AI in web development.\n\n## Explore more\n\nCurious about what the Web Code Generator can create? [Explore the results of our AI-generated code](https://jit.dev/explore?p=26) and see firsthand the quality and efficiency this tool brings to the table. From simple scripts to complex applications, the possibilities are endless.",
      bg: {},
      genPrivate: {
        id: '7f958eb0-2d95-4cf1-ba9e-b055723e4e99',
        seoWords: ['web', 'js'],
        systemTmpl: getSystemPrompt('/home/user'),
        systemNextTmpl: '',
      },
    },
  ];

  const generators: any = oldGenerators.map((a) => {
    return {
      id: a.uuid,
      tools: ['preview', 'code'],
      slug: a.slug,
      active: true,
      published: true,
      isMain: true,
      order: 100,
      meta: a.meta,
      genPrivate: a.genPrivate,
      content: a.content,
      numBoxes: 0,
      numMessages: 0,
      markdown: a.markdown,
    };
  });

  try {
    await Promise.all(
      generators.map(async (item: any) => {
        const genPrivate = await prisma.genPrivate.create({
          data: {
            id: item.genPrivate.id,
            seoWords: item.genPrivate.seoWords,
            systemTmpl: item.genPrivate.systemTmpl,
            systemNextTmpl: item.content.nextTmpl,
          },
        });
        delete item.genPrivate;
        return prisma.generator.create({
          data: {
            ...(item as any),
            genPrivateId: genPrivate.id,
          },
        });
      }),
    );
  } catch (error) {
    console.log('generator', error);
  }

  // 2) Создадим несколько генераторов:
  // const [bootstrapUI, materialUI] = await Promise.all([
  //   prisma.generator.create({
  //     data: {
  //       id: '3427c255-f170-4696-8800-97d4966f9287',
  //       name: 'BootstrapUI',
  //       description: 'Generate code using Bootstrap components',
  //       params: {
  //         version: '5.3',
  //       },
  //     },
  //   }),
  //   prisma.generator.create({
  //     data: {
  //       id: '086d2374-de38-4f08-afe5-8c202623a382',
  //       name: 'MaterialUI',
  //       description: 'Generate code using MaterialUI components',
  //       params: {
  //         version: '5.0',
  //       },
  //     },
  //   }),
  // ]);

  try {
    const u = await prisma.iuser.create({
      data: {
        id: '1da70359-6853-4408-9b3c-64f61ffa3d71',
        username: 'andronov04',
        provider: 'google',
        email: 'andronov04@gmail.com',
      },
    });
    console.log('User created', u);
  } catch (error) {
    console.log('user', error);
  }
  // prisma.user.create({
  //   data: {
  //     username: 'elonmusk',
  //     email: 'elonmusk@gmail.com',
  //   },
  // });

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
