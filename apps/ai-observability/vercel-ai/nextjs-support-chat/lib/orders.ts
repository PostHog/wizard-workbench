/** Order lookup backing the `lookupOrder` tool. No model call involved. */

const ORDERS: Record<string, { id: string; status: string; eta: string }> = {
    user_123: { id: 'A-1001', status: 'in transit', eta: 'Thursday' },
}

export function lookupOrder(userId: string): { id: string; status: string; eta: string } | null {
    return ORDERS[userId] ?? null
}
