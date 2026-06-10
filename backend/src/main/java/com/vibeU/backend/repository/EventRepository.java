package com.vibeU.backend.repository;

import com.vibeU.backend.entity.Event;
import com.vibeU.backend.enums.EventStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {

    @EntityGraph(attributePaths = {"organizer", "lots", "scheduleItems", "rules", "faculdades", "atleticas"})
    Optional<Event> findWithDetailsById(UUID id);

    @EntityGraph(attributePaths = {"organizer", "lots"})
    List<Event> findByOrganizerIdOrderByCreatedAtDesc(UUID organizerId);

    @EntityGraph(attributePaths = {"organizer", "lots"})
    List<Event> findAllByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"organizer", "lots"})
    List<Event> findByStatusOrderByCreatedAtDesc(EventStatus status);

    @EntityGraph(attributePaths = {"organizer", "lots", "scheduleItems", "rules", "faculdades", "atleticas"})
    List<Event> findByStatusOrderByEventDateAsc(EventStatus status);

    Optional<Event> findByIdAndOrganizerId(UUID id, UUID organizerId);

    long countByOrganizerId(UUID organizerId);

    long countByStatus(EventStatus status);

    @org.springframework.data.jpa.repository.Query(
        "SELECT COUNT(e) > 0 FROM Event e JOIN e.faculdades f WHERE f.id = :faculdadeId"
    )
    boolean existsByFaculdadeId(UUID faculdadeId);

    @org.springframework.data.jpa.repository.Query(
        "SELECT COUNT(e) > 0 FROM Event e JOIN e.atleticas a WHERE a.id = :atleticaId"
    )
    boolean existsByAtleticaId(UUID atleticaId);
}
