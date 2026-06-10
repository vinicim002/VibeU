package com.vibeU.backend.dto.response;

import com.vibeU.backend.enums.UserRole;

import java.util.UUID;

public record SessionUserResponse(
    UUID id,
    String name,
    String email,
    UserRole role
) {
}
