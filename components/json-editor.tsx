'use client';

// ABOUTME: JSON editor component with syntax highlighting and validation
// ABOUTME: Supports read-only mode and provides visual feedback for errors

import { useState, useCallback } from 'react';
import { Copy, Check, AlertCircle, Lock } from 'lucide-react';
import { JsonEditorProps } from '@/lib/types';

export function JsonEditor({
  value,
  onChange,
  readOnly = false,
  title,
  onValidationError,
}: JsonEditorProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format JSON with proper indentation
  const formattedValue = JSON.stringify(value, null, 2);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formattedValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [formattedValue]);

  const handleChange = useCallback(
    (newValue: string) => {
      try {
        // Validate JSON
        const parsed = JSON.parse(newValue);
        setError(null);
        onChange(parsed);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Invalid JSON';
        setError(errorMessage);
        if (onValidationError) {
          onValidationError(errorMessage);
        }
      }
    },
    [onChange, onValidationError]
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">{title}</h3>
          {readOnly && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
              <Lock className="w-3 h-3" />
              Read-only
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs hover:bg-muted rounded transition-colors"
          type="button"
          aria-label="Copy JSON"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* JSON Editor */}
      <textarea
        value={formattedValue}
        onChange={(e) => handleChange(e.target.value)}
        readOnly={readOnly}
        className={`
          w-full h-96 p-4 font-mono text-sm
          border rounded-md resize-y
          focus:outline-none focus:ring-2 focus:ring-primary
          ${
            readOnly
              ? 'bg-muted cursor-not-allowed'
              : 'bg-background'
          }
          ${error ? 'border-red-500' : 'border-border'}
        `}
        spellCheck={false}
      />

      {/* Info */}
      <div className="mt-2 text-xs text-muted-foreground">
        {readOnly
          ? 'This JSON is read-only. You can copy it but not edit it.'
          : 'Edit the JSON directly. Changes will sync with the UI.'}
      </div>
    </div>
  );
}
