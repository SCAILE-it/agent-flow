'use client';

import { useState, useMemo, useCallback } from 'react';
import { WorkflowView } from '@/components/workflow-view';
import { AgentView } from '@/components/agent-view';
import { gtmAgents } from '@/lib/schemas/gtm-agents';
import { Workflow, ViewMode, FormData, AgentSchema } from '@/lib/types';
import { updateNodeFormData } from '@/lib/workflow-utils';

export default function Home() {
  // SINGLE SOURCE OF TRUTH: All data lives in workflow state
  const [workflow, setWorkflow] = useState<Workflow>({
    id: 'gtm-workflow-1',
    name: 'GTM Content Pipeline',
    description: 'Research → Write → Optimize → Distribute',
    nodes: [
      {
        id: 'node-1',
        agentId: 'content-research',
        agentName: 'Content Research',
        status: 'configured',
        formData: {
          topic: 'AI in Marketing',
          depth: 'standard',
          includeStatistics: true,
        },
        lastModified: new Date().toISOString(),
      },
      {
        id: 'node-2',
        agentId: 'blog-writer',
        agentName: 'Blog Writer',
        status: 'configured',
        formData: {
          topic: 'How AI is Transforming Marketing',
          tone: 'professional',
          wordCount: 1500,
          keywords: ['AI', 'marketing', 'automation'],
        },
        lastModified: new Date().toISOString(),
      },
      {
        id: 'node-3',
        agentId: 'seo-optimizer',
        agentName: 'SEO Optimizer',
        status: 'pending',
      },
      {
        id: 'node-4',
        agentId: 'social-media',
        agentName: 'Social Media',
        status: 'pending',
      },
    ],
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-1');
  const [leftViewMode, setLeftViewMode] = useState<ViewMode>('ui');
  const [rightViewMode, setRightViewMode] = useState<ViewMode>('ui');

  // DERIVED STATE: Computed from single source of truth
  const selectedNode = useMemo(
    () => workflow.nodes.find((n) => n.id === selectedNodeId),
    [workflow.nodes, selectedNodeId]
  );

  const selectedAgent = useMemo<AgentSchema | null>(
    () => gtmAgents.find((a) => a.id === selectedNode?.agentId) || null,
    [selectedNode?.agentId]
  );

  const formData = useMemo<FormData>(
    () => selectedNode?.formData || ({} as FormData),
    [selectedNode?.formData]
  );

  // PURE UPDATE FUNCTION: Updates workflow state using utility function
  const handleFormChange = useCallback(
    (newFormData: FormData) => {
      setWorkflow((prev) => updateNodeFormData(prev, selectedNodeId, newFormData));
    },
    [selectedNodeId]
  );

  // Handle agent selection from dropdown
  const handleAgentSelect = useCallback(
    (agentId: string) => {
      const agent = gtmAgents.find((a) => a.id === agentId);
      if (!agent) return;

      // Find or create a node for this agent
      const existingNode = workflow.nodes.find((n) => n.agentId === agentId);

      if (existingNode) {
        // Select existing node
        setSelectedNodeId(existingNode.id);
      } else {
        // This is for demo - in production, you'd add node to workflow
        // For now, just select first node that matches
        const firstMatch = workflow.nodes[0];
        if (firstMatch) {
          setSelectedNodeId(firstMatch.id);
        }
      }
    },
    [workflow.nodes]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-3">Agent Flow Builder</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Configure GTM agents with JSON Schema forms and visualize workflow execution.
            Toggle between UI and JSON views to see the data flow.
          </p>
        </div>

        {/* Main Grid: Workflow (Left) + Agent Config (Right) */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Panel: Workflow Visualization */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-h-[600px]">
            <WorkflowView
              workflow={workflow}
              selectedNodeId={selectedNodeId}
              viewMode={leftViewMode}
              onViewModeChange={setLeftViewMode}
              onNodeSelect={setSelectedNodeId}
              onWorkflowUpdate={setWorkflow}
            />
          </div>

          {/* Right Panel: Agent Configuration */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-h-[600px]">
            <AgentView
              agent={selectedAgent}
              formData={formData}
              viewMode={rightViewMode}
              onViewModeChange={setRightViewMode}
              onFormChange={handleFormChange}
              availableAgents={gtmAgents}
              onAgentSelect={handleAgentSelect}
            />
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-12 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">How to Use</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong>1. Click Workflow Nodes:</strong> Select any agent in the workflow to
              configure its parameters in the right panel.
            </p>
            <p>
              <strong>2. Fill Forms (UI Mode):</strong> Use the generated forms to configure
              agents. Changes auto-save to the workflow.
            </p>
            <p>
              <strong>3. View JSON:</strong> Toggle to JSON mode to see the data structure.
              Changes sync between UI and JSON views.
            </p>
            <p>
              <strong>4. Edit JSON (Work Tab):</strong> Directly edit form data in JSON format.
              Changes update the UI form instantly.
            </p>
            <p>
              <strong>5. Export Workflow:</strong> In JSON mode, view and copy the complete
              workflow with all configurations.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 max-w-4xl mx-auto grid md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="font-bold mb-2">🎨 shadcn/ui Forms</h3>
            <p className="text-sm text-muted-foreground">
              Beautiful forms from JSON Schema
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="font-bold mb-2">📊 Workflow Viz</h3>
            <p className="text-sm text-muted-foreground">
              Visual timeline with status
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="font-bold mb-2">🔄 Bidirectional Sync</h3>
            <p className="text-sm text-muted-foreground">
              UI ↔ JSON live updates
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="font-bold mb-2">🚀 GTM Focused</h3>
            <p className="text-sm text-muted-foreground">
              Pre-built marketing agents
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
