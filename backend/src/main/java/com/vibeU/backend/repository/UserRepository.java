package com.vibeU.backend.repository;

import com.vibeU.backend.entity.User;
import com.vibeU.backend.enums.EntityStatus;
import com.vibeU.backend.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, UUID id);

    List<User> findByRoleOrderByNameAsc(UserRole role);

    List<User> findByRoleAndStatusOrderByNameAsc(UserRole role, EntityStatus status);

    long countByRole(UserRole role);
}
