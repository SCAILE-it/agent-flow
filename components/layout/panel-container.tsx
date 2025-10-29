// ABOUTME: Reusable panel container component using shadcn Card primitives
// ABOUTME: Provides consistent spacing, borders, and structure for main app panels

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PanelContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

/**
 * PanelContainer - Semantic container for main application panels
 *
 * Follows Single Responsibility Principle: Only handles visual container structure
 * Content behavior is delegated to children components
 *
 * @param title - Panel heading text
 * @param children - Panel content (WorkflowView, AgentView, etc.)
 * @param className - Optional additional Tailwind classes
 * @param headerAction - Optional action buttons/toggles for header
 */
export function PanelContainer({
  title,
  children,
  className,
  headerAction,
}: PanelContainerProps) {
  return (
    <div className={cn('h-full flex flex-col', className)}>
      <div className="flex-shrink-0 flex items-center justify-between h-12 px-4 border-b border-border bg-card/50">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {headerAction}
      </div>
      <div className="flex-1 overflow-auto p-4 scrollbar-cursor">
        {children}
      </div>
    </div>
  );
}
