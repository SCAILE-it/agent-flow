// ABOUTME: React hook for workflow execution with real-time status updates
// ABOUTME: Manages execution state and orchestrates agent executors

import { useState, useCallback, useRef, useEffect } from 'react';
import { Workflow, WorkflowNode } from '../types';
import { WorkflowExecutor } from '../execution/workflow-executor';
import { geminiExecutors } from '../execution/gemini-executors';
import { mockExecutors } from '../execution/mock-executors';
import { ExecutionProgress, ExecutionResult } from '../execution/types';
import { isGeminiAvailable } from '../execution/gemini-client';

interface NodeStatus {
  status: WorkflowNode['status'];
  startTime?: number;
  endTime?: number;
  error?: string;
}

interface UseWorkflowExecutionReturn {
  nodeStatuses: Record<string, NodeStatus>;
  isExecuting: boolean;
  result: ExecutionResult | null;
  error: string | null;
  executeWorkflow: () => Promise<void>;
  resetExecution: () => void;
}

export function useWorkflowExecution(
  workflow: Workflow | null,
  onStatusUpdate?: (nodeId: string, status: WorkflowNode['status']) => void
): UseWorkflowExecutionReturn {
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeStatus>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executorRef = useRef<WorkflowExecutor | null>(null);

  // Initialize executor and register executors (Gemini or mock)
  useEffect(() => {
    const executor = new WorkflowExecutor();
    const executorsToUse = isGeminiAvailable() ? geminiExecutors : mockExecutors;

    executorsToUse.forEach((agentExecutor) => {
      executor.registerExecutor(agentExecutor);
    });

    executorRef.current = executor;

    // Log which mode we're in
    if (typeof window !== 'undefined') {
      console.log(`🤖 Agent execution mode: ${isGeminiAvailable() ? 'Gemini AI' : 'Mock (Demo)'}`);
    }
  }, []);

  // Handle progress updates
  const handleProgress = useCallback((progress: ExecutionProgress) => {
    setNodeStatuses((prev) => ({
      ...prev,
      [progress.nodeId]: {
        status: progress.status,
        startTime: progress.startTime,
        endTime: progress.endTime,
        error: progress.error,
      },
    }));

    // Call optional callback for UI updates
    onStatusUpdate?.(progress.nodeId, progress.status);
  }, [onStatusUpdate]);

  // Execute workflow
  const executeWorkflow = useCallback(async () => {
    if (!workflow || !executorRef.current) {
      setError('No workflow or executor available');
      return;
    }

    // Reset state
    setNodeStatuses({});
    setIsExecuting(true);
    setError(null);
    setResult(null);

    try {
      const executionResult = await executorRef.current.executeWorkflow(
        workflow,
        handleProgress
      );

      setResult(executionResult);

      if (!executionResult.success) {
        setError(Object.values(executionResult.errors).join(', '));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown execution error';
      setError(errorMessage);
    } finally {
      setIsExecuting(false);
    }
  }, [workflow, handleProgress]);

  // Reset execution state
  const resetExecution = useCallback(() => {
    setNodeStatuses({});
    setIsExecuting(false);
    setResult(null);
    setError(null);
  }, []);

  return {
    nodeStatuses,
    isExecuting,
    result,
    error,
    executeWorkflow,
    resetExecution,
  };
}
