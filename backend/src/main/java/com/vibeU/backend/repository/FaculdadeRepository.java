package com.vibeU.backend.repository;

import com.vibeU.backend.entity.Faculdade;
import com.vibeU.backend.enums.EntityStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FaculdadeRepository extends JpaRepository<Faculdade, UUID> {

    List<Faculdade> findByStatusOrderBySiglaAsc(EntityStatus status);

    List<Faculdade> findByIdInAndStatus(List<UUID> ids, EntityStatus status);

    List<Faculdade> findAllByOrderBySiglaAsc();

    boolean existsBySiglaIgnoreCase(String sigla);

    boolean existsBySiglaIgnoreCaseAndIdNot(String sigla, UUID id);
}
