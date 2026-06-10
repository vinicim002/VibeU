package com.vibeU.backend.dto.response;

public record LoginResponse(
    String token,
    SessionUserResponse user
) {
}
