package com.vibeU.backend.repository;

import com.vibeU.backend.entity.Atletica;
import com.vibeU.backend.enums.EntityStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AtleticaRepository extends JpaRepository<Atletica, UUID> {

    @EntityGraph(attributePaths = "faculdade")
    List<Atletica> findByStatusOrderByNomeAsc(EntityStatus status);

    @EntityGraph(attributePaths = "faculdade")
    List<Atletica> findByFaculdadeIdAndStatusOrderByNomeAsc(UUID faculdadeId, EntityStatus status);

    List<Atletica> findByIdInAndStatus(List<UUID> ids, EntityStatus status);

    @EntityGraph(attributePaths = "faculdade")
    List<Atletica> findAllByOrderByNomeAsc();

    long countByFaculdadeId(UUID faculdadeId);

    boolean existsBySiglaIgnoreCase(String sigla);

    boolean existsBySiglaIgnoreCaseAndIdNot(String sigla, UUID id);
}
