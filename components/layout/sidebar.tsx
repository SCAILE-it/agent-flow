'use client';

// ABOUTME: Cursor-style sidebar navigation component with collapsible sections
// ABOUTME: Displays workflows, recent items, settings, and help sections

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Settings, HelpCircle, ChevronRight, Layers, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface WorkflowItem {
  id: string;
  name: string;
  status: 'active' | 'draft';
}

interface SidebarProps {
  workflows?: WorkflowItem[];
  currentWorkflowId?: string;
  onWorkflowSelect?: (id: string) => void;
  className?: string;
}

interface NavItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string;
}

const bottomNavItems: NavItem[] = [
  {
    id: 'settings',
    title: 'Settings',
    icon: <Settings className="h-4 w-4" />,
  },
  {
    id: 'help',
    title: 'Help',
    icon: <HelpCircle className="h-4 w-4" />,
  },
];

export function Sidebar({
  workflows = [],
  currentWorkflowId,
  onWorkflowSelect,
  className
}: SidebarProps) {
  const [activeItem, setActiveItem] = useState(currentWorkflowId || 'workflows');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['workflows'])
  );

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const handleWorkflowClick = (id: string) => {
    setActiveItem(id);
    onWorkflowSelect?.(id);
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-sidebar border-r border-sidebar-border',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center h-14 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-sidebar-primary" />
          <span className="font-semibold text-sm text-sidebar-foreground">
            Agent Flow
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <ScrollArea className="flex-1 scrollbar-cursor">
        <div className="p-2 space-y-1">
          {/* Workflows Section */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('workflows')}
              className={cn(
                'w-full flex items-center justify-between px-2 py-1.5 text-xs font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground rounded-md hover:bg-sidebar-accent transition-cursor',
                expandedSections.has('workflows') && 'text-sidebar-foreground'
              )}
            >
              <span className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5" />
                WORKFLOWS
              </span>
              <motion.div
                animate={{ rotate: expandedSections.has('workflows') ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedSections.has('workflows') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-1 space-y-0.5 pl-2">
                    {workflows.length > 0 ? (
                      workflows.map((workflow, index) => (
                        <motion.button
                          key={workflow.id}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleWorkflowClick(workflow.id)}
                          className={cn(
                            'w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-cursor group',
                            activeItem === workflow.id
                              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                              : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{workflow.name}</span>
                          </div>
                          <span
                            className={cn(
                              'text-[10px] px-1.5 py-0.5 rounded',
                              workflow.status === 'active'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {workflow.status}
                          </span>
                        </motion.button>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground px-2 py-1.5">
                        No workflows yet
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Recent Section */}
          <button
            onClick={() => setActiveItem('recent')}
            className={cn(
              'w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-cursor',
              activeItem === 'recent'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
            )}
          >
            <Clock className="h-4 w-4" />
            <span>Recent</span>
          </button>
        </div>

        <Separator className="my-2 bg-sidebar-border" />

        {/* Bottom Navigation */}
        <div className="p-2 space-y-0.5">
          {bottomNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-cursor',
                activeItem === item.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              {item.icon}
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs h-8"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="truncate">All systems operational</span>
          </span>
        </Button>
      </div>
    </div>
  );
}
