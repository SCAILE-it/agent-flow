// ABOUTME: React hook for workflow storage with auto-save
// ABOUTME: Provides seamless integration with localStorage

import { useEffect, useCallback, useRef } from 'react';
import { Workflow } from '../types';
import { saveWorkflow, loadWorkflow, loadAllWorkflows, deleteWorkflow } from '../storage/workflow-storage';

interface UseWorkflowStorageOptions {
  autoSave?: boolean;
  autoSaveDelay?: number;
}

export function useWorkflowStorage(
  workflow: Workflow | null,
  options: UseWorkflowStorageOptions = {}
) {
  const { autoSave = true, autoSaveDelay = 2000 } = options;
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save when workflow changes
  useEffect(() => {
    if (!autoSave || !workflow) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce save
    saveTimeoutRef.current = setTimeout(() => {
      try {
        saveWorkflow(workflow);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, autoSaveDelay);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [workflow, autoSave, autoSaveDelay]);

  // Manual save
  const save = useCallback((workflowToSave: Workflow) => {
    try {
      saveWorkflow(workflowToSave);
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      return false;
    }
  }, []);

  // Load workflow
  const load = useCallback((id: string): Workflow | null => {
    return loadWorkflow(id);
  }, []);

  // Load all workflows
  const loadAll = useCallback(() => {
    return loadAllWorkflows();
  }, []);

  // Delete workflow
  const remove = useCallback((id: string) => {
    try {
      deleteWorkflow(id);
      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      return false;
    }
  }, []);

  return {
    save,
    load,
    loadAll,
    remove,
  };
}
