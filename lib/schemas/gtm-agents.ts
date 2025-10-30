// ABOUTME: JSON Schema definitions for GTM-focused agents
// ABOUTME: Includes Blog Writer, SEO Optimizer, and Social Media agents

import { AgentSchema } from '../types';

export const blogWriterAgent: AgentSchema = {
  id: 'blog-writer',
  name: 'Blog Writer',
  description: 'Generate blog content based on topic and parameters',
  config: {
    allowSchemaEdit: false, // Users can't edit the schema structure
    allowDataEdit: true,    // Users can edit form data in JSON view
  },
  schema: {
    type: 'object',
    required: ['topic', 'tone', 'wordCount'],
    properties: {
      topic: {
        type: 'string',
        title: 'Topic',
        description: 'Main topic or subject of the blog post',
      },
      tone: {
        type: 'string',
        title: 'Tone',
        description: 'Writing style and tone',
        enum: ['professional', 'casual', 'technical', 'conversational'],
        default: 'professional',
      },
      targetAudience: {
        type: 'string',
        title: 'Target Audience',
        description: 'Who is this content for?',
        default: 'General audience',
      },
      keywords: {
        type: 'array',
        title: 'Keywords',
        description: 'SEO keywords to include',
        items: {
          type: 'string',
        },
        minItems: 1,
        maxItems: 10,
      },
      wordCount: {
        type: 'number',
        title: 'Word Count',
        description: 'Target word count for the blog post',
        minimum: 300,
        maximum: 3000,
        default: 1000,
      },
      includeEmojis: {
        type: 'boolean',
        title: 'Include Emojis',
        description: 'Add emojis to make content more engaging (for casual tone)',
        default: false,
      },
    },
  },
  uiSchema: {
    topic: {
      'ui:placeholder': 'Enter blog topic...',
    },
    targetAudience: {
      'ui:placeholder': 'e.g., Marketing professionals, Small business owners',
    },
    keywords: {
      'ui:options': {
        orderable: false,
      },
    },
  },
};

export const seoOptimizerAgent: AgentSchema = {
  id: 'seo-optimizer',
  name: 'SEO Optimizer',
  description: 'Optimize content for search engines',
  config: {
    allowSchemaEdit: false,
    allowDataEdit: true,
  },
  schema: {
    type: 'object',
    required: ['content', 'focusKeyword'],
    properties: {
      content: {
        type: 'string',
        title: 'Content',
        description: 'The content to optimize',
      },
      focusKeyword: {
        type: 'string',
        title: 'Focus Keyword',
        description: 'Primary keyword to optimize for',
      },
      metaDescription: {
        type: 'string',
        title: 'Meta Description',
        description: 'SEO meta description',
        maxLength: 160,
      },
      includeInternalLinks: {
        type: 'boolean',
        title: 'Include Internal Links',
        description: 'Add suggestions for internal linking',
        default: true,
      },
    },
  },
  uiSchema: {
    content: {
      'ui:widget': 'textarea',
      'ui:placeholder': 'Paste your content here...',
      'ui:options': {
        rows: 10,
      },
    },
    metaDescription: {
      'ui:placeholder': 'Brief description for search results...',
    },
  },
};

export const socialMediaAgent: AgentSchema = {
  id: 'social-media',
  name: 'Social Media',
  description: 'Generate social media posts from content',
  config: {
    allowSchemaEdit: false,
    allowDataEdit: true,
  },
  schema: {
    type: 'object',
    required: ['platform', 'content'],
    properties: {
      platform: {
        type: 'string',
        title: 'Platform',
        description: 'Social media platform',
        enum: ['LinkedIn', 'Twitter', 'Facebook', 'Instagram'],
        default: 'LinkedIn',
      },
      content: {
        type: 'string',
        title: 'Content',
        description: 'Base content to create post from',
      },
      includeHashtags: {
        type: 'boolean',
        title: 'Include Hashtags',
        description: 'Add relevant hashtags',
        default: true,
      },
      includeEmojis: {
        type: 'boolean',
        title: 'Include Emojis',
        description: 'Add emojis to make post more engaging',
        default: false,
      },
      maxLength: {
        type: 'number',
        title: 'Max Length',
        description: 'Maximum post length',
        minimum: 50,
        maximum: 5000,
      },
    },
  },
  uiSchema: {
    content: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 6,
      },
    },
  },
};

