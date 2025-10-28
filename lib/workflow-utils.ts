// ABOUTME: Pure utility functions for workflow state management
// ABOUTME: Follows functional programming principles - all functions are pure and testable

import { Workflow, FormData, NodeStatus, AgentSchema, FormDataValue, Condition } from './types';

/**
 * Global config field mappings
 * Maps agent schema field names to global config nested paths
 *
 * When adding new global fields, update this mapping to enable cascade
 */
const GLOBAL_FIELD_MAPPINGS: Record<string, string[]> = {
  tone: ['brandVoice', 'tone'],
  keywords: ['seoStrategy', 'primaryKeywords'],
  targetAudience: ['targetAudience'],
  products: ['products'],
} as const;

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

/**
 * Merges global configuration with node-level form data
 * Pure function - implements hybrid cascade logic
 *
 * Logic:
 * - Array fields: Concatenate global + node values (dedupe)
 * - Primitive fields: Node value takes precedence, else use global as default
 * - Nested objects: Recursively merge
 *
 * @param globalConfig - Global workflow configuration
 * @param nodeFormData - Node-specific form data
 * @param agentSchema - Agent schema to determine field types
 * @returns Merged form data with global values cascaded appropriately
 */
export function mergeGlobalWithNodeData(
  globalConfig: FormData | undefined,
  nodeFormData: FormData | undefined,
  agentSchema: AgentSchema
): FormData {
  // If no global config, return node data as-is
  if (!globalConfig || Object.keys(globalConfig).length === 0) {
    return nodeFormData || {};
  }

  // If no node data, return empty object (don't use global directly)
  if (!nodeFormData) {
    return {};
  }

  const merged: FormData = { ...nodeFormData };
  const schemaProps = agentSchema.schema.properties || {};

  // Iterate through agent schema properties
  Object.keys(schemaProps).forEach((fieldName) => {
    const fieldSchema = schemaProps[fieldName];
    const globalValue = getGlobalValueForField(globalConfig, fieldName);
    const nodeValue = nodeFormData[fieldName];

    // Skip if no global value for this field
    if (globalValue === undefined || globalValue === null) {
      return;
    }

    // Determine how to merge based on field type
    if (typeof fieldSchema === 'object' && 'type' in fieldSchema) {
      if (fieldSchema.type === 'array') {
        // Array fields: Concatenate and dedupe
        merged[fieldName] = mergeArrayFields(globalValue, nodeValue);
      } else {
        // Primitive fields: Node overrides, else use global
        if (nodeValue === undefined || nodeValue === null || nodeValue === '') {
          merged[fieldName] = globalValue;
        }
        // else: keep node value (already in merged)
      }
    }
  });

  return merged;
}

/**
 * Helper: Get global value for a specific field
 * Handles nested global config structure using GLOBAL_FIELD_MAPPINGS
 */
function getGlobalValueForField(
  globalConfig: FormData,
  fieldName: string
): FormDataValue | undefined {
  // Direct field match (for flat fields)
  if (globalConfig[fieldName] !== undefined) {
    return globalConfig[fieldName];
  }

  // Check nested structures using mappings (e.g., tone → brandVoice.tone)
  if (GLOBAL_FIELD_MAPPINGS[fieldName]) {
    const path = GLOBAL_FIELD_MAPPINGS[fieldName];
    let value: FormDataValue | undefined = globalConfig;

    // Traverse nested path
    for (const key of path) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        value = (value as Record<string, FormDataValue>)[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  return undefined;
}

/**
 * Helper: Merge array fields (concatenate + dedupe)
 */
function mergeArrayFields(
  globalValue: FormDataValue | undefined,
  nodeValue: FormDataValue | undefined
): FormDataValue {
  const globalArray = Array.isArray(globalValue) ? globalValue : [];
  const nodeArray = Array.isArray(nodeValue) ? nodeValue : [];

  // Concatenate and dedupe (for primitive arrays like string[])
  const combined = [...globalArray, ...nodeArray];

  // Dedupe based on JSON stringification (handles objects and primitives)
  const seen = new Set<string>();
  return combined.filter((item) => {
    const key = typeof item === 'object' ? JSON.stringify(item) : String(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Evaluates a single condition against form data
 * Pure function - implements equality and existence checks
 *
 * Supports:
 * - equals: field === value
 * - notEquals: field !== value
 * - exists: field has non-empty value
 * - notExists: field is empty/undefined/null
 *
 * @param condition - Condition to evaluate
 * @param formData - Current form data
 * @returns true if condition is met, false otherwise
 */
export function evaluateCondition(
  condition: Condition,
  formData: FormData
): boolean {
  const fieldValue = formData[condition.field];

  switch (condition.operator) {
    case 'equals':
      return fieldValue === condition.value;
    case 'notEquals':
      return fieldValue !== condition.value;
    case 'exists':
      return (
        fieldValue !== undefined &&
        fieldValue !== null &&
        fieldValue !== ''
      );
    case 'notExists':
      return (
        fieldValue === undefined ||
        fieldValue === null ||
        fieldValue === ''
      );
    default:
      return false;
  }
}

/**
 * Evaluates all conditions and returns set of fields to hide
 * Pure function - returns new Set, no mutations
 *
 * Logic:
 * - hideFields action: If condition met, hide those fields
 * - showFields action: If condition NOT met, hide those fields
 *
 * @param conditions - Array of conditions to evaluate
 * @param formData - Current form data
 * @returns Set of field names to hide from the form
 */
export function getHiddenFields(
  conditions: Condition[] | undefined,
  formData: FormData
): Set<string> {
  if (!conditions || conditions.length === 0) {
    return new Set();
  }

  const hiddenFields = new Set<string>();

  conditions.forEach((condition) => {
    const conditionMet = evaluateCondition(condition, formData);

    if (condition.action.type === 'hideFields') {
      // If condition is met, hide these fields
      if (conditionMet) {
        condition.action.fields.forEach((field) => hiddenFields.add(field));
      }
    } else if (condition.action.type === 'showFields') {
      // If condition is NOT met, hide these fields (they should only show when condition is true)
      if (!conditionMet) {
        condition.action.fields.forEach((field) => hiddenFields.add(field));
      }
    }
  });

  return hiddenFields;
}
