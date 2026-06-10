package com.vibeU.backend.controller;

import com.vibeU.backend.dto.response.ApiResponse;
import com.vibeU.backend.dto.response.AtleticaResponse;
import com.vibeU.backend.service.AtleticaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/atleticas")
@RequiredArgsConstructor
public class AtleticaController {

    private final AtleticaService atleticaService;

    @GetMapping
    public ApiResponse<List<AtleticaResponse>> list(@RequestParam(required = false) UUID faculdadeId) {
        return ApiResponse.success(atleticaService.listActive(faculdadeId));
    }

    @GetMapping("/{id}")
    public ApiResponse<AtleticaResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(atleticaService.findById(id));
    }
}
