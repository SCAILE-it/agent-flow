'use client';

// ABOUTME: Workflow visualization component with UI/JSON toggle
// ABOUTME: Handles both visual timeline and JSON editing of workflow structure

import { useState } from 'react';
import { WorkflowTimeline } from './workflow-timeline';
import { JsonEditor } from './json-editor';
import { WorkflowViewProps, Workflow } from '@/lib/types';
import { validateWorkflow } from '@/lib/workflow-utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';

export function WorkflowView({
  workflow,
  selectedNodeId,
  viewMode,
  onNodeSelect,
  onWorkflowUpdate,
}: WorkflowViewProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleWorkflowJsonChange = (value: unknown) => {
    try {
      const newWorkflow = value as Workflow;

      // Validate workflow structure
      const errors = validateWorkflow(newWorkflow);
      if (errors.length > 0) {
        setValidationError(errors.join(', '));
        return;
      }

      setValidationError(null);
      onWorkflowUpdate(newWorkflow);
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Invalid workflow structure';
      setValidationError(error);
    }
  };

  // Workflow definition (structure only)
  const workflowDefinition = {
    id: workflow.id,
    name: workflow.name,
    description: workflow.description,
    nodes: workflow.nodes.map(({ id, agentId, agentName, status }) => ({
      id,
      agentId,
      agentName,
      status,
    })),
  };

  // Complete workflow state (with data)
  const workflowState = workflow;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Content */}
      <ScrollArea className="flex-1">
        {viewMode === 'ui' ? (
          <WorkflowTimeline
            workflow={workflow}
            selectedNodeId={selectedNodeId}
            onNodeClick={(node) => onNodeSelect(node.id)}
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
                <TabsTrigger value="input">Input (Structure)</TabsTrigger>
                <TabsTrigger value="work">Work (State)</TabsTrigger>
              </TabsList>
              <TabsContent value="input" className="mt-4">
                <JsonEditor
                  value={workflowDefinition}
                  onChange={handleWorkflowJsonChange}
                  title="Workflow Definition"
                  onValidationError={setValidationError}
                />
              </TabsContent>
              <TabsContent value="work" className="mt-4">
                <JsonEditor
                  value={workflowState}
                  onChange={handleWorkflowJsonChange}
                  title="Complete Workflow State"
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
