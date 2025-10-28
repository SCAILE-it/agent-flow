'use client';

// ABOUTME: Global configuration component with UI/JSON toggle
// ABOUTME: Displays global workflow settings using auto-generated forms or JSON editor

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { JsonEditor } from './json-editor';
import { GlobalConfigViewProps, FormData } from '@/lib/types';
import { globalConfigSchema } from '@/lib/schemas/global-config';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle } from 'lucide-react';

// Dynamically import AgentForm to avoid SSR issues
const AgentForm = dynamic(
  () => import('./agent-form').then((mod) => ({ default: mod.AgentForm })),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6 p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-36" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    ),
  }
);

export function GlobalConfigView({
  globalConfig,
  viewMode,
  onGlobalConfigChange,
}: GlobalConfigViewProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleGlobalConfigJsonChange = (value: unknown) => {
    try {
      const newGlobalConfig = value as FormData;
      setValidationError(null);
      onGlobalConfigChange(newGlobalConfig);
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Invalid global configuration';
      setValidationError(error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Content */}
      <ScrollArea className="flex-1">
        {viewMode === 'ui' ? (
          <div className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <AgentForm
                schema={globalConfigSchema}
                formData={globalConfig}
                onChange={onGlobalConfigChange}
                onSubmit={onGlobalConfigChange}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Validation Error */}
            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            {/* JSON Editor */}
            <JsonEditor
              value={globalConfig}
              onChange={handleGlobalConfigJsonChange}
              readOnly={!globalConfigSchema.config?.allowDataEdit}
              title="Global Configuration"
              onValidationError={setValidationError}
            />
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