export const contentResearchAgent: AgentSchema = {
  id: 'content-research',
  name: 'Content Research',
  description: 'Research and gather information on a topic',
  config: {
    allowSchemaEdit: false,
    allowDataEdit: true,
  },
  schema: {
    type: 'object',
    required: ['topic'],
    properties: {
      topic: {
        type: 'string',
        title: 'Research Topic',
        description: 'What to research',
      },
      sources: {
        type: 'array',
        title: 'Preferred Sources',
        description: 'Specific sources or domains to prioritize',
        items: {
          type: 'string',
        },
      },
      depth: {
        type: 'string',
        title: 'Research Depth',
        description: 'How thorough should the research be?',
        enum: ['quick', 'standard', 'comprehensive'],
        default: 'standard',
      },
      includeStatistics: {
        type: 'boolean',
        title: 'Include Statistics',
        description: 'Look for relevant data and statistics',
        default: true,
      },
    },
  },
};

export const emailMarketingAgent: AgentSchema = {
  id: 'email-marketing',
  name: 'Email Marketing',
  description: 'Create email campaigns with subject lines, preview text, and body copy',
  config: {
    allowSchemaEdit: false,
    allowDataEdit: true,
  },
  schema: {
    type: 'object',
    required: ['campaignType', 'subjectLine', 'tone'],
    properties: {
      campaignType: {
        type: 'string',
        title: 'Campaign Type',
        description: 'Purpose of the email campaign',
        enum: ['newsletter', 'promotional', 'nurture', 'announcement', 'transactional'],
        default: 'newsletter',
      },
      subjectLine: {
        type: 'string',
        title: 'Subject Line',
        description: 'Email subject line',
        maxLength: 60,
      },
      previewText: {
        type: 'string',
        title: 'Preview Text',
        description: 'Text shown in inbox preview',
        maxLength: 100,
      },
      tone: {
        type: 'string',
        title: 'Tone',
        description: 'Email writing style',
        enum: ['professional', 'friendly', 'urgent', 'educational'],
        default: 'professional',
      },
      cta: {
        type: 'string',
        title: 'Call to Action',
        description: 'Primary CTA text',
      },
      wordCount: {
        type: 'number',
        title: 'Word Count',
        description: 'Target word count for email body',
        minimum: 50,
        maximum: 500,
        default: 200,
      },
      personalization: {
        type: 'boolean',
        title: 'Include Personalization',
        description: 'Add personalization tokens (first name, company, etc.)',
        default: true,
      },
    },
  },
  uiSchema: {
    subjectLine: {
      'ui:placeholder': 'e.g., Unlock 30% off this week only',
    },
    previewText: {
      'ui:placeholder': 'e.g., Limited time offer for our valued customers',
    },
    cta: {
      'ui:placeholder': 'e.g., Shop Now, Learn More, Get Started',
    },
  },
};

export const adCopyAgent: AgentSchema = {
  id: 'ad-copy',
  name: 'Ad Copy Writer',
  description: 'Generate ad copy for Google Ads, Facebook Ads, and LinkedIn Ads',
  config: {
    allowSchemaEdit: false,
    allowDataEdit: true,
  },
  schema: {
    type: 'object',
    required: ['platform', 'adFormat', 'headline'],
    properties: {
      platform: {
        type: 'string',
        title: 'Platform',
        description: 'Ad platform',
        enum: ['Google Ads', 'Facebook Ads', 'LinkedIn Ads', 'Instagram Ads'],
        default: 'Google Ads',
      },
      adFormat: {
        type: 'string',
        title: 'Ad Format',
        description: 'Type of ad',
        enum: ['Search', 'Display', 'Video', 'Carousel', 'Stories'],
        default: 'Search',
      },
      headline: {
        type: 'string',
        title: 'Headline',
        description: 'Primary ad headline',
        maxLength: 30,
      },
      description: {
        type: 'string',
        title: 'Description',
        description: 'Ad description text',
        maxLength: 90,
      },
      cta: {
        type: 'string',
        title: 'Call to Action',
        description: 'CTA button text',
      },
      targetAudience: {
        type: 'string',
        title: 'Target Audience',
        description: 'Who is this ad targeting?',
      },
      tone: {
        type: 'string',
        title: 'Tone',
        description: 'Ad copy tone',
        enum: ['professional', 'casual', 'urgent', 'inspirational'],
        default: 'professional',
      },
    },
  },
  uiSchema: {
    headline: {
      'ui:placeholder': 'Max 30 characters for Google Ads',
    },
    description: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 3,
      },
    },
  },
};

