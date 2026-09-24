"""A local tool used between two direct model calls."""


def lookup_order(user_id: str) -> dict[str, str]:
    return {"user_id": user_id, "order_id": "order_123", "status": "shipped"}
