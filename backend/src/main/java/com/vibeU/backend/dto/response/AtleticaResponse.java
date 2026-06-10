package com.vibeU.backend.dto.response;

import com.vibeU.backend.enums.EntityStatus;

import java.util.UUID;

public record AtleticaResponse(
    UUID id,
    String nome,
    String sigla,
    String logo,
    String descricao,
    UUID faculdadeId,
    EntityStatus status,
    Boolean featured
) {
}
