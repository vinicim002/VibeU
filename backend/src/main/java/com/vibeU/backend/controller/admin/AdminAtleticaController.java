package com.vibeU.backend.controller.admin;

import com.vibeU.backend.dto.request.AtleticaRequest;
import com.vibeU.backend.dto.request.UpdateEntityStatusRequest;
import com.vibeU.backend.dto.request.UpdateFeaturedRequest;
import com.vibeU.backend.dto.response.ApiResponse;
import com.vibeU.backend.dto.response.AtleticaResponse;
import com.vibeU.backend.service.AtleticaService;
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
@RequestMapping("/api/v1/admin/atleticas")
@PreAuthorize("hasRole('ADMINISTRADOR')")
@RequiredArgsConstructor
public class AdminAtleticaController {

    private final AtleticaService atleticaService;

    @GetMapping
    public ApiResponse<List<AtleticaResponse>> list() {
        return ApiResponse.success(atleticaService.listAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<AtleticaResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(atleticaService.findByIdAdmin(id));
    }

    @PostMapping
    public ApiResponse<AtleticaResponse> create(@Valid @RequestBody AtleticaRequest request) {
        return ApiResponse.success("Atlética criada com sucesso", atleticaService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<AtleticaResponse> update(
        @PathVariable UUID id,
        @Valid @RequestBody AtleticaRequest request
    ) {
        return ApiResponse.success("Atlética atualizada com sucesso", atleticaService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        atleticaService.delete(id);
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<AtleticaResponse> updateStatus(
        @PathVariable UUID id,
        @Valid @RequestBody UpdateEntityStatusRequest request
    ) {
        return ApiResponse.success("Status da atlética atualizado", atleticaService.updateStatus(id, request));
    }

    @PatchMapping("/{id}/featured")
    public ApiResponse<AtleticaResponse> updateFeatured(
        @PathVariable UUID id,
        @Valid @RequestBody UpdateFeaturedRequest request
    ) {
        return ApiResponse.success("Destaque da atlética atualizado", atleticaService.updateFeatured(id, request));
    }
}
