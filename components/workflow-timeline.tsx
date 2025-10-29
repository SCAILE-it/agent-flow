'use client';

// ABOUTME: Read-only workflow visualization component using vertical timeline layout
// ABOUTME: Displays workflow nodes with status indicators and SVG arrows

import { motion } from 'framer-motion';
import { WorkflowTimelineProps, WorkflowNode } from '@/lib/types';
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStatusColors } from '@/lib/utils/status-colors';

const StatusIcon = ({ status }: { status: WorkflowNode['status'] }) => {
  const iconClass = 'h-6 w-6';

  switch (status) {
    case 'completed':
      return <CheckCircle2 className={`${iconClass} text-green-500`} />;
    case 'running':
      return <Loader2 className={`${iconClass} text-blue-500 animate-spin`} />;
    case 'failed':
      return <XCircle className={`${iconClass} text-red-500`} />;
    default:
      return <Circle className={`${iconClass} text-gray-300`} />;
  }
};

const NodeCard = ({
  node,
  onClick,
  isLast,
  isSelected
}: {
  node: WorkflowNode;
  onClick?: (node: WorkflowNode) => void;
  isLast: boolean;
  isSelected?: boolean;
}) => {
  const hasConfiguration = node.formData && Object.keys(node.formData).length > 0;

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={cn(
          "border rounded-lg p-3.5 cursor-pointer transition-cursor shadow-card hover:shadow-card-hover",
          "hover:border-primary/50 hover:bg-accent/30",
          getStatusColors(node.status),
          isSelected && "border-primary bg-primary/10 shadow-card-hover"
        )}
        onClick={() => onClick?.(node)}
      >
        <div className="flex items-start gap-3">
          <StatusIcon status={node.status} />
          <div className="flex-1 min-w-0">
            <h3 className="heading-secondary mb-0.5">{node.agentName}</h3>
            <p className="text-caption capitalize">
              {node.status}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {hasConfiguration && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border badge-configured">
                  Configured
                </span>
              )}
              {node.requiresApproval && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border badge-approval">
                  Approval
                </span>
              )}
              {node.conditions && node.conditions.length > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border badge-conditional">
                  Conditional
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {!isLast && (
        <div className="flex justify-center my-2">
          <svg width="20" height="24" className="text-border">
            <line
              x1="10"
              y1="0"
              x2="10"
              y2="16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />
            <polygon
              points="10,24 7,16 13,16"
              fill="currentColor"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export function WorkflowTimeline({ workflow, selectedNodeId, onNodeClick }: WorkflowTimelineProps) {
  if (!workflow.nodes || workflow.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div>
          <p className="text-sm text-muted-foreground">No workflow nodes defined</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Add agents to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4">
        <h2 className="heading-primary mb-1">{workflow.name}</h2>
        {workflow.description && (
          <p className="text-caption">{workflow.description}</p>
        )}
      </div>

      <div className="space-y-0">
        {workflow.nodes.map((node, index) => (
          <NodeCard
            key={node.id}
            node={node}
            onClick={onNodeClick}
            isLast={index === workflow.nodes.length - 1}
            isSelected={selectedNodeId === node.id}
          />
        ))}
      </div>
    </div>
  );
}
