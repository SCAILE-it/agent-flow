// ABOUTME: Pure utility functions for workflow state management
// ABOUTME: Follows functional programming principles - all functions are pure and testable

import { Workflow, FormData, NodeStatus } from './types';

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
