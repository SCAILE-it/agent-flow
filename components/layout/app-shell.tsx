'use client';

// ABOUTME: Main application shell with Cursor-style layout
// ABOUTME: Combines sidebar, resizable panels, toolbar, and status bar

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Sidebar } from './sidebar';
import { StatusBar } from './status-bar';
import { Toolbar } from './toolbar';
import { cn } from '@/lib/utils';

interface AppShellProps {
  globalConfig: React.ReactNode;
  agentPanel: React.ReactNode;
  workflowPanel: React.ReactNode;
  workflows?: Array<{ id: string; name: string; status: 'active' | 'draft' }>;
  currentWorkflowId?: string;
  workflowName?: string;
  selectedAgent?: string;
  validationStatus?: 'valid' | 'invalid' | 'pending';
  lastSaved?: string;
  onWorkflowSelect?: (id: string) => void;
  onSave?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onRun?: () => void;
  onNewWorkflow?: () => void;
  onSettings?: () => void;
  className?: string;
}

export function AppShell({
  globalConfig,
  agentPanel,
  workflowPanel,
  workflows,
  currentWorkflowId,
  workflowName,
  selectedAgent,
  validationStatus,
  lastSaved,
  onWorkflowSelect,
  onSave,
  onExport,
  onImport,
  onRun,
  onNewWorkflow,
  onSettings,
  className,
}: AppShellProps) {

  return (
    <div className={cn('flex flex-col h-screen bg-background', className)}>
      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0 h-full">
          <Sidebar
            workflows={workflows}
            currentWorkflowId={currentWorkflowId}
            onWorkflowSelect={onWorkflowSelect}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <Toolbar
            onNewWorkflow={onNewWorkflow}
            onSave={onSave}
            onExport={onExport}
            onImport={onImport}
            onRun={onRun}
            onSettings={onSettings}
          />

          {/* Resizable Panels Container */}
          <div className="flex-1 overflow-hidden">
            <ResizablePanelGroup direction="vertical" className="h-full">
              {/* Global Config Panel */}
              <ResizablePanel
                defaultSize={25}
                minSize={15}
                maxSize={40}
                className="relative"
              >
                <div className="h-full overflow-auto scrollbar-cursor bg-card">
                  {globalConfig}
                </div>
              </ResizablePanel>

              <ResizableHandle className="h-[1px] bg-border hover:bg-primary/50 transition-colors" />

              {/* Agent + Workflow Panels (Horizontal) */}
              <ResizablePanel defaultSize={75} minSize={60}>
                <ResizablePanelGroup direction="horizontal">
                  {/* Agent Configuration Panel */}
                  <ResizablePanel
                    defaultSize={50}
                    minSize={30}
                    maxSize={70}
                    className="relative"
                  >
                    <div className="h-full overflow-auto scrollbar-cursor bg-card border-r border-border">
                      {agentPanel}
                    </div>
                  </ResizablePanel>

                  <ResizableHandle className="w-[1px] bg-border hover:bg-primary/50 transition-colors" />

                  {/* Workflow Visualization Panel */}
                  <ResizablePanel
                    defaultSize={50}
                    minSize={30}
                    maxSize={70}
                    className="relative"
                  >
                    <div className="h-full overflow-auto scrollbar-cursor bg-card">
                      {workflowPanel}
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar
        workflowName={workflowName}
        selectedAgent={selectedAgent}
        validationStatus={validationStatus}
        lastSaved={lastSaved}
      />
    </div>
  );
}
