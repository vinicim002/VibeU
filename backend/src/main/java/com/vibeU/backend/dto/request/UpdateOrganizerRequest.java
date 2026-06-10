package com.vibeU.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateOrganizerRequest(
    @NotBlank @Size(min = 3, max = 150) String name,
    @NotBlank @Email String email,
    @Size(max = 20) String phone,
    @Size(max = 200) String bio
) {
}
