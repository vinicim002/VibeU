package com.vibeU.backend.dto.response;

import com.vibeU.backend.enums.EventCategory;
import com.vibeU.backend.enums.EventStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record EventResponse(
    UUID id,
    String name,
    String description,
    EventCategory category,
    String bannerUrl,
    LocalDate date,
    String time,
    String endTime,
    String location,
    String address,
    String cidade,
    String estado,
    Integer capacity,
    UUID organizerId,
    String organizerName,
    EventStatus status,
    List<UUID> faculdadeIds,
    List<UUID> atleticaIds,
    List<LotResponse> lots,
    List<ScheduleItemResponse> schedule,
    List<String> rules,
    Boolean featured,
    Boolean popular,
    Integer popularityScore,
    Instant createdAt
) {
}
