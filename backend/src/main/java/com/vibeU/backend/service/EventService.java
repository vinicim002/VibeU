package com.vibeU.backend.service;

import com.vibeU.backend.dto.request.EventRequest;
import com.vibeU.backend.dto.request.LotRequest;
import com.vibeU.backend.dto.request.ScheduleItemRequest;
import com.vibeU.backend.dto.response.EventDetailResponse;
import com.vibeU.backend.dto.response.EventResponse;
import com.vibeU.backend.enums.EventCategory;
import com.vibeU.backend.entity.Atletica;
import com.vibeU.backend.entity.Event;
import com.vibeU.backend.entity.EventLot;
import com.vibeU.backend.entity.EventRule;
import com.vibeU.backend.entity.EventScheduleItem;
import com.vibeU.backend.entity.Faculdade;
import com.vibeU.backend.entity.User;
import com.vibeU.backend.enums.EntityStatus;
import com.vibeU.backend.enums.EventStatus;
import com.vibeU.backend.enums.UserRole;
import com.vibeU.backend.exception.BusinessException;
import com.vibeU.backend.exception.ResourceNotFoundException;
import com.vibeU.backend.mapper.EventMapper;
import com.vibeU.backend.repository.AtleticaRepository;
import com.vibeU.backend.repository.EventRepository;
import com.vibeU.backend.repository.FaculdadeRepository;
import com.vibeU.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final FaculdadeRepository faculdadeRepository;
    private final AtleticaRepository atleticaRepository;
    private final EventMapper eventMapper;

    @Transactional
    public EventResponse create(EventRequest request, UUID organizerId) {
        User organizer = findActiveOrganizer(organizerId);
        validateFutureDate(request.date());

        Event event = buildEvent(request, organizer);
        return eventMapper.toResponse(eventRepository.save(event));
    }

    @Transactional
    public EventResponse update(UUID eventId, EventRequest request, UUID organizerId) {
        Event event = findOwnedEvent(eventId, organizerId);
        validateEditable(event);
        validateFutureDate(request.date());

        applyEventData(event, request);
        return eventMapper.toResponse(eventRepository.save(event));
    }

    @Transactional
    public void delete(UUID eventId, UUID organizerId) {
        Event event = findOwnedEvent(eventId, organizerId);

        if (event.getStatus() != EventStatus.RASCUNHO) {
            throw new BusinessException("Apenas eventos em rascunho podem ser excluídos", HttpStatus.CONFLICT);
        }

        eventRepository.delete(event);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> listByOrganizer(UUID organizerId) {
        return eventMapper.toResponseList(eventRepository.findByOrganizerIdOrderByCreatedAtDesc(organizerId));
    }

    @Transactional(readOnly = true)
    public EventResponse findByIdForOrganizer(UUID eventId, UUID organizerId) {
        Event event = findOwnedEventWithDetails(eventId, organizerId);
        return eventMapper.toResponse(event);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> listAll() {
        return eventMapper.toResponseList(eventRepository.findAllByOrderByCreatedAtDesc());
    }

    @Transactional(readOnly = true)
    public EventResponse findById(UUID eventId) {
        Event event = eventRepository.findWithDetailsById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado"));
        return eventMapper.toResponse(event);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> listPublic(String search, EventCategory category, UUID faculdadeId, UUID atleticaId) {
        List<Event> events = eventRepository.findByStatusOrderByEventDateAsc(EventStatus.PUBLICADO);
        return eventMapper.toResponseList(events.stream()
            .filter(e -> matchesPublicFilters(e, search, category, faculdadeId, atleticaId))
            .toList());
    }

    @Transactional(readOnly = true)
    public EventDetailResponse findPublicById(UUID eventId) {
        Event event = eventRepository.findWithDetailsById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado"));

        if (event.getStatus() != EventStatus.PUBLICADO) {
            throw new ResourceNotFoundException("Evento não encontrado");
        }

        return eventMapper.toDetailResponse(event);
    }

    @Transactional
    public EventResponse publish(UUID eventId, UUID organizerId) {
        Event event = findOwnedEvent(eventId, organizerId);

        if (event.getStatus() != EventStatus.RASCUNHO) {
            throw new BusinessException("Apenas eventos em rascunho podem ser publicados", HttpStatus.CONFLICT);
        }

        event.setStatus(EventStatus.PUBLICADO);
        return eventMapper.toResponse(eventRepository.save(event));
    }

    @Transactional
    public EventResponse cancel(UUID eventId, UUID organizerId) {
        Event event = findOwnedEvent(eventId, organizerId);

        if (event.getStatus() != EventStatus.PUBLICADO) {
            throw new BusinessException("Apenas eventos publicados podem ser cancelados", HttpStatus.CONFLICT);
        }

        event.setStatus(EventStatus.CANCELADO);
        return eventMapper.toResponse(eventRepository.save(event));
    }

    @Transactional
    public EventResponse updateFeatured(UUID eventId, boolean featured) {
        Event event = eventRepository.findWithDetailsById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado"));
        event.setFeatured(featured);
        return eventMapper.toResponse(eventRepository.save(event));
    }

    @Transactional
    public EventResponse updatePopular(UUID eventId, boolean popular) {
        Event event = eventRepository.findWithDetailsById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado"));
        event.setPopular(popular);
        return eventMapper.toResponse(eventRepository.save(event));
    }

    private boolean matchesPublicFilters(
        Event event,
        String search,
        EventCategory category,
        UUID faculdadeId,
        UUID atleticaId
    ) {
        if (category != null && event.getCategory() != category) {
            return false;
        }
        if (faculdadeId != null && event.getFaculdades().stream().noneMatch(f -> f.getId().equals(faculdadeId))) {
            return false;
        }
        if (atleticaId != null && event.getAtleticas().stream().noneMatch(a -> a.getId().equals(atleticaId))) {
            return false;
        }
        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            return event.getName().toLowerCase().contains(q)
                || event.getDescription().toLowerCase().contains(q)
                || event.getLocation().toLowerCase().contains(q)
                || event.getCidade().toLowerCase().contains(q);
        }
        return true;
    }

    private User findActiveOrganizer(UUID organizerId) {
        User organizer = userRepository.findById(organizerId)
            .orElseThrow(() -> new ResourceNotFoundException("Organizador não encontrado"));

        if (organizer.getRole() != UserRole.ORGANIZADOR) {
            throw new BusinessException("Usuário não é organizador", HttpStatus.FORBIDDEN);
        }

        if (organizer.getStatus() != EntityStatus.ATIVO) {
            throw new BusinessException("Organizador inativo", HttpStatus.FORBIDDEN);
        }

        return organizer;
    }

    private Event findOwnedEvent(UUID eventId, UUID organizerId) {
        return eventRepository.findByIdAndOrganizerId(eventId, organizerId)
            .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado"));
    }

    private Event findOwnedEventWithDetails(UUID eventId, UUID organizerId) {
        Event event = eventRepository.findWithDetailsById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado"));

        if (!event.getOrganizer().getId().equals(organizerId)) {
            throw new ResourceNotFoundException("Evento não encontrado");
        }

        return event;
    }

    private void validateEditable(Event event) {
        if (event.getStatus() == EventStatus.CANCELADO || event.getStatus() == EventStatus.ENCERRADO) {
            throw new BusinessException("Evento não pode ser editado", HttpStatus.CONFLICT);
        }
    }

    private void validateFutureDate(LocalDate date) {
        if (date.isBefore(LocalDate.now())) {
            throw new BusinessException("Não é permitido cadastrar eventos em datas passadas");
        }
    }

    private Event buildEvent(EventRequest request, User organizer) {
        Event event = Event.builder()
            .organizer(organizer)
            .status(EventStatus.RASCUNHO)
            .featured(false)
            .popular(false)
            .popularityScore(0)
            .build();

        applyEventData(event, request);
        return event;
    }

    private void applyEventData(Event event, EventRequest request) {
        event.setName(request.name());
        event.setDescription(request.description());
        event.setCategory(request.category());
        event.setBannerUrl(request.bannerUrl());
        event.setEventDate(request.date());
        event.setStartTime(LocalTime.parse(request.time()));
        event.setEndTime(request.endTime() != null && !request.endTime().isBlank()
            ? LocalTime.parse(request.endTime()) : null);
        event.setLocation(request.location());
        event.setAddress(request.address());
        event.setCidade(request.cidade());
        event.setEstado(request.estado().toUpperCase());
        event.setCapacity(request.capacity());
        event.setFaculdades(new HashSet<>(resolveFaculdades(request.faculdadeIds())));
        event.setAtleticas(new HashSet<>(resolveAtleticas(request.atleticaIds())));

        replaceLots(event, request.lots(), request.date());
        replaceSchedule(event, request.scheduleItems());
        replaceRules(event, request.rules());
    }

    private List<Faculdade> resolveFaculdades(List<UUID> ids) {
        List<Faculdade> faculdades = faculdadeRepository.findByIdInAndStatus(ids, EntityStatus.ATIVO);
        if (faculdades.size() != ids.size()) {
            throw new BusinessException("Uma ou mais faculdades são inválidas ou inativas");
        }
        return faculdades;
    }

    private List<Atletica> resolveAtleticas(List<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }

        List<Atletica> atleticas = atleticaRepository.findByIdInAndStatus(ids, EntityStatus.ATIVO);
        if (atleticas.size() != ids.size()) {
            throw new BusinessException("Uma ou mais atléticas são inválidas ou inativas");
        }
        return atleticas;
    }

    private void replaceLots(Event event, List<LotRequest> lots, LocalDate eventDate) {
        event.getLots().clear();

        for (LotRequest lotRequest : lots) {
            EventLot lot = EventLot.builder()
                .event(event)
                .name(lotRequest.name())
                .price(lotRequest.price())
                .quantity(lotRequest.quantity())
                .sold(0)
                .startsAt(eventDate)
                .endsAt(eventDate)
                .build();
            event.getLots().add(lot);
        }
    }

    private void replaceSchedule(Event event, List<ScheduleItemRequest> items) {
        event.getScheduleItems().clear();

        if (items == null) {
            return;
        }

        int order = 0;
        for (ScheduleItemRequest item : items) {
            EventScheduleItem scheduleItem = EventScheduleItem.builder()
                .event(event)
                .time(item.parsedTime())
                .title(item.title())
                .description(item.description())
                .sortOrder(order++)
                .build();
            event.getScheduleItems().add(scheduleItem);
        }
    }

    private void replaceRules(Event event, List<String> rules) {
        event.getRules().clear();

        if (rules == null) {
            return;
        }

        int order = 0;
        for (String rule : rules) {
            if (rule == null || rule.isBlank()) {
                continue;
            }
            EventRule eventRule = EventRule.builder()
                .event(event)
                .ruleText(rule.trim())
                .sortOrder(order++)
                .build();
            event.getRules().add(eventRule);
        }
    }
}
