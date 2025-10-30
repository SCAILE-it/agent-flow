'use client';

// ABOUTME: Main application shell with Cursor-style layout
// ABOUTME: Combines sidebar, resizable panels, toolbar, and status bar with mobile responsive design

import { useState } from 'react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Sidebar } from './sidebar';
import { StatusBar } from './status-bar';
import { Toolbar } from './toolbar';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={cn('flex flex-col h-screen bg-background', className)}>
      {/* Mobile Sidebar Overlay */}
      <div
        className={cn('sidebar-overlay', isSidebarOpen && 'visible')}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="w-56 flex-shrink-0 h-full hidden md:block">
          <Sidebar
            workflows={workflows}
            currentWorkflowId={currentWorkflowId}
            onWorkflowSelect={onWorkflowSelect}
          />
        </div>

        {/* Mobile Sidebar Drawer */}
        <div className={cn('sidebar-mobile bg-card md:hidden', isSidebarOpen && 'open')}>
          <div className="h-full flex flex-col">
            {/* Close button */}
            <div className="h-12 flex items-center justify-between px-4 border-b border-border">
              <span className="text-sm font-semibold">Menu</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-accent rounded touch-target"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <Sidebar
                workflows={workflows}
                currentWorkflowId={currentWorkflowId}
                onWorkflowSelect={(id) => {
                  onWorkflowSelect?.(id);
                  setIsSidebarOpen(false);
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar with Mobile Hamburger */}
          <div className="flex items-center border-b border-border bg-card">
            {/* Mobile hamburger menu */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-3 hover:bg-accent touch-target"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex-1">
              <Toolbar
                onNewWorkflow={onNewWorkflow}
                onSave={onSave}
                onExport={onExport}
                onImport={onImport}
                onRun={onRun}
                onSettings={onSettings}
              />
            </div>
          </div>

          {/* Resizable Panels Container - Desktop */}
          <div className="flex-1 overflow-hidden hidden md:block">
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

          {/* Mobile Stacked Layout */}
          <div className="flex-1 overflow-auto md:hidden mobile-stack flex flex-col">
            {/* Workflow Panel - First on mobile for quick access */}
            <div className="mobile-min-h border-b border-border bg-card">
              {workflowPanel}
            </div>

            {/* Agent Config Panel */}
            <div className="mobile-min-h border-b border-border bg-card">
              {agentPanel}
            </div>

            {/* Global Config Panel */}
            <div className="mobile-min-h bg-card">
              {globalConfig}
            </div>
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
