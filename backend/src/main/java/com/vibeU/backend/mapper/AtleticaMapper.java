package com.vibeU.backend.mapper;

import com.vibeU.backend.dto.response.AtleticaResponse;
import com.vibeU.backend.entity.Atletica;
import org.springframework.stereotype.Component;

@Component
public class AtleticaMapper {

    public AtleticaResponse toResponse(Atletica atletica) {
        return new AtleticaResponse(
            atletica.getId(),
            atletica.getNome(),
            atletica.getSigla(),
            atletica.getLogo(),
            atletica.getDescricao(),
            atletica.getFaculdade().getId(),
            atletica.getStatus(),
            atletica.getFeatured()
        );
    }
}
