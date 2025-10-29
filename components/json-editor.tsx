'use client';

// ABOUTME: JSON editor component with syntax highlighting and validation
// ABOUTME: Supports read-only mode and provides visual feedback for errors

import { useState, useCallback } from 'react';
import { Copy, Check, AlertCircle, Lock } from 'lucide-react';
import { JsonEditorProps } from '@/lib/types';
import { cn } from '@/lib/utils';

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
    } catch {
      // Clipboard copy failed silently
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
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</h3>
          {readOnly && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] bg-muted/50 text-muted-foreground rounded">
              <Lock className="w-3 h-3" />
              Read-only
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2 py-1 text-xs hover:bg-accent rounded-md transition-cursor text-muted-foreground hover:text-foreground"
          type="button"
          aria-label="Copy JSON"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-3 p-2.5 bg-destructive/10 border border-destructive/30 rounded-md text-xs text-destructive flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* JSON Editor */}
      <div className="flex-1 relative">
        <textarea
          value={formattedValue}
          onChange={(e) => handleChange(e.target.value)}
          readOnly={readOnly}
          className={cn(
            "w-full h-full p-3 font-mono text-xs resize-none",
            "bg-muted/50 border border-border rounded-md",
            "focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50",
            "scrollbar-cursor transition-cursor",
            readOnly && "cursor-not-allowed opacity-75",
            error && "border-destructive/50"
          )}
          spellCheck={false}
        />
      </div>

      {/* Info */}
      <div className="mt-2 text-[10px] text-muted-foreground/60">
        {readOnly
          ? 'This JSON is read-only. You can copy it but not edit it.'
          : 'Edit the JSON directly. Changes will sync with the UI.'}
      </div>
    </div>
  );
}
