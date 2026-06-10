package com.vibeU.backend.dto.request;

import com.vibeU.backend.enums.EntityStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record AtleticaRequest(
    @NotBlank @Size(max = 200) String nome,
    @NotBlank @Size(max = 50) String sigla,
    @Size(max = 2000) String descricao,
    @Size(max = 500) String logo,
    @NotNull UUID faculdadeId,
    @NotNull EntityStatus status
) {
}
