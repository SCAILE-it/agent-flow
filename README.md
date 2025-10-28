# Agent Flow Builder

A lightweight, open-source library for building JSON Schema-based agent configuration forms with workflow visualization. Built with **Next.js**, **shadcn/ui**, and **@rjsf/shadcn**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- 🎨 **Beautiful Forms**: Auto-generate forms from JSON Schema using shadcn/ui components
- 📊 **Workflow Visualization**: Simple, read-only workflow timeline with status indicators
- 🚀 **GTM Focused**: Pre-built agents for content marketing workflows
- ⚡ **Minimal Code**: ~280 LOC of custom code, rest is proven libraries
- 🔧 **TypeScript**: Fully typed with strict mode enabled
- 🎯 **Zero Dependencies**: No heavy libraries like React Flow (only ~100 LOC for viz)

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

The library includes 4 ready-to-use GTM agents:

1. **Content Research Agent**: Research topics with configurable depth
2. **Blog Writer Agent**: Generate blog content with tone, word count, keywords
3. **SEO Optimizer Agent**: Optimize content for search engines
4. **Social Media Agent**: Create platform-specific social posts

See `lib/schemas/gtm-agents.ts` for full schemas.

## Architecture

```
agent-flow/
├── components/
│   ├── agent-form.tsx          # Form wrapper (~40 LOC)
│   └── workflow-timeline.tsx   # Workflow viz (~110 LOC)
├── lib/
│   ├── types.ts                # TypeScript definitions
│   └── schemas/
│       └── gtm-agents.ts       # Pre-built agent schemas
├── app/
│   └── page.tsx                # Demo application
```

**Total custom code**: ~280 lines
**Dependencies**: @rjsf/shadcn (proven library for forms)

## Technology Stack

- **Next.js 15**: App Router, Turbopack
- **React 19**: Latest with TypeScript
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Component primitives
- **@rjsf/shadcn**: JSON Schema → React Hook Form → shadcn/ui
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

## Roadmap

### Current (v1.0)
- ✅ JSON Schema → shadcn/ui forms
- ✅ Read-only workflow visualization
- ✅ 4 GTM agent examples
- ✅ TypeScript support

### Future
- 🔲 Drag-drop workflow editing (React Flow integration)
- 🔲 User schema creation UI
- 🔲 Backend integration (save/load workflows)
- 🔲 Workflow execution engine
- 🔲 More agent templates
- 🔲 npm package for easy installation

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
