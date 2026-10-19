package com.acme.orders.order;

import java.math.BigDecimal;
import java.time.Instant;

public record Order(String id, String customerId, BigDecimal total, String status, Instant createdAt) {
}
