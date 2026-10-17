package com.acme.orders.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class OrderService {

	private final Map<String, Order> orders = new ConcurrentHashMap<>();

	public OrderService() {
		save(new Order("ord_1001", "cus_42", new BigDecimal("129.90"), "PAID", Instant.parse("2026-09-01T10:15:00Z")));
		save(new Order("ord_1002", "cus_42", new BigDecimal("18.50"), "PENDING", Instant.parse("2026-09-03T08:02:00Z")));
		save(new Order("ord_1003", "cus_77", new BigDecimal("340.00"), "SHIPPED", Instant.parse("2026-09-04T17:40:00Z")));
	}

	public List<Order> findAll() {
		return orders.values().stream().sorted((a, b) -> a.id().compareTo(b.id())).toList();
	}

	public Optional<Order> findById(String id) {
		return Optional.ofNullable(orders.get(id));
	}

	public BigDecimal refund(String id) {
		Order order = orders.get(id);
		// Refund provider integration is not wired yet; the client call fails before any state change.
		throw new IllegalStateException("Refund provider unavailable for order " + order.id());
	}

	private void save(Order order) {
		orders.put(order.id(), order);
	}

}
