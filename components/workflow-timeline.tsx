'use client';

// ABOUTME: Read-only workflow visualization component using vertical timeline layout
// ABOUTME: Displays workflow nodes with status indicators and SVG arrows

import { WorkflowTimelineProps, WorkflowNode } from '@/lib/types';
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';

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
  const statusColors = {
    pending: 'border-gray-200 bg-gray-50',
    running: 'border-blue-300 bg-blue-50',
    completed: 'border-green-300 bg-green-50',
    configured: 'border-purple-300 bg-purple-50',
    failed: 'border-red-300 bg-red-50',
  };

  const hasConfiguration = node.formData && Object.keys(node.formData).length > 0;

  return (
    <div className="relative">
      <div
        className={`
          border-2 rounded-lg p-4 cursor-pointer transition-all
          hover:shadow-md ${statusColors[node.status]}
          ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
        `}
        onClick={() => onClick?.(node)}
      >
        <div className="flex items-start gap-3">
          <StatusIcon status={node.status} />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{node.agentName}</h3>
            <p className="text-sm text-muted-foreground capitalize mt-1">
              Status: {node.status}
            </p>
            {hasConfiguration && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                  ✓ Configured
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {!isLast && (
        <div className="flex justify-center my-2">
          <svg width="24" height="32" className="text-gray-400">
            <line
              x1="12"
              y1="0"
              x2="12"
              y2="24"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <polygon
              points="12,32 8,24 16,24"
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
      <div className="text-center py-12 text-muted-foreground">
        <p>No workflow nodes defined</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{workflow.name}</h2>
        {workflow.description && (
          <p className="text-muted-foreground mt-1">{workflow.description}</p>
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
