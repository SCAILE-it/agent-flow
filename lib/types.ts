// ABOUTME: Core TypeScript types for agent flow system
// ABOUTME: Defines agent schemas, workflow structure, and form data types

import { RJSFSchema } from '@rjsf/utils';

// Strict type for form data (avoid 'any')
export type FormDataValue = string | number | boolean | null | FormDataValue[] | { [key: string]: FormDataValue };
export type FormData = Record<string, FormDataValue>;

// Conditional workflow types
export type ConditionOperator = 'equals' | 'notEquals' | 'exists' | 'notExists';
export type ConditionActionType = 'showFields' | 'hideFields';

export interface ConditionAction {
  type: ConditionActionType;
  fields: string[];
}

export interface Condition {
  field: string;
  operator: ConditionOperator;
  value?: FormDataValue;
  action: ConditionAction;
}

// Node status with configured state
export type NodeStatus = 'pending' | 'running' | 'completed' | 'failed' | 'configured';

// View modes for UI toggle
export type ViewMode = 'ui' | 'json';
export type JsonTab = 'input' | 'work';

// Agent configuration for editability control
export interface AgentConfig {
  allowSchemaEdit: boolean;
  allowDataEdit: boolean;
}

export interface AgentSchema {
  id: string;
  name: string;
  description: string;
  schema: RJSFSchema;
  uiSchema?: Record<string, unknown>;
  config?: AgentConfig;
}

export interface WorkflowNode {
  id: string;
  agentId: string;
  agentName: string;
  status: NodeStatus;
  formData?: FormData;
  lastModified?: string;
  conditions?: Condition[];
  requiresApproval?: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  globalConfig?: FormData;
  nodes: WorkflowNode[];
}

export interface AgentFormProps {
  schema: AgentSchema;
  formData?: FormData;
  onSubmit?: (data: FormData) => void;
  onChange?: (data: FormData) => void;
}

export interface WorkflowTimelineProps {
  workflow: Workflow;
  selectedNodeId?: string;
  onNodeClick?: (node: WorkflowNode) => void;
}

// JSON Editor Props
export interface JsonEditorProps {
  value: unknown;
  onChange: (value: unknown) => void;
  readOnly?: boolean;
  title: string;
  onValidationError?: (error: string) => void;
}

// View Toggle Props
export interface ViewToggleProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

// Workflow View Props
export interface WorkflowViewProps {
  workflow: Workflow;
  selectedNodeId: string;
  viewMode: ViewMode;
  onNodeSelect: (nodeId: string) => void;
  onWorkflowUpdate: (workflow: Workflow) => void;
}

// Agent View Props
export interface AgentViewProps {
  agent: AgentSchema | null;
  formData: FormData;
  viewMode: ViewMode;
  onFormChange: (data: FormData) => void;
  availableAgents: AgentSchema[];
  onAgentSelect: (agentId: string) => void;
  conditions?: Condition[];
}

// Global Config View Props
export interface GlobalConfigViewProps {
  globalConfig: FormData;
  viewMode: ViewMode;
  onGlobalConfigChange: (config: FormData) => void;
}
