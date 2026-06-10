package com.vibeU.backend.controller.admin;

import com.vibeU.backend.dto.request.FaculdadeRequest;
import com.vibeU.backend.dto.request.UpdateEntityStatusRequest;
import com.vibeU.backend.dto.request.UpdateFeaturedRequest;
import com.vibeU.backend.dto.response.ApiResponse;
import com.vibeU.backend.dto.response.FaculdadeResponse;
import com.vibeU.backend.service.FaculdadeService;
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
@RequestMapping("/api/v1/admin/faculdades")
@PreAuthorize("hasRole('ADMINISTRADOR')")
@RequiredArgsConstructor
public class AdminFaculdadeController {

    private final FaculdadeService faculdadeService;

    @GetMapping
    public ApiResponse<List<FaculdadeResponse>> list() {
        return ApiResponse.success(faculdadeService.listAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<FaculdadeResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(faculdadeService.findByIdAdmin(id));
    }

    @PostMapping
    public ApiResponse<FaculdadeResponse> create(@Valid @RequestBody FaculdadeRequest request) {
        return ApiResponse.success("Faculdade criada com sucesso", faculdadeService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<FaculdadeResponse> update(
        @PathVariable UUID id,
        @Valid @RequestBody FaculdadeRequest request
    ) {
        return ApiResponse.success("Faculdade atualizada com sucesso", faculdadeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        faculdadeService.delete(id);
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<FaculdadeResponse> updateStatus(
        @PathVariable UUID id,
        @Valid @RequestBody UpdateEntityStatusRequest request
    ) {
        return ApiResponse.success("Status da faculdade atualizado", faculdadeService.updateStatus(id, request));
    }

    @PatchMapping("/{id}/featured")
    public ApiResponse<FaculdadeResponse> updateFeatured(
        @PathVariable UUID id,
        @Valid @RequestBody UpdateFeaturedRequest request
    ) {
        return ApiResponse.success("Destaque da faculdade atualizado", faculdadeService.updateFeatured(id, request));
    }
}
