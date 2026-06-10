package com.vibeU.backend.dto.request;

import com.vibeU.backend.enums.EntityStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record FaculdadeRequest(
    @NotBlank @Size(max = 200) String nome,
    @NotBlank @Size(max = 20) String sigla,
    @NotBlank @Size(max = 100) String cidade,
    @NotBlank @Size(min = 2, max = 2) String estado,
    @Size(max = 500) String logo,
    @NotNull EntityStatus status
) {
}
