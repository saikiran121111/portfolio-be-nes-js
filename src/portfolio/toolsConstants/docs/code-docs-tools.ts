import { ToolDoc, strip } from '../types';

export const codeDocsTools: ToolDoc = {
  key: 'code-docs',
  title: 'Code and Documentation Tools',
  icon: 'BookText',
  summary: 'Generate docs and dependency reports from codebase.',
  content: strip(`
Code and Documentation Tools – Portfolio Backend

Prerequisites
- Create output folder if needed:
  if (!(Test-Path .\\docs)) { New-Item -ItemType Directory -Path .\\docs | Out-Null }

1) Compodoc (HTML docs)
Purpose: Generate interactive HTML docs from Nest/TypeScript code.
Run:
- npx @compodoc/compodoc -p tsconfig.json -d docs/compodoc
Notes: Open docs/compodoc/index.html in your browser.

2) TypeDoc (Markdown)
Purpose: Generate Markdown docs from TS types and comments.
Install (once):
- npm i -D typedoc typedoc-plugin-markdown
Run:
- npx typedoc --plugin typedoc-plugin-markdown --out docs/typedoc src
Notes: Configure via typedoc.json if desired.

3) Dependency Cruiser (Text report)
Purpose: Report and validate dependencies between modules.
Run:
- npx dependency-cruiser -f text src | Out-File -Encoding utf8 .\\docs\\deps.txt
Notes: Add a .dependency-cruiser.js to enforce rules.

4) Madge (Circular deps + Graph)
Purpose: Find circular dependencies; optionally render graphs.
Run:
- npx madge --circular src | Out-File -Encoding utf8 .\\docs\\circular-deps.txt
Graph (optional, requires Graphviz for image export):
- npx madge --image .\\docs\\deps-graph.svg src
`),
  order: 12,
};
