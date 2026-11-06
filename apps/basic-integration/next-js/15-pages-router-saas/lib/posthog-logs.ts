import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

export const posthogLogsLogger = loggerProvider.getLogger('posthog-exporter');

export async function logCheckoutSessionCreated() {
  posthogLogsLogger.emit({
    body: 'checkout_session_created',
    severityNumber: SeverityNumber.INFO,
    attributes: {
      operation: 'checkout_session_created'
    }
  });
  await loggerProvider.forceFlush().catch(() => {});
}

export async function logTeamInvitationCreated(role: 'member' | 'owner') {
  posthogLogsLogger.emit({
    body: 'team_invitation_created',
    severityNumber: SeverityNumber.INFO,
    attributes: {
      operation: 'team_invitation_created',
      role
    }
  });
  await loggerProvider.forceFlush().catch(() => {});
}
