import {
  TOOL_DOCS,
  getOrderedToolDocs,
} from '../../../src/portfolio/toolsConstants/constants';

describe('ToolsConstants', () => {
  describe('TOOL_DOCS', () => {
    it('should be defined', () => {
      expect(TOOL_DOCS).toBeDefined();
    });

    it('should be an array', () => {
      expect(Array.isArray(TOOL_DOCS)).toBe(true);
    });

    it('should contain tool docs', () => {
      expect(TOOL_DOCS.length).toBeGreaterThan(0);
    });

    it('should contain valid ToolDoc objects', () => {
      TOOL_DOCS.forEach((doc) => {
        expect(doc).toHaveProperty('key');
        expect(doc).toHaveProperty('title');
        expect(doc).toHaveProperty('icon');
        expect(doc).toHaveProperty('content');
        expect(typeof doc.key).toBe('string');
        expect(typeof doc.title).toBe('string');
        expect(typeof doc.icon).toBe('string');
        expect(typeof doc.content).toBe('string');
      });
    });

    it('should have unique keys', () => {
      const keys = TOOL_DOCS.map((doc) => doc.key);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    });

    it('should have non-empty required fields', () => {
      TOOL_DOCS.forEach((doc) => {
        expect(doc.key).not.toBe('');
        expect(doc.title).not.toBe('');
        expect(doc.icon).not.toBe('');
        expect(doc.content).not.toBe('');
      });
    });

    it('should contain expected tool docs', () => {
      const expectedKeys = [
        'openapi',
        'nestjs',
        'code-docs',
        'prisma',
        'docker',
        'docs',
        'eslint',
        'nextjs',
        'postman',
        'prettier',
        'project-stats',
        'quality-security-tools',
        'swagger',
        'framer-motion',
        'lucide',
        'neondb',
        'postgres-prisma',
        'render',
        'tailwind',
        'vercel',
      ];

      expectedKeys.forEach((key) => {
        const doc = TOOL_DOCS.find((d) => d.key === key);
        expect(doc).toBeDefined();
      });
    });
  });

  describe('getOrderedToolDocs', () => {
    it('should return an array', () => {
      const result = getOrderedToolDocs();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return all tool docs', () => {
      const result = getOrderedToolDocs();
      expect(result.length).toBe(TOOL_DOCS.length);
    });

    it('should sort by order property', () => {
      const result = getOrderedToolDocs();

      for (let i = 0; i < result.length - 1; i++) {
        const currentOrder = result[i].order ?? 0;
        const nextOrder = result[i + 1].order ?? 0;
        expect(currentOrder).toBeLessThanOrEqual(nextOrder);
      }
    });

    it('should handle docs without order property', () => {
      const result = getOrderedToolDocs();
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should not modify the original array', () => {
      const originalLength = TOOL_DOCS.length;
      const originalFirst = TOOL_DOCS[0];

      getOrderedToolDocs();

      expect(TOOL_DOCS.length).toBe(originalLength);
      expect(TOOL_DOCS[0]).toBe(originalFirst);
    });

    it('should return a new array instance', () => {
      const result1 = getOrderedToolDocs();
      const result2 = getOrderedToolDocs();

      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);
    });

    it('should contain valid ToolDoc objects', () => {
      const result = getOrderedToolDocs();

      result.forEach((doc) => {
        expect(doc).toHaveProperty('key');
        expect(doc).toHaveProperty('title');
        expect(doc).toHaveProperty('icon');
        expect(doc).toHaveProperty('content');
        expect(typeof doc.key).toBe('string');
        expect(typeof doc.title).toBe('string');
        expect(typeof doc.icon).toBe('string');
        expect(typeof doc.content).toBe('string');
      });
    });
  });
});
