package com.vibeU.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank @Size(min = 3, max = 150) String name,
    @NotBlank @Email String email,
    @NotBlank String password
) {
}
