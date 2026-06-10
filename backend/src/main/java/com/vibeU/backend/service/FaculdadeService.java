package com.vibeU.backend.service;

import com.vibeU.backend.dto.request.FaculdadeRequest;
import com.vibeU.backend.dto.request.UpdateEntityStatusRequest;
import com.vibeU.backend.dto.request.UpdateFeaturedRequest;
import com.vibeU.backend.dto.response.FaculdadeResponse;
import com.vibeU.backend.enums.EntityStatus;
import com.vibeU.backend.exception.BusinessException;
import com.vibeU.backend.exception.ResourceNotFoundException;
import com.vibeU.backend.entity.Faculdade;
import com.vibeU.backend.mapper.FaculdadeMapper;
import com.vibeU.backend.repository.AtleticaRepository;
import com.vibeU.backend.repository.EventRepository;
import com.vibeU.backend.repository.FaculdadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FaculdadeService {

    private final FaculdadeRepository faculdadeRepository;
    private final AtleticaRepository atleticaRepository;
    private final EventRepository eventRepository;
    private final FaculdadeMapper faculdadeMapper;

    @Transactional(readOnly = true)
    public List<FaculdadeResponse> listActive() {
        return faculdadeRepository.findByStatusOrderBySiglaAsc(EntityStatus.ATIVO)
            .stream()
            .map(faculdadeMapper::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<FaculdadeResponse> listAll() {
        return faculdadeRepository.findAllByOrderBySiglaAsc()
            .stream()
            .map(faculdadeMapper::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public FaculdadeResponse findById(UUID id) {
        return faculdadeRepository.findById(id)
            .filter(f -> f.getStatus() == EntityStatus.ATIVO)
            .map(faculdadeMapper::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Faculdade não encontrada"));
    }

    @Transactional(readOnly = true)
    public FaculdadeResponse findByIdAdmin(UUID id) {
        return faculdadeRepository.findById(id)
            .map(faculdadeMapper::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Faculdade não encontrada"));
    }

    @Transactional
    public FaculdadeResponse create(FaculdadeRequest request) {
        validateUniqueSigla(request.sigla(), null);

        Faculdade faculdade = Faculdade.builder()
            .nome(request.nome().trim())
            .sigla(request.sigla().trim().toUpperCase())
            .cidade(request.cidade().trim())
            .estado(request.estado().trim().toUpperCase())
            .logo(request.logo())
            .status(request.status())
            .featured(false)
            .build();

        return faculdadeMapper.toResponse(faculdadeRepository.save(faculdade));
    }

    @Transactional
    public FaculdadeResponse update(UUID id, FaculdadeRequest request) {
        Faculdade faculdade = findEntity(id);
        validateUniqueSigla(request.sigla(), id);

        faculdade.setNome(request.nome().trim());
        faculdade.setSigla(request.sigla().trim().toUpperCase());
        faculdade.setCidade(request.cidade().trim());
        faculdade.setEstado(request.estado().trim().toUpperCase());
        faculdade.setLogo(request.logo());
        faculdade.setStatus(request.status());

        return faculdadeMapper.toResponse(faculdadeRepository.save(faculdade));
    }

    @Transactional
    public void delete(UUID id) {
        Faculdade faculdade = findEntity(id);

        if (atleticaRepository.countByFaculdadeId(id) > 0) {
            throw new BusinessException(
                "Não é possível excluir faculdade com atléticas vinculadas",
                HttpStatus.CONFLICT
            );
        }

        if (eventRepository.existsByFaculdadeId(id)) {
            throw new BusinessException(
                "Não é possível excluir faculdade com eventos vinculados",
                HttpStatus.CONFLICT
            );
        }

        faculdadeRepository.delete(faculdade);
    }

    @Transactional
    public FaculdadeResponse updateStatus(UUID id, UpdateEntityStatusRequest request) {
        Faculdade faculdade = findEntity(id);
        faculdade.setStatus(request.status());
        return faculdadeMapper.toResponse(faculdadeRepository.save(faculdade));
    }

    @Transactional
    public FaculdadeResponse updateFeatured(UUID id, UpdateFeaturedRequest request) {
        Faculdade faculdade = findEntity(id);
        faculdade.setFeatured(request.featured());
        return faculdadeMapper.toResponse(faculdadeRepository.save(faculdade));
    }

    private Faculdade findEntity(UUID id) {
        return faculdadeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Faculdade não encontrada"));
    }

    private void validateUniqueSigla(String sigla, UUID excludeId) {
        boolean exists = excludeId == null
            ? faculdadeRepository.existsBySiglaIgnoreCase(sigla.trim())
            : faculdadeRepository.existsBySiglaIgnoreCaseAndIdNot(sigla.trim(), excludeId);

        if (exists) {
            throw new BusinessException("Já existe uma faculdade com esta sigla", HttpStatus.CONFLICT);
        }
    }
}
