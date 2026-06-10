package com.vibeU.backend.controller;

import com.vibeU.backend.dto.response.ApiResponse;
import com.vibeU.backend.dto.response.EventDetailResponse;
import com.vibeU.backend.dto.response.EventResponse;
import com.vibeU.backend.enums.EventCategory;
import com.vibeU.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class PublicEventController {

    private final EventService eventService;

    @GetMapping
    public ApiResponse<List<EventResponse>> list(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) EventCategory category,
        @RequestParam(required = false) UUID faculdadeId,
        @RequestParam(required = false) UUID atleticaId
    ) {
        return ApiResponse.success(eventService.listPublic(search, category, faculdadeId, atleticaId));
    }

    @GetMapping("/{id}")
    public ApiResponse<EventDetailResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(eventService.findPublicById(id));
    }
}
