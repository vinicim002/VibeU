package com.vibeU.backend.dto.response;

import com.vibeU.backend.enums.EntityStatus;

import java.time.Instant;
import java.util.UUID;

public record OrganizerResponse(
    UUID id,
    String name,
    String email,
    EntityStatus status,
    String phone,
    String bio,
    Instant createdAt
) {
}
