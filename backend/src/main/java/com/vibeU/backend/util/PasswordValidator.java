package com.vibeU.backend.util;

import com.vibeU.backend.exception.BusinessException;

import java.util.regex.Pattern;

public final class PasswordValidator {

    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"
    );

    private PasswordValidator() {
    }

    public static void validate(String password) {
        if (password == null || !PASSWORD_PATTERN.matcher(password).matches()) {
            throw new BusinessException(
                "A senha deve possuir no mínimo 8 caracteres, 1 letra maiúscula, 1 letra minúscula e 1 número"
            );
        }
    }
}
