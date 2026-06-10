package com.vibeU.backend.controller.admin;

import com.vibeU.backend.dto.request.UpdateFeaturedRequest;
import com.vibeU.backend.dto.request.UpdatePopularRequest;
import com.vibeU.backend.dto.response.ApiResponse;
import com.vibeU.backend.dto.response.EventResponse;
import com.vibeU.backend.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/events")
@PreAuthorize("hasRole('ADMINISTRADOR')")
@RequiredArgsConstructor
public class AdminEventController {

    private final EventService eventService;

    @GetMapping
    public ApiResponse<List<EventResponse>> list() {
        return ApiResponse.success(eventService.listAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<EventResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(eventService.findById(id));
    }

    @PatchMapping("/{id}/featured")
    public ApiResponse<EventResponse> updateFeatured(
        @PathVariable UUID id,
        @Valid @RequestBody UpdateFeaturedRequest request
    ) {
        return ApiResponse.success(
            "Destaque do evento atualizado",
            eventService.updateFeatured(id, request.featured())
        );
    }

    @PatchMapping("/{id}/popular")
    public ApiResponse<EventResponse> updatePopular(
        @PathVariable UUID id,
        @Valid @RequestBody UpdatePopularRequest request
    ) {
        return ApiResponse.success(
            "Popularidade do evento atualizada",
            eventService.updatePopular(id, request.popular())
        );
    }
}
