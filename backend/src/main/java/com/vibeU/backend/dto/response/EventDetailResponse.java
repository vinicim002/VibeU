package com.vibeU.backend.dto.response;

import java.util.List;

public record EventDetailResponse(
    EventResponse event,
    List<FaculdadeResponse> faculdades,
    List<AtleticaResponse> atleticas
) {
}
