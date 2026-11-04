export class InvoiceTotalMismatchError extends Error {
  override name = 'InvoiceTotalMismatchError';
}

export class CustomerLookupError extends Error {
  override name = 'CustomerLookupError';
}

export class ReportRangeError extends Error {
  override name = 'ReportRangeError';
}

export class PreferencesParseError extends Error {
  override name = 'PreferencesParseError';
}

export class CsvExportError extends Error {
  override name = 'CsvExportError';
}

export class PdfLayoutError extends Error {
  override name = 'PdfLayoutError';
}

export class ReminderQueueError extends Error {
  override name = 'ReminderQueueError';
}

export class CreditLimitError extends Error {
  override name = 'CreditLimitError';
}

export class TenantResolutionError extends Error {
  override name = 'TenantResolutionError';
}

export class TaxRegionError extends Error {
  override name = 'TaxRegionError';
}

export class PaymentReconcileError extends Error {
  override name = 'PaymentReconcileError';
}

export class ExportWriteError extends Error {
  override name = 'ExportWriteError';
}

export class CacheWarmError extends Error {
  override name = 'CacheWarmError';
}
