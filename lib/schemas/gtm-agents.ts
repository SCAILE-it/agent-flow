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

export const gtmAgents = [
  contentResearchAgent,
  blogWriterAgent,
  seoOptimizerAgent,
  socialMediaAgent,
];
