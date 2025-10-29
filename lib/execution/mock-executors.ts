// ABOUTME: Mock agent executors for testing and demonstration
// ABOUTME: Simulates agent execution with realistic delays and output

import { AgentExecutor } from './types';
import { FormData } from '../types';

/**
 * Utility to simulate async work with delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Content Research Agent Executor
 */
export const contentResearchExecutor: AgentExecutor = {
  id: 'content-research',
  name: 'Content Research',

  async execute(input: FormData): Promise<FormData> {
    await delay(2000); // Simulate research time

    return {
      topic: input.topic,
      researchData: {
        keyPoints: [
          'AI is transforming content creation',
          'Marketing automation saves 6+ hours per week',
          'Personalization increases engagement by 42%',
        ],
        sources: [
          'Marketing AI Report 2024',
          'Content Marketing Institute',
          'HubSpot Marketing Statistics',
        ],
        statistics: {
          adoptionRate: '67% of marketers use AI',
          roi: '3.5x average ROI on AI marketing tools',
        },
      },
      depth: input.depth || 'standard',
    };
  },
};

/**
 * Blog Writer Agent Executor
 */
export const blogWriterExecutor: AgentExecutor = {
  id: 'blog-writer',
  name: 'Blog Writer',

  async execute(input: FormData): Promise<FormData> {
    await delay(3000); // Simulate writing time

    const previousOutputs = input._previousOutputs as Record<string, FormData> | undefined;
    const researchData = previousOutputs?.['node-1']?.researchData as { keyPoints?: string[] } | undefined;

    return {
      title: input.topic || 'How AI is Transforming Marketing',
      content: `# ${input.topic || 'How AI is Transforming Marketing'}\n\nBased on recent research, ${researchData?.keyPoints?.[0] || 'AI is revolutionizing the industry'}...\n\n## Key Insights\n\n- Marketing teams are seeing significant productivity gains\n- Personalization is driving higher engagement\n- ROI on AI tools is compelling\n\n## Conclusion\n\nThe future of marketing is here.`,
      wordCount: input.wordCount || 1500,
      tone: input.tone || 'professional',
      keywords: input.keywords || ['AI', 'marketing', 'automation'],
    };
  },
};

/**
 * SEO Optimizer Agent Executor
 */
export const seoOptimizerExecutor: AgentExecutor = {
  id: 'seo-optimizer',
  name: 'SEO Optimizer',

  async execute(input: FormData): Promise<FormData> {
    await delay(1500); // Simulate optimization time

    const blogData = (input._previousOutputs as Record<string, FormData>)?.['node-2'];

    return {
      optimizedTitle: `${blogData?.title || 'Blog Post'} | Ultimate Guide 2024`,
      metaDescription: 'Discover how AI is transforming marketing with proven strategies and real-world examples. Learn the latest trends and best practices.',
      keywords: blogData?.keywords || ['AI', 'marketing', 'automation'],
      seoScore: 92,
      recommendations: [
        'Add internal links to related content',
        'Include more long-tail keywords',
        'Optimize image alt text',
      ],
      slug: (blogData?.title as string || 'blog-post')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
    };
  },
};

/**
 * Social Media Agent Executor
 */
export const socialMediaExecutor: AgentExecutor = {
  id: 'social-media',
  name: 'Social Media',

  async execute(input: FormData): Promise<FormData> {
    await delay(2000); // Simulate content generation time

    const previousOutputs = input._previousOutputs as Record<string, FormData> | undefined;
    const blogData = previousOutputs?.['node-2'];
    const seoData = previousOutputs?.['node-3'];

    const blogContent = typeof blogData?.content === 'string' ? blogData.content : '';
    const blogContentPreview = blogContent ? blogContent.substring(0, 200) : 'Read our comprehensive guide';

    return {
      platforms: input.platforms || ['twitter', 'linkedin', 'facebook'],
      posts: {
        twitter: `🚀 ${blogData?.title || 'New blog post'}\n\nDiscover how AI is transforming marketing in 2024\n\n${seoData?.slug ? `Read more: example.com/blog/${seoData.slug}` : ''}`,
        linkedin: `Excited to share our latest insights on AI in marketing! 🎯\n\n${blogContentPreview}...\n\n#AI #Marketing #DigitalTransformation`,
        facebook: `📢 New article alert!\n\n${blogData?.title || 'Check out our latest post'}\n\nWe dive deep into how AI is reshaping the marketing landscape. Click to read more!`,
      },
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      hashtags: ['AI', 'Marketing', 'ContentMarketing', 'DigitalMarketing'],
    };
  },
};

/**
 * Registry of all mock executors
 */
export const mockExecutors = [
  contentResearchExecutor,
  blogWriterExecutor,
  seoOptimizerExecutor,
  socialMediaExecutor,
];
