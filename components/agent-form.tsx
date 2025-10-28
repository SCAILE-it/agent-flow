'use client';

// ABOUTME: Form component that wraps @rjsf/shadcn for rendering agent input forms
// ABOUTME: Accepts JSON Schema and generates shadcn/ui based forms with validation

import Form from '@rjsf/shadcn';
import validator from '@rjsf/validator-ajv8';
import { AgentFormProps } from '@/lib/types';

export function AgentForm({ schema, formData, onSubmit, onChange }: AgentFormProps) {
  const handleSubmit = (data: any) => {
    if (onSubmit) {
      onSubmit(data.formData);
    }
  };

  const handleChange = (data: any) => {
    if (onChange) {
      onChange(data.formData);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{schema.name}</h2>
        <p className="text-muted-foreground mt-1">{schema.description}</p>
      </div>
      <Form
        schema={schema.schema}
        uiSchema={schema.uiSchema}
        formData={formData}
        validator={validator}
        onSubmit={handleSubmit}
        onChange={handleChange}
        showErrorList={false}
        className="space-y-4"
      />
    </div>
  );
}
