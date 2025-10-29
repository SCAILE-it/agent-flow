// ABOUTME: Core workflow execution engine with pluggable agent executors
// ABOUTME: Orchestrates sequential node execution with real-time status updates

import { Workflow, WorkflowNode, FormData } from '../types';
import { AgentExecutor, ExecutionProgress, ExecutionResult } from './types';

export class WorkflowExecutor {
  private executors = new Map<string, AgentExecutor>();

  /**
   * Register an agent executor
   */
  registerExecutor(executor: AgentExecutor): void {
    this.executors.set(executor.id, executor);
  }

  /**
   * Execute entire workflow sequentially
   */
  async executeWorkflow(
    workflow: Workflow,
    onProgress: (progress: ExecutionProgress) => void
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const outputs: Record<string, FormData> = {};
    const errors: Record<string, string> = {};

    // Execute nodes sequentially
    for (const node of workflow.nodes) {
      const nodeStartTime = Date.now();

      // Emit pending status
      onProgress({
        nodeId: node.id,
        status: 'pending',
        startTime: nodeStartTime,
      });

      try {
        // Emit running status
        onProgress({
          nodeId: node.id,
          status: 'running',
          startTime: nodeStartTime,
        });

        // Execute node
        const output = await this.executeNode(node, outputs);
        outputs[node.id] = output;

        // Emit completed status
        onProgress({
          nodeId: node.id,
          status: 'completed',
          output,
          startTime: nodeStartTime,
          endTime: Date.now(),
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors[node.id] = errorMessage;

        // Emit failed status
        onProgress({
          nodeId: node.id,
          status: 'failed',
          error: errorMessage,
          startTime: nodeStartTime,
          endTime: Date.now(),
        });

        // Stop execution on failure
        break;
      }
    }

    const totalTime = Date.now() - startTime;

    return {
      success: Object.keys(errors).length === 0,
      outputs,
      errors,
      totalTime,
    };
  }

  /**
   * Execute a single node
   */
  private async executeNode(
    node: WorkflowNode,
    previousOutputs: Record<string, FormData>
  ): Promise<FormData> {
    const executor = this.executors.get(node.agentId);

    if (!executor) {
      throw new Error(`No executor registered for agent: ${node.agentId}`);
    }

    // Merge node form data with previous outputs
    const input: FormData = {
      ...node.formData,
      _previousOutputs: previousOutputs,
    };

    return executor.execute(input);
  }

  /**
   * Get registered executor count
   */
  getExecutorCount(): number {
    return this.executors.size;
  }

  /**
   * Check if executor is registered
   */
  hasExecutor(agentId: string): boolean {
    return this.executors.has(agentId);
  }
}
