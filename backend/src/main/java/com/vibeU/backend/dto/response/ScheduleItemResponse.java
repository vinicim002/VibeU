package com.vibeU.backend.dto.response;

import java.util.UUID;

public record ScheduleItemResponse(
    UUID id,
    String time,
    String title,
    String description
) {
}
