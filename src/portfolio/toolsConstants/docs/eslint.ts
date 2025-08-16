import { ToolDoc, strip } from '../types';

export const eslintDoc: ToolDoc = {
  key: 'eslint',
  title: 'ESLint – Project Linting Summary',
  icon: 'ShieldCheck',
  summary: 'Flat config with TypeScript and Prettier integration.',
  content: strip(`
ESLint – Project Linting Summary

Overview
- ESLint 9 (flat config) with TypeScript support and Prettier integration.
- Config file: eslint.config.mjs (Flat Config API).

Key configuration
- Base configs: @eslint/js recommended, typescript-eslint recommendedTypeChecked.
- Prettier: eslint-plugin-prettier/recommended (runs Prettier via ESLint and disables conflicting rules).
- Environments: Node and Jest globals enabled via globals package.
- Language options:
  - sourceType: commonjs
  - parserOptions: projectService: true, tsconfigRootDir: import.meta.dirname (type-aware rules).
- Ignores: ['eslint.config.mjs'] (Flat Config ignore list).
- Custom rules:
  - @typescript-eslint/no-explicit-any: off
  - @typescript-eslint/no-floating-promises: warn
  - @typescript-eslint/no-unsafe-argument: warn

Scripts
- Lint and auto-fix: npm run lint (targets {src,apps,libs,test}/**/*.ts with --fix).

Usage notes
- Type-aware linting relies on tsconfig.json and projectService; ensure TS builds.
- Formatting issues are reported as ESLint problems via Prettier plugin.
- Extend rules or ignores by editing eslint.config.mjs.
`),
  order: 16,
};
