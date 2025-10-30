# Contributing to Agent Flow

Thank you for your interest in contributing to Agent Flow! We welcome contributions from the community.

## 🎯 Quick Start

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/YOUR_USERNAME/agent-flow.git`
3. **Create a branch**: `git checkout -b feature/your-feature-name`
4. **Make your changes**
5. **Test your changes**: `npm run test && npm run build`
6. **Commit**: `git commit -m "feat: add your feature"`
7. **Push**: `git push origin feature/your-feature-name`
8. **Open a Pull Request**

## 📋 Development Setup

### Prerequisites
- Node.js 18+ and npm 9+
- Git

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your Gemini API key to .env.local
# GEMINI_API_KEY=your_api_key_here

# Start development server
npm run dev

# Open http://localhost:3000
```

## 🧪 Testing

We require tests for all new features:

```bash
# Run all tests
npm run test

# Run E2E tests
npx playwright test

# Run specific test file
npx playwright test tests/your-test.spec.ts
```

**Test Coverage Requirements:**
- New features: Must include tests
- Bug fixes: Must include regression test
- Minimum 80% coverage for new code

## 📐 Code Style

### TypeScript
- Strict mode enabled
- No implicit `any`
- Prefer interfaces over types
- Use path aliases (`@/` for imports from `src/`)

### Formatting
```bash
# Run linter
npm run lint

# Auto-fix linting issues
npm run lint -- --fix
```

### Example of Good Code

```typescript
// ✅ GOOD
import { AgentSchema } from '@/lib/types';

export async function createAgent(schema: AgentSchema): Promise<void> {
  try {
    // Implementation
  } catch (error) {
    logger.error('Failed to create agent', { error });
    throw new AppError('Agent creation failed', 'AGENT_ERROR');
  }
}

// ❌ BAD
export async function createAgent(schema: any) {
  const result = await someAsyncCall(); // No error handling
  console.log(result); // Use logger instead
  return result;
}
```

## 🎨 Component Guidelines

### File Organization
```
components/
├── feature-name/
│   ├── FeatureComponent.tsx       # Main component
│   ├── FeatureComponent.test.tsx  # Tests
│   ├── index.ts                   # Exports
│   └── types.ts                   # Types
```

### Component Structure

```tsx
'use client'; // Add if client component

// ABOUTME: Brief description of what this component does
// ABOUTME: Additional context or usage notes

import { useState } from 'react';
import { ComponentProps } from './types';

export function MyComponent({ prop1, prop2 }: ComponentProps) {
  const [state, setState] = useState();

  return (
    <div className="flex items-center gap-4">
      {/* Component content */}
    </div>
  );
}
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Numbered list of steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, Browser, Node version
6. **Screenshots**: If applicable

## ✨ Feature Requests

For feature requests, please include:

1. **Problem**: What problem does this solve?
2. **Proposed Solution**: How should it work?
3. **Alternatives**: Other solutions considered
4. **Additional Context**: Screenshots, examples, etc.

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests added for new features
- [ ] All tests passing (`npm run test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Documentation updated (if needed)
- [ ] CHANGELOG.md updated (if applicable)

### PR Title Format

Use conventional commits format:

- `feat: add new agent template`
- `fix: resolve API key exposure`
- `docs: update README with setup instructions`
- `refactor: simplify workflow execution logic`
- `test: add E2E tests for mobile layout`
- `chore: update dependencies`

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Tests passing
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🏗️ Project Architecture

### Directory Structure

```
agent-flow/
├── app/              # Next.js App Router (pages, API routes)
├── components/       # React components
│   ├── layout/       # Layout components (AppShell, Sidebar, etc.)
│   ├── ui/           # shadcn/ui primitives
│   └── [feature]/    # Feature-specific components
├── lib/
│   ├── api/          # API client functions
│   ├── execution/    # Workflow execution engine
│   ├── hooks/        # React hooks
│   ├── schemas/      # Agent schemas
│   ├── storage/      # LocalStorage utilities
│   └── utils/        # Utility functions
├── tests/            # E2E and integration tests
└── public/           # Static assets
```

### Key Principles

- **DRY**: Don't repeat yourself - create reusable utilities
- **SOLID**: Single responsibility, clear interfaces
- **KISS**: Keep it simple - prefer simple solutions
- **Minimal**: Write the least code necessary

## 📝 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

**Example:**

```
feat(agents): add email marketing agent template

- Add schema with campaign type, subject line, CTA fields
- Include tone selection (professional, friendly, urgent)
- Add personalization token support

Closes #123
```

## 💬 Communication

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Use GitHub Issues for bugs and features
- **Pull Requests**: Keep focused and well-documented

## 🎖️ Recognition

Contributors will be recognized in:
- README.md (Contributors section)
- CHANGELOG.md (Release notes)
- GitHub contributors page

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Playwright Docs](https://playwright.dev/)

## ❓ Questions?

If you have questions:

1. Check existing [GitHub Discussions](https://github.com/[username]/agent-flow/discussions)
2. Review [documentation](./README.md)
3. Open a new discussion

---

Thank you for contributing to Agent Flow! 🚀
