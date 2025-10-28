'use client';

// ABOUTME: Reusable UI/JSON view mode toggle button component
// ABOUTME: Provides consistent toggle interface across workflow and agent panels

import { Code, Eye } from 'lucide-react';
import { ViewToggleProps } from '@/lib/types';

export function ViewToggle({ mode, onModeChange }: ViewToggleProps) {
  const buttonClass = (isActive: boolean) =>
    `
    px-4 py-2 text-sm font-medium transition-all rounded-md
    ${
      isActive
        ? 'bg-primary text-primary-foreground shadow-sm'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
    }
  `.trim();

  return (
    <div className="inline-flex gap-1 p-1 bg-muted rounded-lg">
      <button
        onClick={() => onModeChange('ui')}
        className={buttonClass(mode === 'ui')}
        type="button"
        aria-label="UI View"
      >
        <Eye className="inline-block w-4 h-4 mr-2" />
        UI
      </button>
      <button
        onClick={() => onModeChange('json')}
        className={buttonClass(mode === 'json')}
        type="button"
        aria-label="JSON View"
      >
        <Code className="inline-block w-4 h-4 mr-2" />
        JSON
      </button>
    </div>
  );
}