export const linkedinPostAgent: AgentSchema = {
  id: 'linkedin-post',
  name: 'LinkedIn Post',
  description: 'Create engaging LinkedIn posts for thought leadership and company updates',
  config: {
    allowSchemaEdit: false,
    allowDataEdit: true,
  },
  schema: {
    type: 'object',
    required: ['postType', 'topic'],
    properties: {
      postType: {
        type: 'string',
        title: 'Post Type',
        description: 'Type of LinkedIn post',
        enum: ['thought-leadership', 'company-update', 'industry-insight', 'personal-story', 'how-to'],
        default: 'thought-leadership',
      },
      topic: {
        type: 'string',
        title: 'Topic',
        description: 'Main topic or message',
      },
      tone: {
        type: 'string',
        title: 'Tone',
        description: 'Post writing style',
        enum: ['professional', 'conversational', 'inspirational', 'educational'],
        default: 'professional',
      },
      length: {
        type: 'string',
        title: 'Post Length',
        description: 'How long should the post be?',
        enum: ['short', 'medium', 'long'],
        default: 'medium',
      },
      includeHashtags: {
        type: 'boolean',
        title: 'Include Hashtags',
        description: 'Add relevant hashtags',
        default: true,
      },
      includeEmojis: {
        type: 'boolean',
        title: 'Include Emojis',
        description: 'Add emojis for engagement',
        default: false,
      },
      includeCTA: {
        type: 'boolean',
        title: 'Include Call to Action',
        description: 'End with a CTA or question',
        default: true,
      },
    },
  },
  uiSchema: {
    topic: {
      'ui:placeholder': 'e.g., The future of AI in marketing',
    },
  },
};

export const videoScriptAgent: AgentSchema = {
  id: 'video-script',
  name: 'Video Script',
  description: 'Write video scripts for marketing videos, explainers, and tutorials',
  config: {
    allowSchemaEdit: false,
    allowDataEdit: true,
  },
  schema: {
    type: 'object',
    required: ['videoLength', 'scriptStyle', 'topic'],
    properties: {
      videoLength: {
        type: 'string',
        title: 'Video Length',
        description: 'Target video duration',
        enum: ['15 seconds', '30 seconds', '60 seconds', '2-3 minutes', '5+ minutes'],
        default: '60 seconds',
      },
      scriptStyle: {
        type: 'string',
        title: 'Script Style',
        description: 'Type of video',
        enum: ['tutorial', 'explainer', 'testimonial', 'product-demo', 'social-media'],
        default: 'explainer',
      },
      topic: {
        type: 'string',
        title: 'Topic',
        description: 'Video topic or product',
      },
      hookType: {
        type: 'string',
        title: 'Hook Type',
        description: 'Opening hook style',
        enum: ['question', 'statistic', 'problem', 'bold-statement'],
        default: 'question',
      },
      tone: {
        type: 'string',
        title: 'Tone',
        description: 'Script tone',
        enum: ['professional', 'casual', 'energetic', 'educational'],
        default: 'professional',
      },
      includeCTA: {
        type: 'boolean',
        title: 'Include CTA',
        description: 'End with call to action',
        default: true,
      },
      includeVisualCues: {
        type: 'boolean',
        title: 'Include Visual Cues',
        description: 'Add notes for visuals and b-roll',
        default: true,
      },
    },
  },
  uiSchema: {
    topic: {
      'ui:placeholder': 'e.g., Our new SaaS platform features',
    },
  },
};

export const landingPageAgent: AgentSchema = {
  id: 'landing-page',
  name: 'Landing Page Copy',
  description: 'Write high-converting landing page copy with headlines, benefits, and CTAs',
  config: {
    allowSchemaEdit: false,
    allowDataEdit: true,
  },
  schema: {
    type: 'object',
    required: ['pageGoal', 'headline', 'targetAudience'],
    properties: {
      pageGoal: {
        type: 'string',
        title: 'Page Goal',
        description: 'Primary goal of the landing page',
        enum: ['lead-generation', 'product-launch', 'event-signup', 'demo-request', 'download'],
        default: 'lead-generation',
      },
      headline: {
        type: 'string',
        title: 'Headline',
        description: 'Hero headline (main value proposition)',
        maxLength: 100,
      },
      subheadline: {
        type: 'string',
        title: 'Subheadline',
        description: 'Supporting subheadline',
        maxLength: 150,
      },
      targetAudience: {
        type: 'string',
        title: 'Target Audience',
        description: 'Who is this page for?',
      },
      heroCTA: {
        type: 'string',
        title: 'Hero CTA',
        description: 'Primary call to action button text',
        default: 'Get Started',
      },
      benefitsCount: {
        type: 'number',
        title: 'Number of Benefits',
        description: 'How many key benefits to highlight',
        minimum: 3,
        maximum: 6,
        default: 3,
      },
      includeSocialProof: {
        type: 'boolean',
        title: 'Include Social Proof',
        description: 'Add testimonials or trust indicators',
        default: true,
      },
      tone: {
        type: 'string',
        title: 'Tone',
        description: 'Copy tone',
        enum: ['professional', 'casual', 'urgent', 'friendly'],
        default: 'professional',
      },
    },
  },
  uiSchema: {
    headline: {
      'ui:placeholder': 'e.g., Grow your business with AI-powered marketing',
    },
    subheadline: {
      'ui:placeholder': 'e.g., Join 10,000+ companies automating their workflows',
    },
  },
};

