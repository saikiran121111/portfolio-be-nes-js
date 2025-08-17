import { ToolDoc, strip } from '../../../src/portfolio/toolsConstants/types';

describe('ToolsConstants Types', () => {
  describe('ToolDoc interface', () => {
    it('should allow valid ToolDoc objects', () => {
      const validToolDoc: ToolDoc = {
        key: 'test-key',
        title: 'Test Title',
        icon: 'TestIcon',
        content: 'Test content',
        summary: 'Test summary',
        order: 1,
      };

      expect(validToolDoc.key).toBe('test-key');
      expect(validToolDoc.title).toBe('Test Title');
      expect(validToolDoc.icon).toBe('TestIcon');
      expect(validToolDoc.content).toBe('Test content');
      expect(validToolDoc.summary).toBe('Test summary');
      expect(validToolDoc.order).toBe(1);
    });

    it('should allow ToolDoc without optional properties', () => {
      const minimalToolDoc: ToolDoc = {
        key: 'minimal-key',
        title: 'Minimal Title',
        icon: 'MinimalIcon',
        content: 'Minimal content',
      };

      expect(minimalToolDoc.key).toBe('minimal-key');
      expect(minimalToolDoc.title).toBe('Minimal Title');
      expect(minimalToolDoc.icon).toBe('MinimalIcon');
      expect(minimalToolDoc.content).toBe('Minimal content');
      expect(minimalToolDoc.summary).toBeUndefined();
      expect(minimalToolDoc.order).toBeUndefined();
    });
  });

  describe('strip function', () => {
    it('should remove leading and trailing newlines', () => {
      const input = '\n\nHello World\n\n';
      const result = strip(input);
      expect(result).toBe('Hello World');
    });

    it('should remove only leading newlines', () => {
      const input = '\n\nHello World';
      const result = strip(input);
      expect(result).toBe('Hello World');
    });

    it('should remove only trailing newlines', () => {
      const input = 'Hello World\n\n';
      const result = strip(input);
      expect(result).toBe('Hello World');
    });

    it('should preserve internal newlines', () => {
      const input = '\nHello\nWorld\n';
      const result = strip(input);
      expect(result).toBe('Hello\nWorld');
    });

    it('should handle empty string', () => {
      const input = '';
      const result = strip(input);
      expect(result).toBe('');
    });

    it('should handle string with only newlines', () => {
      const input = '\n\n\n';
      const result = strip(input);
      expect(result).toBe('');
    });

    it('should handle string without newlines', () => {
      const input = 'Hello World';
      const result = strip(input);
      expect(result).toBe('Hello World');
    });

    it('should handle single newline at start', () => {
      const input = '\nHello World';
      const result = strip(input);
      expect(result).toBe('Hello World');
    });

    it('should handle single newline at end', () => {
      const input = 'Hello World\n';
      const result = strip(input);
      expect(result).toBe('Hello World');
    });

    it('should handle mixed whitespace and newlines', () => {
      const input = '\n \nHello World\n \n';
      const result = strip(input);
      expect(result).toBe(' \nHello World\n ');
    });

    it('should work with template literals', () => {
      const input = strip(`
        This is a test
        with multiple lines
      `);
      expect(input).toBe('        This is a test\n        with multiple lines\n      ');
    });
  });
});
