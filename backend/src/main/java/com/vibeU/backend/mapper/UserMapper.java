package com.vibeU.backend.mapper;

import com.vibeU.backend.dto.response.OrganizerResponse;
import com.vibeU.backend.dto.response.SessionUserResponse;
import com.vibeU.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public SessionUserResponse toSessionUser(User user) {
        return new SessionUserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole()
        );
    }

    public OrganizerResponse toOrganizerResponse(User user) {
        return new OrganizerResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getStatus(),
            user.getPhone(),
            user.getBio(),
            user.getCreatedAt()
        );
    }
}
