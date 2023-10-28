import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

interface IErrorMessage {
  error?: string;
  message?: string | string[];
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const messageObject = exception.getResponse() as IErrorMessage;

    let errorMessage: string | string[];
    let errorDetail: string | undefined;

    if (typeof messageObject === 'string') {
      errorMessage = messageObject;
    } else if (this.isIErrorMessage(messageObject)) {
      errorMessage = messageObject.message || '';
      errorDetail = messageObject.error;
    } else {
      errorMessage = exception.name;
    }

    if (Array.isArray(errorMessage)) {
      errorMessage = errorMessage.join(' ');
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorDetail || exception.name,
      message: errorMessage
    };

    response.status(status).json(responseBody);
  }

  private isIErrorMessage(object: any): object is IErrorMessage {
    return object && (object.error !== undefined || object.message !== undefined);
  }
}