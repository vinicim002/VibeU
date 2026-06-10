package com.vibeU.backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record LotResponse(
    UUID id,
    String name,
    BigDecimal price,
    Integer quantity,
    Integer sold,
    LocalDate startsAt,
    LocalDate endsAt
) {
}
