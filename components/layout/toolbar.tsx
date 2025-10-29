'use client';

// ABOUTME: Cursor-style toolbar at the top of the main content area
// ABOUTME: Contains action buttons for workflow management

import { Plus, Save, Download, Upload, Play, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  onNewWorkflow?: () => void;
  onSave?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onRun?: () => void;
  onSettings?: () => void;
  className?: string;
}

export function Toolbar({
  onNewWorkflow,
  onSave,
  onExport,
  onImport,
  onRun,
  onSettings,
  className,
}: ToolbarProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          'flex items-center justify-between h-12 px-4 bg-card border-b border-border',
          className
        )}
      >
        {/* Left section - Primary actions */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                onClick={onNewWorkflow}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                New Workflow
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create a new workflow</p>
              <p className="text-xs text-muted-foreground">Cmd+N</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSave}
                className="h-8"
              >
                <Save className="h-4 w-4 mr-1.5" />
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save workflow</p>
              <p className="text-xs text-muted-foreground">Cmd+S</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onExport}
                className="h-8"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Export
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export workflow as JSON</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onImport}
                className="h-8"
              >
                <Upload className="h-4 w-4 mr-1.5" />
                Import
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Import workflow from JSON</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right section - Secondary actions */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                onClick={onRun}
                className="h-8 bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="h-4 w-4 mr-1.5" />
                Run Workflow
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Execute workflow</p>
              <p className="text-xs text-muted-foreground">Cmd+R</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSettings}
                className="h-8 w-8 p-0"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Workflow settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
