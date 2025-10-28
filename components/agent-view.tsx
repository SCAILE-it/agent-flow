'use client';

// ABOUTME: Agent configuration component with UI/JSON toggle
// ABOUTME: Displays form UI or JSON editor based on view mode

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { JsonEditor } from './json-editor';
import { AgentViewProps, FormData } from '@/lib/types';
import { getHiddenFields } from '@/lib/workflow-utils';
import { filterSchemaFields } from '@/lib/schema-utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';

// Dynamically import AgentForm to avoid SSR issues
const AgentForm = dynamic(
  () => import('./agent-form').then((mod) => ({ default: mod.AgentForm })),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
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
  conditions,
}: AgentViewProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  // Evaluate conditions to determine which fields should be hidden
  const hiddenFields = useMemo(() => {
    return getHiddenFields(conditions, formData);
  }, [conditions, formData]);

  // Filter agent schema to exclude hidden fields
  const filteredAgent = useMemo(() => {
    if (!agent) return null;
    return filterSchemaFields(agent, hiddenFields);
  }, [agent, hiddenFields]);

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

  // Agent schema (input definition) - uses filtered schema if conditions exist
  const agentSchema = {
    schema: filteredAgent?.schema || agent.schema,
    uiSchema: filteredAgent?.uiSchema || agent.uiSchema,
    config: filteredAgent?.config || agent.config,
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Agent Selector */}
      <div className="space-y-2 mb-6">
        <Label htmlFor="agent-select">Select Agent</Label>
        <Select value={agent.id} onValueChange={onAgentSelect}>
          <SelectTrigger id="agent-select">
            <SelectValue placeholder="Select an agent" />
          </SelectTrigger>
          <SelectContent>
            {availableAgents.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {viewMode === 'ui' ? (
          <AgentForm
            schema={filteredAgent || agent}
            formData={formData}
            onChange={onFormChange}
            onSubmit={onFormChange}
          />
        ) : (
          <div className="space-y-4">
            {/* Validation Error */}
            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            {/* Tabs */}
            <Tabs defaultValue="input">
              <TabsList>
                <TabsTrigger value="input">Input (Schema)</TabsTrigger>
                <TabsTrigger value="work">Work (Data)</TabsTrigger>
              </TabsList>
              <TabsContent value="input" className="mt-4">
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
              </TabsContent>
              <TabsContent value="work" className="mt-4">
                <JsonEditor
                  value={formData}
                  onChange={handleFormDataJsonChange}
                  readOnly={!agent.config?.allowDataEdit}
                  title="Form Data"
                  onValidationError={setValidationError}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
