// Shared types and helpers for tools/docs constants
export type ToolDoc = {
  key: string; // stable key, e.g., 'openapi-tools'
  title: string; // display title
  icon: string; // lucide or other icon name, e.g., 'FileText' | 'Wrench'
  summary?: string; // short one-line summary for pointer
  content: string; // full description text (markdown supported)
  order?: number; // optional order for display
};

// Helper to trim leading/trailing new lines from template literals
export const strip = (s: string) => s.replace(/^\n+|\n+$/g, '');
