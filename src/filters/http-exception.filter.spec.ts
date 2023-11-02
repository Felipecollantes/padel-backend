import { HttpExceptionFilter } from './http-exception.filter';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
  });

  it('should catch an HttpException and respond with a formatted error', () => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    const response = {
      status: mockStatus,
    };

    const request = {
      url: '/test-url',
    };

    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    };

    filter.catch(exception, host as any);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: expect.any(String),
        path: '/test-url',
        error: 'HttpException',
        message: 'Test error',
      }),
    );
  });

  it('should handle string error messages', () => {
    const response = {
      status: jest.fn(() => response),
      json: jest.fn(),
    };
    const request = { url: '/test-url' };
    const exception = new HttpException('A string error message', HttpStatus.BAD_REQUEST);

    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    };

    filter.catch(exception, host as any);

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'HttpException',
        message: 'A string error message',
      }),
    );
  });

  it('should handle error messages as an array', () => {
    const response = {
      status: jest.fn(() => response),
      json: jest.fn(),
    };
    const request = { url: '/test-url' };
    const exception = new HttpException(['Error message 1', 'Error message 2'], HttpStatus.BAD_REQUEST);

    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    };

    filter.catch(exception, host as any);

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: expect.any(String),
        path: '/test-url',
        error: 'Bad Request',
        message: 'HttpException',
      }),
    );
  });

  it('should handle error messages from an IErrorMessage object', () => {
    interface IErrorMessage {
      error?: string;
      message?: string | string[];
    }
    const response = {
      status: jest.fn(() => response),
      json: jest.fn(),
    };
    const request = { url: '/test-url' };
    const exceptionResponse: IErrorMessage = {
      error: 'IError',
      message: 'An IErrorMessage object error message',
    };
    const exception = new HttpException(exceptionResponse, HttpStatus.BAD_REQUEST);

    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    };

    filter.catch(exception, host as any);

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'IError',
        message: 'An IErrorMessage object error message',
      }),
    );
  });

  // Add more tests for different scenarios based on how complex your error handling is
});
