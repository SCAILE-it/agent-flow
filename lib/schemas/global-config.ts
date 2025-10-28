// ABOUTME: Global configuration JSON Schema for workflow-wide settings
// ABOUTME: Defines Brand Voice, Products, Target Audience, and SEO Strategy

import { AgentSchema } from '../types';

/**
 * Global Configuration Schema
 *
 * Contains company-wide settings that cascade to all agent nodes:
 * - Brand Voice: Tone, guidelines, personality
 * - Products: Product catalog with descriptions
 * - Target Audience: Customer personas and demographics
 * - SEO Strategy: Primary and secondary keywords
 *
 * These values merge with node-level configurations using hybrid logic:
 * - Arrays (keywords, products): Append global + node values
 * - Primitives (tone, topic): Node overrides, else use global as default
 */
export const globalConfigSchema: AgentSchema = {
  id: 'global-config',
  name: 'Global Configuration',
  description: 'Company-wide settings that apply to all agents in the workflow',
  config: {
    allowSchemaEdit: false,
    allowDataEdit: true,
  },
  schema: {
    type: 'object',
    properties: {
      // Brand Voice Section
      brandVoice: {
        type: 'object',
        title: 'Brand Voice',
        description: 'Company-wide tone and writing style guidelines',
        properties: {
          tone: {
            type: 'string',
            title: 'Default Tone',
            description: 'Primary writing tone for all content',
            enum: ['professional', 'casual', 'technical', 'conversational', 'friendly', 'authoritative'],
            default: 'professional',
          },
          guidelines: {
            type: 'string',
            title: 'Writing Guidelines',
            description: 'Specific writing style rules and preferences',
          },
          personality: {
            type: 'string',
            title: 'Brand Personality',
            description: 'Key personality traits to convey in content',
          },
        },
      },

      // Products Section
      products: {
        type: 'array',
        title: 'Product Catalog',
        description: 'Products and services to reference in content',
        items: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              title: 'Product Name',
            },
            description: {
              type: 'string',
              title: 'Description',
            },
            features: {
              type: 'array',
              title: 'Key Features',
              items: {
                type: 'string',
              },
            },
          },
        },
      },

      // Target Audience Section
      targetAudience: {
        type: 'array',
        title: 'Target Audience',
        description: 'Customer personas and target demographics',
        items: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              title: 'Persona Name',
            },
            demographics: {
              type: 'string',
              title: 'Demographics',
              description: 'Age, location, job title, income level, etc.',
            },
            psychographics: {
              type: 'string',
              title: 'Psychographics',
              description: 'Values, interests, pain points, goals',
            },
          },
        },
      },

      // SEO Strategy Section
      seoStrategy: {
        type: 'object',
        title: 'SEO Strategy',
        description: 'Core keywords and SEO guidelines',
        properties: {
          primaryKeywords: {
            type: 'array',
            title: 'Primary Keywords',
            description: 'Main keywords to target across all content',
            items: {
              type: 'string',
            },
            maxItems: 10,
          },
          secondaryKeywords: {
            type: 'array',
            title: 'Secondary Keywords',
            description: 'Supporting keywords and long-tail variations',
            items: {
              type: 'string',
            },
            maxItems: 20,
          },
        },
      },
    },
  },
  uiSchema: {
    brandVoice: {
      guidelines: {
        'ui:widget': 'textarea',
        'ui:placeholder': 'e.g., Use active voice, avoid jargon, keep sentences under 20 words...',
        'ui:options': {
          rows: 4,
        },
      },
      personality: {
        'ui:placeholder': 'e.g., Innovative, approachable, data-driven...',
      },
    },
    products: {
      'ui:options': {
        orderable: true,
      },
      items: {
        description: {
          'ui:widget': 'textarea',
          'ui:options': {
            rows: 3,
          },
        },
      },
    },
    targetAudience: {
      'ui:options': {
        orderable: true,
      },
      items: {
        demographics: {
          'ui:widget': 'textarea',
          'ui:placeholder': 'e.g., 25-40 years old, B2B SaaS marketers, $80k+ income...',
          'ui:options': {
            rows: 2,
          },
        },
        psychographics: {
          'ui:widget': 'textarea',
          'ui:placeholder': 'e.g., Values efficiency, struggles with content ROI, goal to increase leads...',
          'ui:options': {
            rows: 2,
          },
        },
      },
    },
    seoStrategy: {
      primaryKeywords: {
        'ui:options': {
          orderable: false,
        },
      },
      secondaryKeywords: {
        'ui:options': {
          orderable: false,
        },
      },
    },
  },
};
