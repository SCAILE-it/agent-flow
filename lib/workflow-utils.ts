// ABOUTME: Pure utility functions for workflow state management
// ABOUTME: Follows functional programming principles - all functions are pure and testable

import { Workflow, WorkflowNode, FormData, NodeStatus } from './types';

/**
 * Updates form data for a specific node in the workflow
 * Pure function - returns new workflow object without mutation
 */
export function updateNodeFormData(
  workflow: Workflow,
  nodeId: string,
  formData: FormData
): Workflow {
  return {
    ...workflow,
    nodes: workflow.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            formData,
            status: 'configured' as NodeStatus,
            lastModified: new Date().toISOString(),
          }
        : node
    ),
  };
}

/**
 * Updates the status of a workflow node
 * Pure function
 */
export function updateNodeStatus(
  workflow: Workflow,
  nodeId: string,
  status: NodeStatus
): Workflow {
  return {
    ...workflow,
    nodes: workflow.nodes.map((node) =>
      node.id === nodeId
        ? { ...node, status, lastModified: new Date().toISOString() }
        : node
    ),
  };
}

/**
 * Finds a node by ID (helper function)
 */
export function findNodeById(
  workflow: Workflow,
  nodeId: string
): WorkflowNode | undefined {
  return workflow.nodes.find((node) => node.id === nodeId);
}

/**
 * Checks if a node has configuration
 */
export function isNodeConfigured(node: WorkflowNode): boolean {
  return (
    node.formData !== undefined &&
    node.formData !== null &&
    Object.keys(node.formData).length > 0
  );
}

/**
 * Validates workflow structure
 */
export function validateWorkflow(workflow: Workflow): string[] {
  const errors: string[] = [];

  if (!workflow.id) {
    errors.push('Workflow must have an ID');
  }

  if (!workflow.name) {
    errors.push('Workflow must have a name');
  }

  if (!workflow.nodes || workflow.nodes.length === 0) {
    errors.push('Workflow must have at least one node');
  }

  workflow.nodes.forEach((node, index) => {
    if (!node.id) {
      errors.push(`Node at index ${index} is missing an ID`);
    }
    if (!node.agentId) {
      errors.push(`Node ${node.id || index} is missing agentId`);
    }
  });

  return errors;
}

/**
 * Counts configured nodes in workflow
 */
export function getConfiguredNodesCount(workflow: Workflow): number {
  return workflow.nodes.filter(isNodeConfigured).length;
}

/**
 * Gets workflow completion percentage
 */
export function getWorkflowCompletionPercentage(workflow: Workflow): number {
  if (workflow.nodes.length === 0) return 0;
  const configured = getConfiguredNodesCount(workflow);
  return Math.round((configured / workflow.nodes.length) * 100);
}
