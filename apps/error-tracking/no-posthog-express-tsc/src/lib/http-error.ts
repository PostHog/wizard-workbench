export class HttpError extends Error {
  readonly status: number;
  readonly expose: boolean;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.expose = status < 500;
  }
}

export const notFound = (message = 'Not found'): HttpError =>
  new HttpError(404, message);

export const badRequest = (message: string): HttpError =>
  new HttpError(400, message);
