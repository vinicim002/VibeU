package com.vibeU.backend.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record LotRequest(
    UUID id,
    @NotBlank String name,
    @NotNull @DecimalMin("0.0") BigDecimal price,
    @NotNull @Min(1) Integer quantity
) {
}
