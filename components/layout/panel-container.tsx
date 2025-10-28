// ABOUTME: Reusable panel container component using shadcn Card primitives
// ABOUTME: Provides consistent spacing, borders, and structure for main app panels

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className={cn('min-h-[600px] flex flex-col', className)}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl">{title}</CardTitle>
        {headerAction}
      </CardHeader>
      <CardContent className="flex-1 overflow-auto pt-0">
        {children}
      </CardContent>
    </Card>
  );
}
