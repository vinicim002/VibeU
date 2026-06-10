package com.vibeU.backend.controller.admin;

import com.vibeU.backend.dto.request.CreateOrganizerRequest;
import com.vibeU.backend.dto.request.UpdateOrganizerRequest;
import com.vibeU.backend.dto.request.UpdateOrganizerStatusRequest;
import com.vibeU.backend.dto.response.ApiResponse;
import com.vibeU.backend.dto.response.OrganizerResponse;
import com.vibeU.backend.enums.EntityStatus;
import com.vibeU.backend.service.OrganizerService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/organizers")
@PreAuthorize("hasRole('ADMINISTRADOR')")
@RequiredArgsConstructor
public class AdminOrganizerController {

    private final OrganizerService organizerService;

    @PostMapping
    public ApiResponse<OrganizerResponse> create(@Valid @RequestBody CreateOrganizerRequest request) {
        return ApiResponse.success("Organizador criado com sucesso", organizerService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<OrganizerResponse> update(
        @PathVariable UUID id,
        @Valid @RequestBody UpdateOrganizerRequest request
    ) {
        return ApiResponse.success("Organizador atualizado com sucesso", organizerService.update(id, request));
    }

    @GetMapping
    public ApiResponse<List<OrganizerResponse>> list(@RequestParam(required = false) EntityStatus status) {
        return ApiResponse.success(organizerService.list(status));
    }

    @GetMapping("/{id}")
    public ApiResponse<OrganizerResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(organizerService.findById(id));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<OrganizerResponse> updateStatus(
        @PathVariable UUID id,
        @Valid @RequestBody UpdateOrganizerStatusRequest request
    ) {
        return ApiResponse.success("Status do organizador atualizado", organizerService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        organizerService.delete(id);
    }
}
