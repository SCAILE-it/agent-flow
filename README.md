# Agent Flow Builder

A lightweight, open-source library for building JSON Schema-based agent configuration forms with workflow visualization. Built with **Next.js**, **shadcn/ui**, and **@rjsf/shadcn**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- 🎨 **Beautiful Forms**: Auto-generate forms from JSON Schema using shadcn/ui components
- 📊 **Workflow Visualization**: Interactive workflow timeline with status indicators and real-time execution
- 🚀 **GTM Focused**: 11 pre-built agents for comprehensive content marketing workflows
- ⚡ **Production Ready**: ~4,250 LOC with Gemini AI integration and LocalStorage persistence
- 🔧 **TypeScript**: Fully typed with strict mode enabled
- 🎯 **Monochromatic Design**: Cursor-style aesthetic with OKLCH color space
- 🤖 **AI Powered**: Real Gemini AI execution with streaming responses
- 💾 **Auto-Save**: Automatic workflow persistence with LocalStorage
- 📱 **Responsive**: Mobile-friendly layout (in progress)
- ✅ **Tested**: Comprehensive E2E and screenshot testing with Playwright

## Quick Start

```bash
# Clone and install
git clone <repo-url>
cd agent-flow
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Usage

### 1. Define an Agent Schema

```typescript
import { AgentSchema } from '@/lib/types';

const myAgent: AgentSchema = {
  id: 'my-agent',
  name: 'My Agent',
  description: 'Does something useful',
  schema: {
    type: 'object',
    required: ['field1'],
    properties: {
      field1: {
        type: 'string',
        title: 'Field 1',
      },
      field2: {
        type: 'number',
        title: 'Field 2',
        minimum: 0,
        maximum: 100,
      },
    },
  },
};
```

### 2. Render the Form

```tsx
import { AgentForm } from '@/components/agent-form';

function MyComponent() {
  const handleSubmit = (data) => {
    console.log('Form data:', data);
  };

  return (
    <AgentForm
      schema={myAgent}
      onSubmit={handleSubmit}
    />
  );
}
```

### 3. Display a Workflow

```tsx
import { WorkflowTimeline } from '@/components/workflow-timeline';
import { Workflow } from '@/lib/types';

const workflow: Workflow = {
  id: 'my-workflow',
  name: 'My Workflow',
  description: 'A simple workflow',
  nodes: [
    {
      id: 'node-1',
      agentId: 'my-agent',
      agentName: 'My Agent',
      status: 'completed',
    },
    {
      id: 'node-2',
      agentId: 'another-agent',
      agentName: 'Another Agent',
      status: 'running',
    },
  ],
};

function MyWorkflow() {
  return <WorkflowTimeline workflow={workflow} />;
}
```

## Pre-built GTM Agents

The library includes 11 ready-to-use GTM agents:

### Core Content Agents
1. **Content Research Agent**: Research topics with configurable depth and source preferences
2. **Blog Writer Agent**: Generate blog content with tone, word count, and SEO keywords
3. **SEO Optimizer Agent**: Optimize content for search engines with meta descriptions
4. **Social Media Agent**: Create platform-specific social posts (LinkedIn, Twitter, Facebook, Instagram)

### Marketing Copy Agents
5. **Email Marketing Agent**: Create email campaigns with subject lines, preview text, and CTAs
6. **Ad Copy Writer**: Generate ad copy for Google Ads, Facebook Ads, and LinkedIn Ads
7. **LinkedIn Post Agent**: Create thought leadership and company update posts
8. **Video Script Agent**: Write scripts for marketing videos, explainers, and tutorials

### Conversion Agents
9. **Landing Page Copy**: Write high-converting landing pages with headlines and benefits
10. **Case Study Writer**: Craft compelling customer success stories with metrics
11. **Product Description**: Generate e-commerce product descriptions with features and benefits

See `lib/schemas/gtm-agents.ts` for full schemas.

## Architecture

```
agent-flow/
├── components/
│   ├── layout/
│   │   ├── app-shell.tsx           # Main application shell
│   │   ├── sidebar.tsx             # Workflow sidebar
│   │   ├── toolbar.tsx             # Action toolbar
│   │   ├── status-bar.tsx          # Status indicators
│   │   └── panel-container.tsx     # Reusable panel wrapper
│   ├── workflow-timeline.tsx       # Workflow visualization
│   ├── agent-view.tsx              # Agent configuration view
│   ├── global-config-view.tsx      # Global settings view
│   ├── workflow-view.tsx           # Workflow editor view
│   └── ui/                         # shadcn/ui primitives
├── lib/
│   ├── types.ts                    # TypeScript definitions
│   ├── schemas/
│   │   └── gtm-agents.ts           # 11 pre-built agent schemas
│   ├── hooks/
│   │   ├── useWorkflowStorage.ts   # LocalStorage persistence
│   │   └── useWorkflowExecution.ts # Gemini AI execution
│   └── utils/
│       └── workflow-utils.ts       # State management utilities
├── app/
│   ├── page.tsx                    # Main application page
│   └── globals.css                 # Cursor-style design system
├── tests/
│   ├── agent-flow-full-test.spec.ts      # 14 E2E tests
│   └── screenshot-analysis.spec.ts       # 10 screenshot tests
```

**Total code**: ~4,250 lines
**Core dependencies**: @rjsf/shadcn, @google/generative-ai, framer-motion

## Technology Stack

- **Next.js 15**: App Router, Turbopack
- **React 19**: Latest with TypeScript
- **Tailwind CSS 4**: Utility-first styling with OKLCH color space
- **shadcn/ui**: Component primitives
- **@rjsf/shadcn**: JSON Schema → React Hook Form → shadcn/ui
- **Framer Motion**: Animations and transitions
- **Google Gemini 2.5 Flash**: AI agent execution
- **Playwright**: E2E and screenshot testing
- **Zod**: Schema validation
- **TypeScript**: Strict mode enabled

## API Reference

### `AgentForm` Component

Props:
- `schema: AgentSchema` - Agent configuration schema
- `formData?: Record<string, any>` - Initial form values
- `onSubmit?: (data) => void` - Submit handler
- `onChange?: (data) => void` - Change handler

### `WorkflowTimeline` Component

Props:
- `workflow: Workflow` - Workflow configuration
- `onNodeClick?: (node) => void` - Node click handler

### `AgentSchema` Type

```typescript
interface AgentSchema {
  id: string;
  name: string;
  description: string;
  schema: RJSFSchema;      // JSON Schema definition
  uiSchema?: Record<string, any>;  // Optional UI customization
}
```

### `Workflow` Type

```typescript
interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
}

