'use client';

// ABOUTME: Global configuration component with UI/JSON toggle
// ABOUTME: Displays global workflow settings using auto-generated forms or JSON editor

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { JsonEditor } from './json-editor';
import { GlobalConfigViewProps, FormData } from '@/lib/types';
import { globalConfigSchema } from '@/lib/schemas/global-config';

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
      <div className="flex-1 overflow-auto">
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
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-300">
                {validationError}
              </div>
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
      </div>
    </div>
  );
}
