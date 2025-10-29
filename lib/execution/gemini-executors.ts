// ABOUTME: Real Gemini-powered agent executors for GTM workflow
// ABOUTME: Uses Google's Generative AI to perform actual content generation tasks

import { AgentExecutor } from './types';
import { FormData, FormDataValue } from '../types';
import { generateJSON, generateContent, isGeminiAvailable } from './gemini-client';

/**
 * Content Research Agent using Gemini
 */
export const geminiContentResearchExecutor: AgentExecutor = {
  id: 'content-research',
  name: 'Content Research',

  async execute(input: FormData): Promise<FormData> {
    if (!isGeminiAvailable()) {
      throw new Error('Gemini API key not configured');
    }

    const topic = (input.topic as string) || 'AI in Marketing';
    const depth = (input.depth as string) || 'standard';
    const includeStatistics = input.includeStatistics !== false;

    const prompt = `You are a professional content researcher. Research the topic: "${topic}"

Depth level: ${depth}
Include statistics: ${includeStatistics}

Provide comprehensive research data including:
- 5-7 key points about this topic
- 3-5 credible sources
- Relevant statistics (if requested)

Return your response as a JSON object with this structure:
{
  "keyPoints": ["point 1", "point 2", ...],
  "sources": ["source 1", "source 2", ...],
  "statistics": {
    "stat1": "value",
    "stat2": "value"
  }
}`;

    const researchData = await generateJSON(prompt);

    return {
      topic,
      researchData: researchData as Record<string, FormDataValue>,
      depth,
      includeStatistics,
    } as FormData;
  },
};

/**
 * Blog Writer Agent using Gemini
 */
export const geminiBlogWriterExecutor: AgentExecutor = {
  id: 'blog-writer',
  name: 'Blog Writer',

  async execute(input: FormData): Promise<FormData> {
    if (!isGeminiAvailable()) {
      throw new Error('Gemini API key not configured');
    }

    const previousOutputs = input._previousOutputs as Record<string, FormData> | undefined;
    const researchData = previousOutputs?.['node-1']?.researchData;

    const topic = (input.topic as string) || 'How AI is Transforming Marketing';
    const tone = (input.tone as string) || 'professional';
    const wordCount = (input.wordCount as number) || 1500;
    const keywords = (input.keywords as string[]) || ['AI', 'marketing', 'automation'];

    const researchContext = researchData
      ? `\n\nResearch data to incorporate:\n${JSON.stringify(researchData, null, 2)}`
      : '';

    const prompt = `You are a professional blog writer. Write a comprehensive blog post on: "${topic}"

Requirements:
- Tone: ${tone}
- Target word count: ${wordCount} words
- Include these keywords naturally: ${keywords.join(', ')}
${researchContext}

Write an engaging blog post in Markdown format with:
- Compelling title
- Clear structure with headings
- Engaging introduction
- Well-developed body sections
- Strong conclusion

Return only the markdown content.`;

    const content = await generateContent(prompt);

    // Extract title from content (first # heading)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : topic;

    return {
      title,
      content,
      wordCount,
      tone,
      keywords,
    } as FormData;
  },
};

/**
 * SEO Optimizer Agent using Gemini
 */
export const geminiSEOOptimizerExecutor: AgentExecutor = {
  id: 'seo-optimizer',
  name: 'SEO Optimizer',

  async execute(input: FormData): Promise<FormData> {
    if (!isGeminiAvailable()) {
      throw new Error('Gemini API key not configured');
    }

    const previousOutputs = input._previousOutputs as Record<string, FormData> | undefined;
    const blogData = previousOutputs?.['node-2'];

    const blogTitle = (blogData?.title as string) || 'Blog Post';
    const blogContent = (blogData?.content as string) || '';
    const keywords = (blogData?.keywords as string[]) || ['AI', 'marketing'];

    const prompt = `You are an SEO expert. Optimize this blog post for search engines:

Title: ${blogTitle}
Content: ${blogContent.substring(0, 500)}...
Keywords: ${keywords.join(', ')}

Provide SEO optimization data as JSON:
{
  "optimizedTitle": "SEO-friendly title with primary keyword",
  "metaDescription": "compelling 150-160 char meta description",
  "keywords": ["keyword1", "keyword2", ...],
  "seoScore": 85,
  "recommendations": ["rec1", "rec2", ...],
  "slug": "url-friendly-slug"
}`;

    const seoData = await generateJSON<{
      optimizedTitle: string;
      metaDescription: string;
      keywords: string[];
      seoScore: number;
      recommendations: string[];
      slug: string;
    }>(prompt);

    return seoData as FormData;
  },
};

/**
 * Social Media Agent using Gemini
 */
export const geminiSocialMediaExecutor: AgentExecutor = {
  id: 'social-media',
  name: 'Social Media',

  async execute(input: FormData): Promise<FormData> {
    if (!isGeminiAvailable()) {
      throw new Error('Gemini API key not configured');
    }

    const previousOutputs = input._previousOutputs as Record<string, FormData> | undefined;
    const blogData = previousOutputs?.['node-2'];
    const seoData = previousOutputs?.['node-3'];

    const blogTitle = (blogData?.title as string) || 'New Blog Post';
    const blogContent = (blogData?.content as string) || '';
    const slug = (seoData?.slug as string) || 'blog-post';

    const platforms = (input.platforms as string[]) || ['twitter', 'linkedin', 'facebook'];

    const prompt = `You are a social media expert. Create engaging social media posts for this blog:

Title: ${blogTitle}
Content: ${blogContent.substring(0, 300)}...
URL: example.com/blog/${slug}

Create posts for: ${platforms.join(', ')}

Requirements:
- Twitter: Max 280 characters, engaging hook
- LinkedIn: Professional, 1-3 paragraphs, hashtags
- Facebook: Casual, conversational, with emoji

Return as JSON:
{
  "posts": {
    "twitter": "post content",
    "linkedin": "post content",
    "facebook": "post content"
  },
  "hashtags": ["hashtag1", "hashtag2", ...]
}`;

    const socialData = await generateJSON<{
      posts: Record<string, string>;
      hashtags: string[];
    }>(prompt);

    return {
      platforms,
      posts: socialData.posts as Record<string, FormDataValue>,
      hashtags: socialData.hashtags,
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    } as FormData;
  },
};

/**
 * Registry of all Gemini-powered executors
 */
export const geminiExecutors = [
  geminiContentResearchExecutor,
  geminiBlogWriterExecutor,
  geminiSEOOptimizerExecutor,
  geminiSocialMediaExecutor,
];
