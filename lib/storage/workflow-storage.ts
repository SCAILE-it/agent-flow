// ABOUTME: LocalStorage utility for persisting workflows client-side
// ABOUTME: Provides CRUD operations with validation and error handling

import { Workflow } from '../types';

const STORAGE_KEY = 'agent-flow-workflows';
const STORAGE_VERSION = '1.0';

interface StorageData {
  version: string;
  workflows: Record<string, Workflow>;
  lastModified: Record<string, string>;
}

/**
 * Initialize storage with empty state if not exists
 */
function initializeStorage(): void {
  if (typeof window === 'undefined') return;

  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const initialData: StorageData = {
      version: STORAGE_VERSION,
      workflows: {},
      lastModified: {},
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }
}

/**
 * Get all storage data
 */
function getStorageData(): StorageData {
  if (typeof window === 'undefined') {
    return { version: STORAGE_VERSION, workflows: {}, lastModified: {} };
  }

  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { version: STORAGE_VERSION, workflows: {}, lastModified: {} };
}

/**
 * Set storage data
 */
function setStorageData(data: StorageData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Save workflow to localStorage
 */
export function saveWorkflow(workflow: Workflow): void {
  try {
    const data = getStorageData();
    data.workflows[workflow.id] = workflow;
    data.lastModified[workflow.id] = new Date().toISOString();
    setStorageData(data);
  } catch (error) {
    console.error('Failed to save workflow:', error);
    throw new Error('Failed to save workflow to storage');
  }
}

/**
 * Load workflow by ID
 */
export function loadWorkflow(id: string): Workflow | null {
  try {
    const data = getStorageData();
    return data.workflows[id] || null;
  } catch (error) {
    console.error('Failed to load workflow:', error);
    return null;
  }
}

/**
 * Load all workflows
 */
export function loadAllWorkflows(): Array<Workflow & { lastModified?: string }> {
  try {
    const data = getStorageData();
    return Object.values(data.workflows).map((workflow) => ({
      ...workflow,
      lastModified: data.lastModified[workflow.id],
    }));
  } catch (error) {
    console.error('Failed to load workflows:', error);
    return [];
  }
}

/**
 * Delete workflow by ID
 */
export function deleteWorkflow(id: string): void {
  try {
    const data = getStorageData();
    delete data.workflows[id];
    delete data.lastModified[id];
    setStorageData(data);
  } catch (error) {
    console.error('Failed to delete workflow:', error);
    throw new Error('Failed to delete workflow from storage');
  }
}

/**
 * Export workflow as JSON string
 */
export function exportWorkflow(id: string): string {
  const workflow = loadWorkflow(id);
  if (!workflow) {
    throw new Error(`Workflow ${id} not found`);
  }
  return JSON.stringify(workflow, null, 2);
}

/**
 * Import workflow from JSON string
 */
export function importWorkflow(json: string): Workflow {
  try {
    const workflow = JSON.parse(json) as Workflow;

    // Basic validation
    if (!workflow.id || !workflow.name || !workflow.nodes) {
      throw new Error('Invalid workflow structure');
    }

    // Save imported workflow
    saveWorkflow(workflow);

    return workflow;
  } catch (error) {
    console.error('Failed to import workflow:', error);
    throw new Error('Invalid workflow JSON');
  }
}

/**
 * Clear all workflows (for testing/reset)
 */
export function clearAllWorkflows(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
