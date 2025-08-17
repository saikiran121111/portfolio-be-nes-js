import { ToolDoc, strip } from '../types';

export const prettierDoc: ToolDoc = {
  key: 'prettier',
  title: 'Prettier – Formatting Summary',
  icon: 'Sparkles',
  summary: 'Formatting setup and scripts.',
  content: strip(`
Prettier – Formatting Summary

Overview
- Prettier is used for code formatting and integrated with ESLint.
- Config file: .prettierrc (JSON).

Configuration (.prettierrc)
- singleQuote: true → Use single quotes in JS/TS.
- trailingComma: "all" → Trailing commas where valid (objects, arrays, params).

Scripts
- Format all TS files: npm run format (src and test paths).

Usage notes
- Prettier is enforced via ESLint plugin (eslint-plugin-prettier/recommended).
- Adjust preferences by editing .prettierrc.
- Consider adding printWidth and tabWidth if needed (defaults: 80, 2).
`),
  order: 19,
};
