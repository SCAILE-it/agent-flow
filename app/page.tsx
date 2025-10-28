'use client';

import { useState, useMemo, useCallback } from 'react';
import { WorkflowView } from '@/components/workflow-view';
import { AgentView } from '@/components/agent-view';
import { GlobalConfigView } from '@/components/global-config-view';
import { PanelContainer } from '@/components/layout/panel-container';
import { ViewToggle } from '@/components/view-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { gtmAgents } from '@/lib/schemas/gtm-agents';
import { Workflow, ViewMode, FormData, AgentSchema } from '@/lib/types';
import { updateNodeFormData, mergeGlobalWithNodeData } from '@/lib/workflow-utils';

export default function Home() {
  // SINGLE SOURCE OF TRUTH: All data lives in workflow state
  const [workflow, setWorkflow] = useState<Workflow>({
    id: 'gtm-workflow-1',
    name: 'GTM Content Pipeline',
    description: 'Research → Write → Optimize → Distribute',
    globalConfig: {
      brandVoice: {
        tone: 'professional',
        guidelines: 'Use active voice, keep sentences concise, avoid jargon',
        personality: 'Innovative, data-driven, approachable',
      },
      seoStrategy: {
        primaryKeywords: ['AI', 'marketing automation', 'digital transformation'],
        secondaryKeywords: ['content marketing', 'lead generation', 'B2B SaaS'],
      },
    },
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
        lastModified: '2025-10-28T00:00:00.000Z',
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
        lastModified: '2025-10-28T00:00:00.000Z',
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
  const [configViewMode, setConfigViewMode] = useState<ViewMode>('ui');
  const [workflowViewMode, setWorkflowViewMode] = useState<ViewMode>('ui');
  const [globalConfigViewMode, setGlobalConfigViewMode] = useState<ViewMode>('ui');

  // DERIVED STATE: Computed from single source of truth
  const selectedNode = useMemo(
    () => workflow.nodes.find((n) => n.id === selectedNodeId),
    [workflow.nodes, selectedNodeId]
  );

  const selectedAgent = useMemo<AgentSchema | null>(
    () => gtmAgents.find((a) => a.id === selectedNode?.agentId) || null,
    [selectedNode?.agentId]
  );

  // Merged form data: Global config cascades to node-level data
  const formData = useMemo<FormData>(() => {
    if (!selectedAgent) return {};
    return mergeGlobalWithNodeData(
      workflow.globalConfig,
      selectedNode?.formData,
      selectedAgent
    );
  }, [workflow.globalConfig, selectedNode?.formData, selectedAgent]);

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

  // Handle global config changes
  const handleGlobalConfigChange = useCallback((newGlobalConfig: FormData) => {
    setWorkflow((prev) => ({
      ...prev,
      globalConfig: newGlobalConfig,
    }));
  }, []);

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

        {/* Global Configuration Panel */}
        <PanelContainer
          title="Global Configuration"
          className="mb-8 max-w-7xl mx-auto"
          headerAction={
            <ViewToggle
              mode={globalConfigViewMode}
              onModeChange={setGlobalConfigViewMode}
            />
          }
        >
          <GlobalConfigView
            globalConfig={workflow.globalConfig || {}}
            viewMode={globalConfigViewMode}
            onGlobalConfigChange={handleGlobalConfigChange}
          />
        </PanelContainer>

        {/* Main Grid: Agent Config (Left) + Workflow (Right) */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Panel: Agent Configuration */}
          <PanelContainer
            title="Agent Configuration"
            headerAction={
              <ViewToggle mode={configViewMode} onModeChange={setConfigViewMode} />
            }
          >
            <AgentView
              agent={selectedAgent}
              formData={formData}
              viewMode={configViewMode}
              onFormChange={handleFormChange}
              availableAgents={gtmAgents}
              onAgentSelect={handleAgentSelect}
            />
          </PanelContainer>

          {/* Right Panel: Workflow Visualization */}
          <PanelContainer
            title="Workflow"
            headerAction={
              <ViewToggle mode={workflowViewMode} onModeChange={setWorkflowViewMode} />
            }
          >
            <WorkflowView
              workflow={workflow}
              selectedNodeId={selectedNodeId}
              viewMode={workflowViewMode}
              onNodeSelect={setSelectedNodeId}
              onWorkflowUpdate={setWorkflow}
            />
          </PanelContainer>
        </div>

        {/* Usage Instructions */}
        <PanelContainer
          title="How to Use"
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong>1. Configure Agents:</strong> Select any agent in the left panel to
              configure its parameters using the auto-generated form.
            </p>
            <p>
              <strong>2. View Workflow:</strong> The right panel shows your workflow timeline
              with all configured agents in sequence.
            </p>
            <p>
              <strong>3. Toggle Views:</strong> Switch between UI and JSON modes to see the
              data structure. Changes sync bidirectionally.
            </p>
            <p>
              <strong>4. Edit JSON Directly:</strong> In JSON mode, use the Work tab to edit
              form data directly. Changes update the UI form instantly.
            </p>
            <p>
              <strong>5. Export Workflow:</strong> Copy the complete workflow JSON with all
              configurations from JSON mode.
            </p>
          </div>
        </PanelContainer>

        {/* Features */}
        <div className="mt-8 max-w-4xl mx-auto grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">🎨 shadcn/ui Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Beautiful forms from JSON Schema
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">📊 Workflow Viz</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visual timeline with status
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">🔄 Bidirectional Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                UI ↔ JSON live updates
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">🚀 GTM Focused</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pre-built marketing agents
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
