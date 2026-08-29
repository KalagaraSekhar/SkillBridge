package com.internx.user.exception;

/**
 * Thrown when user authentication fails (invalid credentials).
 * Mapped to HTTP 401 by GlobalExceptionHandler.
 */
public class AuthenticationException extends RuntimeException {
    public AuthenticationException(String message) {
        super(message);
    }
}
