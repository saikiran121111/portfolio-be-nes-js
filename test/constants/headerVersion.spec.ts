import { HEADER_VERSION } from '../../src/constants/headerVersion';

describe('HEADER_VERSION', () => {
  it('should be defined', () => {
    expect(HEADER_VERSION).toBeDefined();
  });

  it('should be a string', () => {
    expect(typeof HEADER_VERSION).toBe('string');
  });

  it('should have the correct value', () => {
    expect(HEADER_VERSION).toBe('2');
  });

  it('should not be empty', () => {
    expect(HEADER_VERSION).not.toBe('');
    expect(HEADER_VERSION.length).toBeGreaterThan(0);
  });
});