interface WorkflowNode {
  id: string;
  agentId: string;
  agentName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  formData?: Record<string, any>;
}
```

## Design System

Agent Flow uses a **Cursor-style monochromatic aesthetic** for a clean, professional interface:

### Color Palette
- **Color Space**: OKLCH for precise, perceptually uniform colors
- **Philosophy**: Pure grayscale with minimal functional colors
- **Functional Colors**: Only green (completed) and red (failed) for status

### State Management
- **Hover**: 10.2% white overlay (`bg-accent`)
- **Selected**: 16% white overlay (`bg-selected`)
- **Borders**: Subtle gray (`oklch(0.38 0 0)`)

### Typography
- **Heading Primary**: `text-lg font-semibold` (.heading-primary)
- **Heading Secondary**: `text-base font-medium` (.heading-secondary)
- **Caption**: `text-xs text-muted-foreground` (.text-caption)
- **Micro**: `text-[10px] leading-tight` (.text-micro)

### Components
- **Badges**: Monochromatic `.badge-mono` for all non-status indicators
- **Shadows**: Minimal 1px borders with `rgba(255, 255, 255, 0.04)`
- **Transitions**: 150ms cubic-bezier for smooth interactions

See `app/globals.css` for complete design system implementation.

## Roadmap

### Current (v1.0)
- ✅ JSON Schema → shadcn/ui forms
- ✅ Interactive workflow visualization with real-time status
- ✅ 11 comprehensive GTM agent templates
- ✅ TypeScript support with strict mode
- ✅ Gemini AI integration with streaming responses
- ✅ LocalStorage persistence with auto-save
- ✅ Workflow execution engine
- ✅ E2E and screenshot testing with Playwright
- ✅ Cursor-style monochromatic design system

### In Progress
- 🔄 Mobile responsive layout (hamburger menu, vertical stacking)
- 🔄 Performance optimizations (lazy loading, code splitting)

### Future
- 🔲 Drag-drop workflow editing (React Flow integration)
- 🔲 User schema creation UI
- 🔲 Backend database integration (Supabase/PostgreSQL)
- 🔲 Multi-user collaboration
- 🔲 Workflow templates marketplace
- 🔲 npm package for easy installation
- 🔲 API for programmatic workflow execution

## Contributing

This is an open-source project. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Principles

This project follows:
- **DRY**: Reuse proven libraries
- **SOLID**: Single responsibility, clear interfaces
- **KISS**: Simple solutions over complex ones
- **Minimal**: Least code necessary to achieve goals

## License

MIT

## Credits

Built with:
- [@rjsf/shadcn](https://github.com/rjsf-team/react-jsonschema-form) for form generation
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Next.js](https://nextjs.org/) for the framework
