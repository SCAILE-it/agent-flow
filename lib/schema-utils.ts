// ABOUTME: Pure utility functions for JSON Schema manipulation
// ABOUTME: Handles conditional field visibility by filtering schema properties

import { AgentSchema } from './types';

/**
 * Filters AgentSchema to exclude hidden fields
 * Pure function - returns new schema object without mutations
 *
 * Removes hidden fields from:
 * - schema.properties (field definitions)
 * - schema.required (required field list)
 *
 * @param schema - Original agent schema
 * @param hiddenFields - Set of field names to exclude
 * @returns New filtered schema with hidden fields removed
 */
export function filterSchemaFields(
  schema: AgentSchema,
  hiddenFields: Set<string>
): AgentSchema {
  // No filtering needed if no hidden fields
  if (hiddenFields.size === 0) {
    return schema;
  }

  // Clone properties object and remove hidden fields
  const filteredProperties = { ...schema.schema.properties };
  hiddenFields.forEach((field) => {
    delete filteredProperties[field];
  });

  // Filter required array to exclude hidden fields
  const filteredRequired = schema.schema.required
    ? schema.schema.required.filter((field) => !hiddenFields.has(field))
    : undefined;

  // Return new schema object (immutable update)
  return {
    ...schema,
    schema: {
      ...schema.schema,
      properties: filteredProperties,
      ...(filteredRequired && filteredRequired.length > 0 && { required: filteredRequired }),
    },
  };
}
