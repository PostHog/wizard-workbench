import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

type ErrorBody = {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  timestamp: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<unknown>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const body: ErrorBody = {
      statusCode,
      error: HttpStatus[statusCode] ?? 'ERROR',
      message: this.messageFor(exception, statusCode),
      path: String(httpAdapter.getRequestUrl(request)),
      timestamp: new Date().toISOString(),
    };

    if (statusCode >= 500) {
      this.logger.error(
        `${httpAdapter.getRequestMethod(request)} ${body.path} -> ${statusCode}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(
        `${httpAdapter.getRequestMethod(request)} ${body.path} -> ${statusCode}: ${JSON.stringify(body.message)}`,
      );
    }

    httpAdapter.reply(ctx.getResponse(), body, statusCode);
  }

  private messageFor(
    exception: unknown,
    statusCode: number,
  ): string | string[] {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return response;
      }
      const { message } = response as { message?: string | string[] };
      return message ?? exception.message;
    }
    return statusCode >= 500 ? 'Internal server error' : 'Request failed';
  }
}
