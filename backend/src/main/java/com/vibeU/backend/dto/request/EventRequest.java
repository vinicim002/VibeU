package com.vibeU.backend.dto.request;

import com.vibeU.backend.enums.EventCategory;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record EventRequest(
    @NotBlank @Size(min = 3, max = 200) String name,
    @NotBlank @Size(min = 10) String description,
    @NotNull EventCategory category,
    @NotBlank String bannerUrl,
    @NotNull LocalDate date,
    @NotBlank String time,
    String endTime,
    @NotBlank @Size(min = 3, max = 200) String location,
    @NotBlank @Size(min = 5, max = 300) String address,
    @NotBlank @Size(min = 2, max = 100) String cidade,
    @NotBlank @Size(min = 2, max = 2) String estado,
    @NotNull @Min(1) Integer capacity,
    @NotEmpty List<UUID> faculdadeIds,
    List<UUID> atleticaIds,
    List<String> rules,
    @NotEmpty @Valid List<LotRequest> lots,
    @Valid List<ScheduleItemRequest> scheduleItems
) {
}
