package com.vibeU.backend.service;

import com.vibeU.backend.dto.request.CreateOrganizerRequest;
import com.vibeU.backend.dto.request.UpdateOrganizerRequest;
import com.vibeU.backend.dto.request.UpdateOrganizerStatusRequest;
import com.vibeU.backend.dto.response.OrganizerResponse;
import com.vibeU.backend.entity.User;
import com.vibeU.backend.enums.EntityStatus;
import com.vibeU.backend.enums.UserRole;
import com.vibeU.backend.exception.BusinessException;
import com.vibeU.backend.exception.ResourceNotFoundException;
import com.vibeU.backend.mapper.UserMapper;
import com.vibeU.backend.repository.EventRepository;
import com.vibeU.backend.repository.UserRepository;
import com.vibeU.backend.util.PasswordValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrganizerService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final UserMapper userMapper;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Transactional
    public OrganizerResponse create(CreateOrganizerRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("E-mail já cadastrado", HttpStatus.CONFLICT);
        }

        PasswordValidator.validate(request.password());

        User organizer = User.builder()
            .name(request.name())
            .email(request.email())
            .passwordHash(passwordEncoder.encode(request.password()))
            .role(UserRole.ORGANIZADOR)
            .status(EntityStatus.ATIVO)
            .phone(request.phone())
            .bio(request.bio())
            .build();

        return userMapper.toOrganizerResponse(userRepository.save(organizer));
    }

    @Transactional
    public OrganizerResponse update(UUID id, UpdateOrganizerRequest request) {
        User organizer = findOrganizer(id);

        if (userRepository.existsByEmailAndIdNot(request.email(), id)) {
            throw new BusinessException("E-mail já cadastrado", HttpStatus.CONFLICT);
        }

        organizer.setName(request.name());
        organizer.setEmail(request.email());
        organizer.setPhone(request.phone());
        organizer.setBio(request.bio());

        return userMapper.toOrganizerResponse(userRepository.save(organizer));
    }

    @Transactional(readOnly = true)
    public List<OrganizerResponse> list(EntityStatus status) {
        List<User> organizers = status != null
            ? userRepository.findByRoleAndStatusOrderByNameAsc(UserRole.ORGANIZADOR, status)
            : userRepository.findByRoleOrderByNameAsc(UserRole.ORGANIZADOR);
        return organizers.stream().map(userMapper::toOrganizerResponse).toList();
    }

    @Transactional(readOnly = true)
    public OrganizerResponse findById(UUID id) {
        return userMapper.toOrganizerResponse(findOrganizer(id));
    }

    @Transactional
    public OrganizerResponse updateStatus(UUID id, UpdateOrganizerStatusRequest request) {
        User organizer = findOrganizer(id);
        organizer.setStatus(request.status());
        return userMapper.toOrganizerResponse(userRepository.save(organizer));
    }

    @Transactional
    public void delete(UUID id) {
        User organizer = findOrganizer(id);

        if (eventRepository.countByOrganizerId(id) > 0) {
            throw new BusinessException(
                "Não é possível excluir organizador com eventos vinculados",
                HttpStatus.CONFLICT
            );
        }

        userRepository.delete(organizer);
    }

    private User findOrganizer(UUID id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Organizador não encontrado"));

        if (user.getRole() != UserRole.ORGANIZADOR) {
            throw new ResourceNotFoundException("Organizador não encontrado");
        }

        return user;
    }
}
