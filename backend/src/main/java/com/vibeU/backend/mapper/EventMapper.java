package com.vibeU.backend.mapper;

import com.vibeU.backend.dto.response.EventDetailResponse;
import com.vibeU.backend.dto.response.EventResponse;
import com.vibeU.backend.dto.response.LotResponse;
import com.vibeU.backend.dto.response.ScheduleItemResponse;
import com.vibeU.backend.entity.Event;
import com.vibeU.backend.entity.EventLot;
import com.vibeU.backend.entity.EventRule;
import com.vibeU.backend.entity.EventScheduleItem;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@lombok.RequiredArgsConstructor
public class EventMapper {

    private final FaculdadeMapper faculdadeMapper;
    private final AtleticaMapper atleticaMapper;

    public EventResponse toResponse(Event event) {
        return new EventResponse(
            event.getId(),
            event.getName(),
            event.getDescription(),
            event.getCategory(),
            event.getBannerUrl(),
            event.getEventDate(),
            event.getStartTime().toString(),
            event.getEndTime() != null ? event.getEndTime().toString() : null,
            event.getLocation(),
            event.getAddress(),
            event.getCidade(),
            event.getEstado(),
            event.getCapacity(),
            event.getOrganizer().getId(),
            event.getOrganizer().getName(),
            event.getStatus(),
            event.getFaculdades().stream().map(f -> f.getId()).toList(),
            event.getAtleticas().stream().map(a -> a.getId()).toList(),
            event.getLots().stream().map(this::toLotResponse).toList(),
            event.getScheduleItems().stream().map(this::toScheduleResponse).toList(),
            event.getRules().stream().map(EventRule::getRuleText).toList(),
            event.getFeatured(),
            event.getPopular(),
            event.getPopularityScore(),
            event.getCreatedAt()
        );
    }

    public List<EventResponse> toResponseList(List<Event> events) {
        return events.stream().map(this::toResponse).toList();
    }

    public EventDetailResponse toDetailResponse(Event event) {
        return new EventDetailResponse(
            toResponse(event),
            event.getFaculdades().stream().map(faculdadeMapper::toResponse).toList(),
            event.getAtleticas().stream().map(atleticaMapper::toResponse).toList()
        );
    }

    private LotResponse toLotResponse(EventLot lot) {
        return new LotResponse(
            lot.getId(),
            lot.getName(),
            lot.getPrice(),
            lot.getQuantity(),
            lot.getSold(),
            lot.getStartsAt(),
            lot.getEndsAt()
        );
    }

    private ScheduleItemResponse toScheduleResponse(EventScheduleItem item) {
        return new ScheduleItemResponse(
            item.getId(),
            item.getTime().toString(),
            item.getTitle(),
            item.getDescription()
        );
    }
}
