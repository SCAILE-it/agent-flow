'use client';

// ABOUTME: Cursor-style status bar at the bottom of the screen
// ABOUTME: Displays current workflow, selected agent, validation status, and system info

import { CheckCircle2, AlertCircle, Clock, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  workflowName?: string;
  selectedAgent?: string;
  validationStatus?: 'valid' | 'invalid' | 'pending';
  lastSaved?: string;
  className?: string;
}

export function StatusBar({
  workflowName = 'GTM Content Pipeline',
  selectedAgent = 'Content Research',
  validationStatus = 'valid',
  lastSaved,
  className,
}: StatusBarProps) {
  const statusIcon = {
    valid: <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />,
    invalid: <AlertCircle className="h-3.5 w-3.5 text-destructive" />,
    pending: <Clock className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />,
  };

  const statusText = {
    valid: 'Valid configuration',
    invalid: 'Invalid configuration',
    pending: 'Validating...',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between h-7 px-3 bg-sidebar border-t border-sidebar-border text-xs',
        className
      )}
    >
      {/* Left section - Workflow info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-sidebar-foreground/60">
          <span className="font-medium text-sidebar-foreground">Workflow:</span>
          <span className="truncate max-w-[200px]">{workflowName}</span>
        </div>

        <div className="h-3 w-px bg-sidebar-border" />

        <div className="flex items-center gap-1.5 text-sidebar-foreground/60">
          <span className="font-medium text-sidebar-foreground">Agent:</span>
          <span className="truncate max-w-[150px]">{selectedAgent}</span>
        </div>
      </div>

      {/* Right section - Status indicators */}
      <div className="flex items-center gap-4">
        {/* Validation status */}
        <div className="flex items-center gap-1.5">
          {statusIcon[validationStatus]}
          <span className="text-sidebar-foreground/60">
            {statusText[validationStatus]}
          </span>
        </div>

        {/* Last saved */}
        {lastSaved && (
          <>
            <div className="h-3 w-px bg-sidebar-border" />
            <div className="flex items-center gap-1.5 text-sidebar-foreground/60">
              <Save className="h-3.5 w-3.5" />
              <span>Saved {lastSaved}</span>
            </div>
          </>
        )}

        {/* System status */}
        <div className="h-3 w-px bg-sidebar-border" />
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sidebar-foreground/60">Ready</span>
        </div>
      </div>
    </div>
  );
}
