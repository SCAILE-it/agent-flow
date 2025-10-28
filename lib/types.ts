// ABOUTME: Core TypeScript types for agent flow system
// ABOUTME: Defines agent schemas, workflow structure, and form data types

import { RJSFSchema } from '@rjsf/utils';

export interface AgentSchema {
  id: string;
  name: string;
  description: string;
  schema: RJSFSchema;
  uiSchema?: Record<string, any>;
}

export interface WorkflowNode {
  id: string;
  agentId: string;
  agentName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  formData?: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
}

export interface AgentFormProps {
  schema: AgentSchema;
  formData?: Record<string, any>;
  onSubmit?: (data: Record<string, any>) => void;
  onChange?: (data: Record<string, any>) => void;
}

export interface WorkflowTimelineProps {
  workflow: Workflow;
  onNodeClick?: (node: WorkflowNode) => void;
}
