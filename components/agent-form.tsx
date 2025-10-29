'use client';

// ABOUTME: Form component that wraps @rjsf/shadcn for rendering agent input forms
// ABOUTME: Accepts JSON Schema and generates shadcn/ui based forms with validation

import Form from '@rjsf/shadcn';
import validator from '@rjsf/validator-ajv8';
import { AgentFormProps, FormData } from '@/lib/types';
import type { IChangeEvent } from '@rjsf/core';

export function AgentForm({ schema, formData, onSubmit, onChange }: AgentFormProps) {
  const handleSubmit = (data: IChangeEvent<FormData>) => {
    if (onSubmit && data.formData) {
      onSubmit(data.formData);
    }
  };

  const handleChange = (data: IChangeEvent<FormData>) => {
    if (onChange && data.formData) {
      onChange(data.formData);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">{schema.name}</h2>
        <p className="text-xs text-muted-foreground mt-1">{schema.description}</p>
      </div>
      <Form
        schema={schema.schema}
        uiSchema={schema.uiSchema}
        formData={formData}
        validator={validator}
        onSubmit={handleSubmit}
        onChange={handleChange}
        showErrorList={false}
        className="space-y-3"
      />
    </div>
  );
}
