import posthog from 'posthog-js';
import type { LogAttributes } from 'posthog-js';

const loggerName = 'todo_activity';

export const todoActivityLogger = {
  info(message: string, attributes: LogAttributes = {}) {
    posthog.logger.info(message, { logger_name: loggerName, ...attributes });
  },
};
