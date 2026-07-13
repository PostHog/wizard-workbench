export function getDistinctId(userId: number | string) {
  return String(userId);
}

export function getRequestIp(headers: Record<string, string | string[] | undefined>) {
  const forwardedFor = headers['x-forwarded-for'];

  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0];
  }

  return forwardedFor?.split(',')[0]?.trim();
}
