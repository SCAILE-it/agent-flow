'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { WorkflowView } from '@/components/workflow-view';
import { AgentView } from '@/components/agent-view';
import { GlobalConfigView } from '@/components/global-config-view';
import { PanelContainer } from '@/components/layout/panel-container';
import { ViewToggle } from '@/components/view-toggle';
import { gtmAgents } from '@/lib/schemas/gtm-agents';
import { Workflow, ViewMode, FormData, AgentSchema } from '@/lib/types';
import { updateNodeFormData, mergeGlobalWithNodeData } from '@/lib/workflow-utils';
import { useWorkflowStorage } from '@/lib/hooks/useWorkflowStorage';
import { useWorkflowExecution } from '@/lib/hooks/useWorkflowExecution';

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
        conditions: [
          {
            field: 'tone',
            operator: 'equals',
            value: 'casual',
            action: {
              type: 'showFields',
              fields: ['includeEmojis'],
            },
          },
        ],
        requiresApproval: true,
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

  // Storage hook with auto-save
  const storage = useWorkflowStorage(workflow, { autoSave: true, autoSaveDelay: 2000 });

  // Execution hook with real-time status updates
  const { isExecuting, executeWorkflow: runWorkflow, error: executionError } = useWorkflowExecution(
    workflow,
    (nodeId, status) => {
      // Update node status in real-time during execution
      setWorkflow((prev) => ({
        ...prev,
        nodes: prev.nodes.map((node) =>
          node.id === nodeId ? { ...node, status } : node
        ),
      }));
    }
  );

  // Load all workflows for sidebar (no memoization - loadAll() is fast and keeps list fresh)
  const loaded = storage.loadAll();
  const allWorkflows: Array<{ id: string; name: string; status: 'active' | 'draft'; lastModified?: string }> = loaded.map((w) => ({
    id: w.id,
    name: w.name,
    status: (workflow.id === w.id ? 'active' : 'draft') as 'active' | 'draft',
    lastModified: w.lastModified,
  }));

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

  // Last saved state
  const [lastSaved, setLastSaved] = useState<string>('auto-saved');

  // Action handlers
  const handleSave = useCallback(() => {
    storage.save(workflow);
    setLastSaved('just now');
  }, [workflow, storage]);

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflow.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [workflow]);

  const handleNewWorkflow = useCallback(() => {
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: 'Untitled workflow',
      globalConfig: {},
      nodes: [],
    };
    setWorkflow(newWorkflow);
    storage.save(newWorkflow);
  }, [storage]);

  const handleWorkflowSelect = useCallback((id: string) => {
    const loaded = storage.load(id);
    if (loaded) {
      setWorkflow(loaded);
      setSelectedNodeId(loaded.nodes[0]?.id || '');
    }
  }, [storage]);

  const handleRun = useCallback(async () => {
    if (isExecuting) return;
    await runWorkflow();
  }, [isExecuting, runWorkflow]);

  // Display execution error if any
  useEffect(() => {
    if (executionError) {
      console.error('Workflow execution error:', executionError);
    }
  }, [executionError]);

  return (
    <AppShell
      workflows={allWorkflows}
      currentWorkflowId={workflow.id}
      workflowName={workflow.name}
      selectedAgent={selectedAgent?.name}
      validationStatus="valid"
      lastSaved={lastSaved}
      onWorkflowSelect={handleWorkflowSelect}
      onNewWorkflow={handleNewWorkflow}
      onSave={handleSave}
      onExport={handleExport}
      onRun={handleRun}
      globalConfig={
        <PanelContainer
          title="Global Configuration"
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
      }
      agentPanel={
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
            conditions={selectedNode?.conditions}
          />
        </PanelContainer>
      }
      workflowPanel={
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
      }
    />
  );
}
