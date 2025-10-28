'use client';

import { useState } from 'react';
import { AgentForm } from '@/components/agent-form';
import { WorkflowTimeline } from '@/components/workflow-timeline';
import { gtmAgents } from '@/lib/schemas/gtm-agents';
import { Workflow, WorkflowNode, AgentSchema } from '@/lib/types';

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<AgentSchema>(gtmAgents[0]);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Sample workflow demonstrating a GTM content pipeline
  const [workflow] = useState<Workflow>({
    id: 'gtm-workflow-1',
    name: 'GTM Content Pipeline',
    description: 'Research → Write → Optimize → Distribute',
    nodes: [
      {
        id: 'node-1',
        agentId: 'content-research',
        agentName: 'Content Research',
        status: 'completed',
        formData: {
          topic: 'AI in Marketing',
          depth: 'standard',
          includeStatistics: true,
        },
      },
      {
        id: 'node-2',
        agentId: 'blog-writer',
        agentName: 'Blog Writer',
        status: 'running',
        formData: {
          topic: 'How AI is Transforming Marketing',
          tone: 'professional',
          wordCount: 1500,
        },
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

  const handleNodeClick = (node: WorkflowNode) => {
    const agent = gtmAgents.find((a) => a.id === node.agentId);
    if (agent) {
      setSelectedAgent(agent);
      setFormData(node.formData || {});
    }
  };

  const handleFormChange = (data: Record<string, any>) => {
    setFormData(data);
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    console.log('Form submitted:', data);
    alert('Form data saved! Check console for details.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-12 px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-3">Agent Flow Builder</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Configure GTM agents with JSON Schema forms and visualize workflow execution
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column: Workflow Visualization */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <WorkflowTimeline workflow={workflow} onNodeClick={handleNodeClick} />
          </div>

          {/* Right Column: Agent Configuration Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Agent</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedAgent.id}
                onChange={(e) => {
                  const agent = gtmAgents.find((a) => a.id === e.target.value);
                  if (agent) {
                    setSelectedAgent(agent);
                    setFormData({});
                  }
                }}
              >
                {gtmAgents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>

            <AgentForm
              schema={selectedAgent}
              formData={formData}
              onChange={handleFormChange}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-12 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">How to Use</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong>1. View Workflow:</strong> See the GTM content pipeline on the left with
              status indicators for each agent.
            </p>
            <p>
              <strong>2. Configure Agents:</strong> Click on any node in the workflow or select
              an agent from the dropdown to configure its parameters.
            </p>
            <p>
              <strong>3. Fill Forms:</strong> Each agent has a JSON Schema-based form with
              validation. All forms use shadcn/ui components.
            </p>
            <p>
              <strong>4. Submit:</strong> Save your configuration. In a real implementation,
              this would trigger the agent with the provided parameters.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="font-bold mb-2">🎨 shadcn/ui Forms</h3>
            <p className="text-sm text-muted-foreground">
              Beautiful, accessible forms generated from JSON Schema using @rjsf/shadcn
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="font-bold mb-2">📊 Workflow Viz</h3>
            <p className="text-sm text-muted-foreground">
              Simple, clean workflow visualization with status indicators
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="font-bold mb-2">🚀 GTM Focused</h3>
            <p className="text-sm text-muted-foreground">
              Pre-built agents for content research, blog writing, SEO, and social media
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
