package com.vibeU.backend.mapper;

import com.vibeU.backend.dto.response.FaculdadeResponse;
import com.vibeU.backend.entity.Faculdade;
import org.springframework.stereotype.Component;

@Component
public class FaculdadeMapper {

    public FaculdadeResponse toResponse(Faculdade faculdade) {
        return new FaculdadeResponse(
            faculdade.getId(),
            faculdade.getNome(),
            faculdade.getSigla(),
            faculdade.getCidade(),
            faculdade.getEstado(),
            faculdade.getLogo(),
            faculdade.getStatus(),
            faculdade.getFeatured()
        );
    }
}
