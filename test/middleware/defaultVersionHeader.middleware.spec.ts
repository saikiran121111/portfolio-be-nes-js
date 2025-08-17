import { Request, Response, NextFunction } from 'express';
import { defaultVersionHeaderMiddleware } from '../../src/middleware/defaultVersionHeader.middleware';
import { HEADER_VERSION } from '../../src/constants/headerVersion';

describe('defaultVersionHeaderMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    mockNext = jest.fn();
  });

  it('should be defined', () => {
    expect(defaultVersionHeaderMiddleware).toBeDefined();
  });

  it('should add version header when not present', () => {
    defaultVersionHeaderMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockRequest.headers!['version']).toBe(HEADER_VERSION);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should not overwrite existing version header', () => {
    const existingVersion = '1';
    mockRequest.headers!['version'] = existingVersion;

    defaultVersionHeaderMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockRequest.headers!['version']).toBe(existingVersion);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should handle case-sensitive headers', () => {
    mockRequest.headers!['Version'] = '1';

    defaultVersionHeaderMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // Should add lowercase version header since 'Version' != 'version'
    expect(mockRequest.headers!['version']).toBe(HEADER_VERSION);
    expect(mockRequest.headers!['Version']).toBe('1');
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should call next function', () => {
    defaultVersionHeaderMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should handle empty headers object', () => {
    mockRequest.headers = {};

    defaultVersionHeaderMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockRequest.headers!['version']).toBe(HEADER_VERSION);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