export const caseStudyAgent: AgentSchema = {
  id: 'case-study',
  name: 'Case Study Writer',
  description: 'Write compelling case studies showcasing customer success stories',
  config: {
    allowSchemaEdit: false,
    allowDataEdit: true,
  },
  schema: {
    type: 'object',
    required: ['clientName', 'problem', 'solution'],
    properties: {
      clientName: {
        type: 'string',
        title: 'Client Name',
        description: 'Company or client name',
      },
      industry: {
        type: 'string',
        title: 'Industry',
        description: 'Client industry or vertical',
      },
      problem: {
        type: 'string',
        title: 'Problem',
        description: 'What challenge did the client face?',
      },
      solution: {
        type: 'string',
        title: 'Solution',
        description: 'How did your product/service help?',
      },
      resultsMetrics: {
        type: 'array',
        title: 'Results & Metrics',
        description: 'Quantifiable results achieved',
        items: {
          type: 'string',
        },
        minItems: 1,
        maxItems: 5,
      },
      testimonialQuote: {
        type: 'string',
        title: 'Testimonial Quote',
        description: 'Quote from the client (optional)',
      },
      wordCount: {
        type: 'number',
        title: 'Word Count',
        description: 'Target word count',
        minimum: 300,
        maximum: 1500,
        default: 800,
      },
      includeTimeline: {
        type: 'boolean',
        title: 'Include Timeline',
        description: 'Add implementation timeline',
        default: true,
      },
    },
  },
  uiSchema: {
    problem: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 3,
      },
    },
    solution: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 3,
      },
    },
    resultsMetrics: {
      'ui:options': {
        orderable: false,
      },
    },
  },
};

export const productDescriptionAgent: AgentSchema = {
  id: 'product-description',
  name: 'Product Description',
  description: 'Generate product descriptions for e-commerce and marketing materials',
  config: {
    allowSchemaEdit: false,
    allowDataEdit: true,
  },
  schema: {
    type: 'object',
    required: ['productName', 'category', 'targetCustomer'],
    properties: {
      productName: {
        type: 'string',
        title: 'Product Name',
        description: 'Name of the product',
      },
      category: {
        type: 'string',
        title: 'Category',
        description: 'Product category',
        enum: ['SaaS', 'Physical Product', 'Service', 'Digital Product', 'App'],
        default: 'SaaS',
      },
      features: {
        type: 'array',
        title: 'Key Features',
        description: 'Main product features',
        items: {
          type: 'string',
        },
        minItems: 3,
        maxItems: 10,
      },
      benefits: {
        type: 'array',
        title: 'Key Benefits',
        description: 'Main benefits for customers',
        items: {
          type: 'string',
        },
        minItems: 2,
        maxItems: 5,
      },
      targetCustomer: {
        type: 'string',
        title: 'Target Customer',
        description: 'Who is this product for?',
      },
      tone: {
        type: 'string',
        title: 'Tone',
        description: 'Description tone',
        enum: ['professional', 'casual', 'technical', 'luxurious'],
        default: 'professional',
      },
      length: {
        type: 'string',
        title: 'Description Length',
        description: 'How detailed should the description be?',
        enum: ['brief', 'standard', 'detailed'],
        default: 'standard',
      },
    },
  },
  uiSchema: {
    features: {
      'ui:options': {
        orderable: false,
      },
    },
    benefits: {
      'ui:options': {
        orderable: false,
      },
    },
  },
};

export const gtmAgents = [
  contentResearchAgent,
  blogWriterAgent,
  seoOptimizerAgent,
  socialMediaAgent,
  emailMarketingAgent,
  adCopyAgent,
  linkedinPostAgent,
  videoScriptAgent,
  landingPageAgent,
  caseStudyAgent,
  productDescriptionAgent,
];
