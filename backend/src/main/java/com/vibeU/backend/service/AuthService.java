package com.vibeU.backend.service;

import com.vibeU.backend.dto.request.LoginRequest;
import com.vibeU.backend.dto.request.RegisterRequest;
import com.vibeU.backend.dto.response.LoginResponse;
import com.vibeU.backend.entity.User;
import com.vibeU.backend.enums.EntityStatus;
import com.vibeU.backend.enums.UserRole;
import com.vibeU.backend.exception.BusinessException;
import com.vibeU.backend.mapper.UserMapper;
import com.vibeU.backend.repository.UserRepository;
import com.vibeU.backend.security.JwtService;
import com.vibeU.backend.security.UserPrincipal;
import com.vibeU.backend.util.PasswordValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("E-mail já cadastrado", HttpStatus.CONFLICT);
        }

        PasswordValidator.validate(request.password());

        User user = User.builder()
            .name(request.name())
            .email(request.email())
            .passwordHash(passwordEncoder.encode(request.password()))
            .role(UserRole.PARTICIPANTE)
            .status(EntityStatus.ATIVO)
            .build();

        User saved = userRepository.save(user);
        UserPrincipal principal = new UserPrincipal(saved);
        String token = jwtService.generateToken(principal);

        return new LoginResponse(token, userMapper.toSessionUser(saved));
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new BadCredentialsException("E-mail ou senha incorretos"));

        if (user.getStatus() == EntityStatus.INATIVO) {
            throw new DisabledException("Usuário inativo");
        }

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtService.generateToken(principal);

        return new LoginResponse(token, userMapper.toSessionUser(user));
    }
}
