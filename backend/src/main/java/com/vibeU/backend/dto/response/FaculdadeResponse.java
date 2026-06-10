package com.vibeU.backend.dto.response;

import com.vibeU.backend.enums.EntityStatus;

import java.util.UUID;

public record FaculdadeResponse(
    UUID id,
    String nome,
    String sigla,
    String cidade,
    String estado,
    String logo,
    EntityStatus status,
    Boolean featured
) {
}
