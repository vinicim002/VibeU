package com.vibeU.backend.controller;

import com.vibeU.backend.dto.response.ApiResponse;
import com.vibeU.backend.dto.response.FaculdadeResponse;
import com.vibeU.backend.service.FaculdadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/faculdades")
@RequiredArgsConstructor
public class FaculdadeController {

    private final FaculdadeService faculdadeService;

    @GetMapping
    public ApiResponse<List<FaculdadeResponse>> list() {
        return ApiResponse.success(faculdadeService.listActive());
    }

    @GetMapping("/{id}")
    public ApiResponse<FaculdadeResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(faculdadeService.findById(id));
    }
}
