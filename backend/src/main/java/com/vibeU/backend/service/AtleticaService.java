package com.vibeU.backend.service;

import com.vibeU.backend.dto.request.AtleticaRequest;
import com.vibeU.backend.dto.request.UpdateEntityStatusRequest;
import com.vibeU.backend.dto.request.UpdateFeaturedRequest;
import com.vibeU.backend.dto.response.AtleticaResponse;
import com.vibeU.backend.entity.Atletica;
import com.vibeU.backend.entity.Faculdade;
import com.vibeU.backend.enums.EntityStatus;
import com.vibeU.backend.exception.BusinessException;
import com.vibeU.backend.exception.ResourceNotFoundException;
import com.vibeU.backend.mapper.AtleticaMapper;
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
public class AtleticaService {

    private final AtleticaRepository atleticaRepository;
    private final FaculdadeRepository faculdadeRepository;
    private final EventRepository eventRepository;
    private final AtleticaMapper atleticaMapper;

    @Transactional(readOnly = true)
    public List<AtleticaResponse> listActive(UUID faculdadeId) {
        List<Atletica> atleticas = faculdadeId != null
            ? atleticaRepository.findByFaculdadeIdAndStatusOrderByNomeAsc(faculdadeId, EntityStatus.ATIVO)
            : atleticaRepository.findByStatusOrderByNomeAsc(EntityStatus.ATIVO);

        return atleticas.stream().map(atleticaMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<AtleticaResponse> listAll() {
        return atleticaRepository.findAllByOrderByNomeAsc()
            .stream()
            .map(atleticaMapper::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public AtleticaResponse findById(UUID id) {
        return atleticaRepository.findById(id)
            .filter(a -> a.getStatus() == EntityStatus.ATIVO)
            .map(atleticaMapper::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Atlética não encontrada"));
    }

    @Transactional(readOnly = true)
    public AtleticaResponse findByIdAdmin(UUID id) {
        return atleticaRepository.findById(id)
            .map(atleticaMapper::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Atlética não encontrada"));
    }

    @Transactional
    public AtleticaResponse create(AtleticaRequest request) {
        validateUniqueSigla(request.sigla(), null);
        Faculdade faculdade = resolveFaculdade(request.faculdadeId());

        Atletica atletica = Atletica.builder()
            .nome(request.nome().trim())
            .sigla(request.sigla().trim().toUpperCase())
            .descricao(request.descricao())
            .logo(request.logo())
            .faculdade(faculdade)
            .status(request.status())
            .featured(false)
            .build();

        return atleticaMapper.toResponse(atleticaRepository.save(atletica));
    }

    @Transactional
    public AtleticaResponse update(UUID id, AtleticaRequest request) {
        Atletica atletica = findEntity(id);
        validateUniqueSigla(request.sigla(), id);
        Faculdade faculdade = resolveFaculdade(request.faculdadeId());

        atletica.setNome(request.nome().trim());
        atletica.setSigla(request.sigla().trim().toUpperCase());
        atletica.setDescricao(request.descricao());
        atletica.setLogo(request.logo());
        atletica.setFaculdade(faculdade);
        atletica.setStatus(request.status());

        return atleticaMapper.toResponse(atleticaRepository.save(atletica));
    }

    @Transactional
    public void delete(UUID id) {
        Atletica atletica = findEntity(id);

        if (eventRepository.existsByAtleticaId(id)) {
            throw new BusinessException(
                "Não é possível excluir atlética com eventos vinculados",
                HttpStatus.CONFLICT
            );
        }

        atleticaRepository.delete(atletica);
    }

    @Transactional
    public AtleticaResponse updateStatus(UUID id, UpdateEntityStatusRequest request) {
        Atletica atletica = findEntity(id);
        atletica.setStatus(request.status());
        return atleticaMapper.toResponse(atleticaRepository.save(atletica));
    }

    @Transactional
    public AtleticaResponse updateFeatured(UUID id, UpdateFeaturedRequest request) {
        Atletica atletica = findEntity(id);
        atletica.setFeatured(request.featured());
        return atleticaMapper.toResponse(atleticaRepository.save(atletica));
    }

    private Atletica findEntity(UUID id) {
        return atleticaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Atlética não encontrada"));
    }

    private Faculdade resolveFaculdade(UUID faculdadeId) {
        return faculdadeRepository.findById(faculdadeId)
            .orElseThrow(() -> new BusinessException("Faculdade não encontrada"));
    }

    private void validateUniqueSigla(String sigla, UUID excludeId) {
        boolean exists = excludeId == null
            ? atleticaRepository.existsBySiglaIgnoreCase(sigla.trim())
            : atleticaRepository.existsBySiglaIgnoreCaseAndIdNot(sigla.trim(), excludeId);

        if (exists) {
            throw new BusinessException("Já existe uma atlética com esta sigla", HttpStatus.CONFLICT);
        }
    }
}
