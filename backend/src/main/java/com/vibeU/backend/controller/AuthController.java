package com.vibeU.backend.controller;

import com.vibeU.backend.dto.request.LoginRequest;
import com.vibeU.backend.dto.request.RegisterRequest;
import com.vibeU.backend.dto.response.ApiResponse;
import com.vibeU.backend.dto.response.LoginResponse;
import com.vibeU.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success("Cadastro realizado com sucesso", authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success("Login realizado com sucesso", authService.login(request));
    }
}
