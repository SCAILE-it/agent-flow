// ABOUTME: Utility function for consistent status color mapping across components
// ABOUTME: Returns Tailwind classes for borders, backgrounds based on workflow node status

import { NodeStatus } from '../types';

/**
 * Returns Tailwind CSS classes for status-based styling
 * Used by workflow timeline, status indicators, etc.
 */
export function getStatusColors(status: NodeStatus): string {
  const statusColorMap: Record<NodeStatus, string> = {
    pending: 'border-border/50 bg-muted/30',
    running: 'border-blue-500/30 bg-blue-500/5',
    completed: 'border-green-500/30 bg-green-500/5',
    configured: 'border-primary/30 bg-primary/5',
    failed: 'border-destructive/30 bg-destructive/5',
  };

  return statusColorMap[status] || statusColorMap.pending;
}
