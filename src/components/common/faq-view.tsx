import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'What is JIT?',
    answer:
      'An AI-powered coding platform and community that accelerates development through smart code generation. Collaborate with developers, share knowledge, and build projects faster with AI. Ideal for coders of all levels who are looking to enhance their coding experience.',
  },
  {
    question: 'What are AI code generators?',
    answer:
      'AI code generators are tools that leverage artificial intelligence to automatically create code snippets or even complete programs based on user input or predefined rules. They help developers speed up the coding process, reduce errors, and explore different coding solutions with minimal effort.',
  },
  {
    question: 'What are Code Generations?',
    answer:
      'Code Generations are interactive coding environments powered by AI that assist developers by generating, completing, and debugging code in real-time. They offer a hands-on, intelligent workspace, streamlining the development process, and enhancing productivity for programmers of all skill levels.',
  },
  {
    question: 'Can I use JIT for free?',
    answer:
      'You can sign up for free to start using JIT, with no credit card required. You can purchase credits for advanced AI models without a subscription. For advanced features, you can subscribe to the Pro or Pro+ Plan on a monthly or yearly basis.',
  },
  {
    question: 'What AI models are available on JIT?',
    answer: 'The full list is presented in the Usage Pricing section.',
  },
  {
    question: 'How much does JIT cost?',
    answer:
      'There are two types of costs:\n\n1. Subscription Pricing: Access to the JIT platform is billed on a monthly or yearly basis. JIT offers three subscription plans to choose from: Free, Pro, and Pro+. Check out our full pricing in the Plans section.\n\n2. Usage Pricing: In addition to your subscription, there are usage fees. Each AI model will have varying costs depending on usage. Factors such as LLM token costs, data source vectorization and storage, function calls, and API calls will affect this cost. Check out our full usage pricing in the Usage Pricing section.',
  },
  {
    question: 'What are credits?',
    answer:
      'Credits are the currency of JIT. Credits are purchased upfront and are used to pay for JIT platform usage in real time. They are used to measure your query usage, with consumption varying depending on the AI model you use. You can view your credit consumption in the account settings.',
  },
  {
    question: 'How are credits calculated?',
    answer:
      'Calculating credits is a metric used to measure the usage of AI models. Credit consumption varies across different AI models. View details (#usage).',
  },
  {
    question: 'What if I run out of credits?',
    answer:
      'You can buy more credits directly from your account settings at any time. You can purchase credits without a subscription or upgrade to a higher plan for advanced features.',
  },
  {
    question: 'Can I track my credit usage and history?',
    answer:
      'Yes, your account settings provides a detailed history of credit purchases, usage, and remaining balances. This allows for easy tracking and management of your resources.',
  },
  {
    question: 'Do credits expire?',
    answer:
      "No, there's no expiration date for the credits you purchased. A monthly credit allotment is included in the Pro and Pro+ plans every month. These credits do not expire either.",
  },
  {
    question: 'Are credits refundable?',
    answer: 'Currently credits are not refundable.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes, you can cancel your subscription at any time. Simply go to your account settings and select "Cancel subscription".',
  },
  {
    question: 'How can I get a refund?',
    answer:
      'You can cancel your subscription at any time, but we cannot issue refunds for partial use of service or the amount of time left in your subscription.',
  },
  {
    question: 'What are tokens?',
    answer:
      'Tokens are units of measurement that represent computational resources used by AI models. In the context of generating images, videos, and texts, tokens typically represent the number of words, characters, or pixels involved in a task. On average, we can say that 1000 tokens are approximately 750 words.',
  },
  {
    question: 'What is your fair usage policy?',
    answer:
      'Our fair usage policy ensures the safety and quality of our AI service by enforcing certain limits on usage. Additionally, our AI partners set generation limits per minute and hour to prevent potential misuse and abuse. To maintain the integrity of our service, our AI engine restricts certain types of usage behavior and temporarily adjusts parameters when abnormally heavy usage is detected. This may result in a temporary deterioration of output quality, which is usually resolved at the end of the monthly cycle. Keep in mind that fast generation may impact output quality due to controls set by our language AI provider. Continuous content generation can also clutter your editor and cause you to miss valuable information. However, regular users who generate, read, and edit outputs rarely encounter these issues. If you are experiencing any problems with output quality or generation, please contact us at support@jit.dev. Please note that refunds are not offered under our Refund Policy. We appreciate your understanding and cooperation in helping us maintain a safe and reliable AI service.',
  },
  {
    question: 'How do I delete my account?',
    answer:
      'Contact us at support@jit.dev. In the subject line of the message, write "Account deletion request".',
  },
  {
    question: 'Do you have any questions?',
    answer: 'Contact us at support@jit.dev.',
  },
];

const pricingData = [
  {
    model: 'GPT-4o-mini',
    input: 'FREE',
    output: 'FREE',
  },
  {
    model: 'Claude 3.5 Sonnet',
    input: '0.0072$ / 30 credits / 1k tokens',
    output: '0.036$ / 90 credits / 1k tokens',
  },
  {
    model: 'GPT-4o',
    input: '0.012$ / 50 credits / 1k tokens',
    output: '0.036$ / 90 credits / 1k tokens',
  },
  {
    model: 'DeepSeek R1',
    input: '0.004$ / 18 credits / 1k tokens',
    output: '0.012$ / 30 credits / 1k tokens',
  },
];

export function FaqView() {
  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div id="usage-pricing" className="mt-6">
        <div>
          Usage pricing.{' '}
          <span className="text-muted-foreground">Understand your costs.</span>
        </div>
        <div className="overflow-x-auto">
          <table className="mb-4 w-full">
            <thead>
              <tr className="border-secondary-500 border-b">
                <th className="py-2 text-left">Models</th>
                <th className="py-2 text-left">Input</th>
                <th className="py-2 text-left">Output</th>
              </tr>
            </thead>
            <tbody>
              {pricingData.map((item, index) => (
                <tr key={index} className="border-secondary-500 border-b">
                  <td className="py-2">{item.model}</td>
                  <td className="py-2">{item.input}</td>
                  <td className="py-2">{item.output}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          Prices are per 1,000 tokens and vary by model size. You can think of
          tokens as pieces of words, where 1,000 tokens is about 750 words.
        </p>

        <p className="text-sm">
          Credits: % 1 per 1k credit / token pricing varies / model pricing
          varies
        </p>
      </div>
    </div>
  );
}
