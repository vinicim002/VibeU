package com.vibeU.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalTime;

public record ScheduleItemRequest(
    @NotBlank String time,
    @NotBlank String title,
    String description
) {
    public LocalTime parsedTime() {
        return LocalTime.parse(time);
    }
}
