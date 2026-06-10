package com.vibeU.backend.dto.request;

import com.vibeU.backend.enums.EntityStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateEntityStatusRequest(
    @NotNull EntityStatus status
) {
}
