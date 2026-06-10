package com.vibeU.backend.dto.request;

import jakarta.validation.constraints.NotNull;

public record UpdateFeaturedRequest(
    @NotNull Boolean featured
) {
}
