'use client';

// ABOUTME: Agent configuration component with UI/JSON toggle
// ABOUTME: Displays form UI or JSON editor based on view mode

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { JsonEditor } from './json-editor';
import { AgentViewProps, JsonTab, FormData } from '@/lib/types';

// Dynamically import AgentForm to avoid SSR issues
const AgentForm = dynamic(
  () => import('./agent-form').then((mod) => ({ default: mod.AgentForm })),
  {
    ssr: false,
    loading: () => (
      <div className="p-6 text-center text-muted-foreground">Loading form...</div>
    ),
  }
);

export function AgentView({
  agent,
  formData,
  viewMode,
  onFormChange,
  availableAgents,
  onAgentSelect,
}: AgentViewProps) {
  const [activeTab, setActiveTab] = useState<JsonTab>('input');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!agent) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        <p>Select an agent to configure</p>
      </div>
    );
  }

  const handleFormDataJsonChange = (value: unknown) => {
    try {
      const newFormData = value as FormData;
      setValidationError(null);
      onFormChange(newFormData);
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Invalid form data';
      setValidationError(error);
    }
  };

  // Agent schema (input definition)
  const agentSchema = {
    schema: agent.schema,
    uiSchema: agent.uiSchema,
    config: agent.config,
  };

  const tabClass = (tab: JsonTab) =>
    `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      activeTab === tab
        ? 'border-primary text-foreground'
        : 'border-transparent text-muted-foreground hover:text-foreground'
    }`;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Agent Selector */}
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Agent</label>
          <select
            className="w-full p-2 border rounded-md bg-background"
            value={agent.id}
            onChange={(e) => onAgentSelect(e.target.value)}
          >
            {availableAgents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'ui' ? (
          <AgentForm
            schema={agent}
            formData={formData}
            onChange={onFormChange}
            onSubmit={onFormChange}
          />
        ) : (
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('input')}
                className={tabClass('input')}
                type="button"
              >
                Input (Schema)
              </button>
              <button
                onClick={() => setActiveTab('work')}
                className={tabClass('work')}
                type="button"
              >
                Work (Data)
              </button>
            </div>

            {/* Validation Error */}
            {validationError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-300">
                {validationError}
              </div>
            )}

            {/* JSON Editors */}
            {activeTab === 'input' ? (
              <JsonEditor
                value={agentSchema}
                onChange={() => {
                  // Schema editing could be implemented here if allowSchemaEdit is true
                  // For now, keeping it read-only
                }}
                readOnly={!agent.config?.allowSchemaEdit}
                title="Agent Schema Definition"
                onValidationError={setValidationError}
              />
            ) : (
              <JsonEditor
                value={formData}
                onChange={handleFormDataJsonChange}
                readOnly={!agent.config?.allowDataEdit}
                title="Form Data"
                onValidationError={setValidationError}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
