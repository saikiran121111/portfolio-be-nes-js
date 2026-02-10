import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { SelfPingService } from '../../src/tasks/self-ping.service';
import * as http from 'http';
import * as https from 'https';

// Mock http and https modules
jest.mock('http');
jest.mock('https');

describe('SelfPingService', () => {
    let service: SelfPingService;
    let loggerLogSpy: jest.SpyInstance;
    let loggerWarnSpy: jest.SpyInstance;
    let loggerErrorSpy: jest.SpyInstance;
    const originalEnv = process.env;

    beforeEach(async () => {
        // Reset environment
        process.env = { ...originalEnv };

        const module: TestingModule = await Test.createTestingModule({
            providers: [SelfPingService],
        }).compile();

        service = module.get<SelfPingService>(SelfPingService);

        // Spy on logger methods
        loggerLogSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
        loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
        loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    });

    afterEach(() => {
        process.env = originalEnv;
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('onModuleInit', () => {
        it('should enable self-ping when SELF_PING_URL is set', () => {
            // Arrange
            process.env.SELF_PING_URL = 'https://my-app.onrender.com/health';

            // Act
            service.onModuleInit();

            // Assert
            expect(loggerLogSpy).toHaveBeenCalledWith('=== SelfPingService STARTED ===');
            expect(loggerLogSpy).toHaveBeenCalledWith(
                expect.stringContaining('https://my-app.onrender.com/health'),
            );
            expect(loggerLogSpy).toHaveBeenCalledWith(
                expect.stringContaining('every 5 minutes'),
            );
        });

        it('should warn when SELF_PING_URL is not set', () => {
            // Arrange
            delete process.env.SELF_PING_URL;

            // Act
            service.onModuleInit();

            // Assert
            expect(loggerWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining('SELF_PING_URL not set'),
            );
            expect(loggerWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining('DISABLED'),
            );
        });
    });

    describe('pingSelf', () => {
        it('should skip ping when SELF_PING_URL is not set', async () => {
            // Arrange
            delete process.env.SELF_PING_URL;
            service.onModuleInit();
            jest.clearAllMocks();

            // Act
            await service.pingSelf();

            // Assert — no logs, no HTTP calls
            expect(loggerLogSpy).not.toHaveBeenCalled();
            expect(http.get).not.toHaveBeenCalled();
            expect(https.get).not.toHaveBeenCalled();
        });

        it('should successfully ping an HTTPS URL', async () => {
            // Arrange
            process.env.SELF_PING_URL = 'https://my-app.onrender.com/health';
            service.onModuleInit();
            jest.clearAllMocks();

            const mockResponse = {
                statusCode: 200,
                resume: jest.fn(),
            };
            const mockRequest = {
                on: jest.fn(),
                setTimeout: jest.fn(),
            };

            (https.get as jest.Mock).mockImplementation((_url, callback) => {
                callback(mockResponse);
                return mockRequest;
            });

            // Act
            await service.pingSelf();

            // Assert
            expect(https.get).toHaveBeenCalledWith(
                'https://my-app.onrender.com/health',
                expect.any(Function),
            );
            expect(loggerLogSpy).toHaveBeenCalledWith(expect.stringContaining('SUCCESS'));
            expect(loggerLogSpy).toHaveBeenCalledWith(expect.stringContaining('200'));
            expect(mockResponse.resume).toHaveBeenCalled();
        });

        it('should successfully ping an HTTP URL', async () => {
            // Arrange
            process.env.SELF_PING_URL = 'http://localhost:3002/health';
            service.onModuleInit();
            jest.clearAllMocks();

            const mockResponse = {
                statusCode: 200,
                resume: jest.fn(),
            };
            const mockRequest = {
                on: jest.fn(),
                setTimeout: jest.fn(),
            };

            (http.get as jest.Mock).mockImplementation((_url, callback) => {
                callback(mockResponse);
                return mockRequest;
            });

            // Act
            await service.pingSelf();

            // Assert
            expect(http.get).toHaveBeenCalledWith(
                'http://localhost:3002/health',
                expect.any(Function),
            );
            expect(loggerLogSpy).toHaveBeenCalledWith(expect.stringContaining('SUCCESS'));
        });

        it('should handle request errors gracefully', async () => {
            // Arrange
            process.env.SELF_PING_URL = 'https://my-app.onrender.com/health';
            service.onModuleInit();
            jest.clearAllMocks();

            const mockRequest = {
                on: jest.fn(),
                setTimeout: jest.fn(),
            };

            (https.get as jest.Mock).mockImplementation((_url, _callback) => {
                // Simulate an error by calling the error handler
                process.nextTick(() => {
                    const errorHandler = mockRequest.on.mock.calls.find(
                        (call: string[]) => call[0] === 'error',
                    );
                    if (errorHandler) {
                        errorHandler[1](new Error('Connection refused'));
                    }
                });
                return mockRequest;
            });

            // Act
            await service.pingSelf();

            // Assert
            expect(loggerErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining('FAILED'),
            );
            expect(loggerErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining('Connection refused'),
            );
        });

        it('should log timestamp when pinging', async () => {
            // Arrange
            process.env.SELF_PING_URL = 'https://my-app.onrender.com/health';
            service.onModuleInit();
            jest.clearAllMocks();

            const mockResponse = {
                statusCode: 200,
                resume: jest.fn(),
            };
            const mockRequest = {
                on: jest.fn(),
                setTimeout: jest.fn(),
            };

            (https.get as jest.Mock).mockImplementation((_url, callback) => {
                callback(mockResponse);
                return mockRequest;
            });

            // Act
            await service.pingSelf();

            // Assert
            expect(loggerLogSpy).toHaveBeenCalledWith(
                expect.stringContaining('Pinging'),
            );
            expect(loggerLogSpy).toHaveBeenCalledWith(
                expect.stringContaining('Response time:'),
            );
        });

        it('should set a 30 second timeout on the request', async () => {
            // Arrange
            process.env.SELF_PING_URL = 'https://my-app.onrender.com/health';
            service.onModuleInit();
            jest.clearAllMocks();

            const mockResponse = {
                statusCode: 200,
                resume: jest.fn(),
            };
            const mockRequest = {
                on: jest.fn(),
                setTimeout: jest.fn(),
            };

            (https.get as jest.Mock).mockImplementation((_url, callback) => {
                callback(mockResponse);
                return mockRequest;
            });

            // Act
            await service.pingSelf();

            // Assert
            expect(mockRequest.setTimeout).toHaveBeenCalledWith(30_000, expect.any(Function));
        });
    });

    describe('constructor', () => {
        it('should initialize with logger', () => {
            expect(service['logger']).toBeDefined();
            expect(service['logger']).toBeInstanceOf(Logger);
        });

        it('should initialize pingUrl as null', () => {
            expect(service['pingUrl']).toBeNull();
        });
    });
});
