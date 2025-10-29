// ABOUTME: Type definitions for the workflow execution engine
// ABOUTME: Defines interfaces for pluggable agent executors

import { FormData } from '../types';

/**
 * Agent executor interface
 * Implement this to create custom agent execution logic
 */
export interface AgentExecutor {
  /** Unique agent ID (must match AgentSchema.id) */
  id: string;

  /** Agent name for display */
  name: string;

  /**
   * Execute the agent with given input
   * @param input - Form data from the agent configuration
   * @returns Output form data to pass to next agent
   */
  execute(input: FormData): Promise<FormData>;
}

/**
 * Execution progress callback
 */
export interface ExecutionProgress {
  nodeId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: FormData;
  error?: string;
  startTime?: number;
  endTime?: number;
}

/**
 * Execution result
 */
export interface ExecutionResult {
  success: boolean;
  outputs: Record<string, FormData>;
  errors: Record<string, string>;
  totalTime: number;
}
