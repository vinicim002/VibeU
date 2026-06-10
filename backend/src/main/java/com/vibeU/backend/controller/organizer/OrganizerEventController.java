package com.vibeU.backend.controller.organizer;

import com.vibeU.backend.dto.request.EventRequest;
import com.vibeU.backend.dto.response.ApiResponse;
import com.vibeU.backend.dto.response.EventResponse;
import com.vibeU.backend.security.SecurityUtils;
import com.vibeU.backend.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/organizer/events")
@PreAuthorize("hasRole('ORGANIZADOR')")
@RequiredArgsConstructor
public class OrganizerEventController {

    private final EventService eventService;

    @PostMapping
    public ApiResponse<EventResponse> create(@Valid @RequestBody EventRequest request) {
        UUID organizerId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success("Evento criado com sucesso", eventService.create(request, organizerId));
    }

    @PutMapping("/{id}")
    public ApiResponse<EventResponse> update(
        @PathVariable UUID id,
        @Valid @RequestBody EventRequest request
    ) {
        UUID organizerId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success("Evento atualizado com sucesso", eventService.update(id, request, organizerId));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        UUID organizerId = SecurityUtils.getCurrentUserId();
        eventService.delete(id, organizerId);
    }

    @GetMapping
    public ApiResponse<List<EventResponse>> list() {
        UUID organizerId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(eventService.listByOrganizer(organizerId));
    }

    @GetMapping("/{id}")
    public ApiResponse<EventResponse> findById(@PathVariable UUID id) {
        UUID organizerId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(eventService.findByIdForOrganizer(id, organizerId));
    }

    @PatchMapping("/{id}/publish")
    public ApiResponse<EventResponse> publish(@PathVariable UUID id) {
        UUID organizerId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success("Evento publicado com sucesso", eventService.publish(id, organizerId));
    }

    @PatchMapping("/{id}/cancel")
    public ApiResponse<EventResponse> cancel(@PathVariable UUID id) {
        UUID organizerId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success("Evento cancelado com sucesso", eventService.cancel(id, organizerId));
    }
}
