import { HttpExceptionFilter } from './http-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

describe('HttpExceptionFilter', () => {
  it('should catch an HttpException and respond with a formatted error', () => {
    const responseMock = {
      status: jest.fn(() => responseMock),
      json: jest.fn(),
    };
    const requestMock = {
      url: '/test-url',
    };

    const hostMock = {
      switchToHttp: jest.fn(() => ({
        getResponse: () => responseMock as unknown as Response,
        getRequest: () => requestMock as unknown as Request,
      })),
    } as unknown as ArgumentsHost;

    const filter = new HttpExceptionFilter();
    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
    filter.catch(exception, hostMock);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(responseMock.json).toHaveBeenCalledWith(expect.anything());
  });

  it('should handle string error messages', () => {
    const responseMock = {
      status: jest.fn(() => responseMock),
      json: jest.fn(),
    };
    const requestMock = {
      url: '/test-url',
    };

    const hostMock = {
      switchToHttp: jest.fn(() => ({
        getResponse: () => responseMock as unknown as Response,
        getRequest: () => requestMock as unknown as Request,
      })),
    } as unknown as ArgumentsHost;

    const filter = new HttpExceptionFilter();
    const exception = new HttpException('A simple error message', HttpStatus.BAD_REQUEST);

    jest.spyOn(exception, 'getResponse').mockReturnValue('A simple error message');

    filter.catch(exception, hostMock);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: expect.any(String),
        path: '/test-url',
        error: expect.any(String),
        message: 'A simple error message',
      }),
    );
  });

  it('should handle error messages as an array', () => {
    const responseMock = {
      status: jest.fn(() => responseMock),
      json: jest.fn(),
    };
    const requestMock = {
      url: '/test-url',
    };
    const hostMock = {
      switchToHttp: jest.fn(() => ({
        getResponse: () => responseMock as unknown as Response,
        getRequest: () => requestMock as unknown as Request,
      })),
    } as unknown as ArgumentsHost;

    const filter = new HttpExceptionFilter();
    const exceptionMessages = ['Error message 1', 'Error message 2'];
    const exception = new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: exceptionMessages,
      },
      HttpStatus.BAD_REQUEST,
    );

    jest.spyOn(exception, 'getResponse').mockReturnValue(exception.getResponse());

    filter.catch(exception, hostMock);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: expect.any(String),
        path: '/test-url',
        error: 'Bad Request',
        message: exceptionMessages.join(' '),
      }),
    );
  });

  it('should handle error messages from an IErrorMessage object', () => {
    const responseMock = {
      status: jest.fn(() => responseMock),
      json: jest.fn(),
    };
    const requestMock = {
      url: '/test-url',
    };
    const hostMock = {
      switchToHttp: jest.fn(() => ({
        getResponse: () => responseMock as unknown as Response,
        getRequest: () => requestMock as unknown as Request,
      })),
    } as unknown as ArgumentsHost;

    const filter = new HttpExceptionFilter();
    const errorMessageObject = {
      error: 'IErrorMessage Error',
      message: 'An error occurred',
    };
    const exception = new HttpException(errorMessageObject, HttpStatus.BAD_REQUEST);

    jest.spyOn(exception, 'getResponse').mockReturnValue(errorMessageObject);

    filter.catch(exception, hostMock);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: expect.any(String),
        path: '/test-url',
        error: errorMessageObject.error,
        message: errorMessageObject.message,
      }),
    );
  });
});
