package com.acme.orders.order;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

	private final OrderService orderService;

	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}

	@GetMapping
	public List<Order> list() {
		return orderService.findAll();
	}

	@GetMapping("/{id}")
	public Order get(@PathVariable String id) {
		return orderService.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order " + id + " not found"));
	}

	@PostMapping("/{id}/refund")
	public Map<String, Object> refund(@PathVariable String id) {
		BigDecimal amount = orderService.refund(id);
		return Map.of("orderId", id, "refunded", amount);
	}

	@GetMapping("/reports/daily")
	public Map<String, Object> dailyReport() {
		throw new RuntimeException("Daily report generation failed: upstream warehouse timeout");
	}

}
