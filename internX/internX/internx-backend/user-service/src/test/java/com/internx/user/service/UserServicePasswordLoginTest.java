package com.internx.user.service;

import com.internx.common.dto.JwtResponse;
import com.internx.common.enums.Role;
import com.internx.user.entity.User;
import com.internx.user.exception.AuthenticationException;
import com.internx.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for portal-specific password login in UserService.
 *
 * Verifies that:
 *  - Correct password and matching portal role -> success (200 + JWT)
 *  - Role mismatch between portal and account  -> rejected with AuthenticationException
 *  - Wrong password                           -> AuthenticationException (mapped to 401)
 *  - Non-existent account                     -> AuthenticationException (mapped to 401)
 */
@ExtendWith(MockitoExtension.class)
class UserServicePasswordLoginTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private final PasswordEncoder realEncoder = new BCryptPasswordEncoder();

    private User studentUser;
    private User companyUser;
    private User adminUser;

    private static final String STUDENT_EMAIL = "student@internx.dev";
    private static final String COMPANY_EMAIL = "company@internx.dev";
    private static final String ADMIN_EMAIL = "admin@internx.dev";
    private static final String CORRECT_PASSWORD = "password123";
    private static final String WRONG_PASSWORD = "wrongpass";

    @BeforeEach
    void setUp() {
        userService = new UserService();

        try {
            var repoField = UserService.class.getDeclaredField("userRepository");
            repoField.setAccessible(true);
            repoField.set(userService, userRepository);

            var encoderField = UserService.class.getDeclaredField("passwordEncoder");
            encoderField.setAccessible(true);
            encoderField.set(userService, realEncoder);
        } catch (Exception e) {
            throw new RuntimeException("Failed to inject test dependencies", e);
        }

        // Student User
        studentUser = new User();
        studentUser.setId("usr-student-1");
        studentUser.setEmail(STUDENT_EMAIL);
        studentUser.setName("Alex Rivera");
        studentUser.setRole(Role.STUDENT);
        studentUser.setEmailVerified(true);
        studentUser.setPasswordHash(realEncoder.encode(CORRECT_PASSWORD));

        // Company User
        companyUser = new User();
        companyUser.setId("usr-comp-1");
        companyUser.setEmail(COMPANY_EMAIL);
        companyUser.setName("Elena Rostova");
        companyUser.setRole(Role.COMPANY);
        companyUser.setEmailVerified(true);
        companyUser.setPasswordHash(realEncoder.encode(CORRECT_PASSWORD));

        // Admin User
        adminUser = new User();
        adminUser.setId("usr-admin-1");
        adminUser.setEmail(ADMIN_EMAIL);
        adminUser.setName("Marcus Vance");
        adminUser.setRole(Role.ADMIN);
        adminUser.setEmailVerified(true);
        adminUser.setPasswordHash(realEncoder.encode(CORRECT_PASSWORD));
    }

    @Test
    @DisplayName("Student Portal: Login with correct password and STUDENT role should succeed")
    void studentLogin_success() {
        when(userRepository.findByEmailAndRole(STUDENT_EMAIL, Role.STUDENT)).thenReturn(Optional.of(studentUser));

        JwtResponse response = userService.authenticatePassword(STUDENT_EMAIL, CORRECT_PASSWORD, Role.STUDENT);

        assertNotNull(response);
        assertNotNull(response.getAccessToken());
        assertEquals(STUDENT_EMAIL, response.getUser().getEmail());
        assertEquals(Role.STUDENT, response.getUser().getRole());
    }

    @Test
    @DisplayName("Company Portal: Login with correct password and COMPANY role should succeed")
    void companyLogin_success() {
        when(userRepository.findByEmailAndRole(COMPANY_EMAIL, Role.COMPANY)).thenReturn(Optional.of(companyUser));

        JwtResponse response = userService.authenticatePassword(COMPANY_EMAIL, CORRECT_PASSWORD, Role.COMPANY);

        assertNotNull(response);
        assertNotNull(response.getAccessToken());
        assertEquals(COMPANY_EMAIL, response.getUser().getEmail());
        assertEquals(Role.COMPANY, response.getUser().getRole());
    }

    @Test
    @DisplayName("Admin Portal: Login with correct password and ADMIN role should succeed")
    void adminLogin_success() {
        when(userRepository.findByEmailAndRole(ADMIN_EMAIL, Role.ADMIN)).thenReturn(Optional.of(adminUser));

        JwtResponse response = userService.authenticatePassword(ADMIN_EMAIL, CORRECT_PASSWORD, Role.ADMIN);

        assertNotNull(response);
        assertNotNull(response.getAccessToken());
        assertEquals(ADMIN_EMAIL, response.getUser().getEmail());
        assertEquals(Role.ADMIN, response.getUser().getRole());
    }

    @Test
    @DisplayName("Portal Role Enforcement: Student account trying to log into Company portal must be rejected")
    void roleMismatch_studentOnCompanyPortal_rejected() {
        when(userRepository.findByEmailAndRole(STUDENT_EMAIL, Role.COMPANY)).thenReturn(Optional.empty());

        assertThrows(
                AuthenticationException.class,
                () -> userService.authenticatePassword(STUDENT_EMAIL, CORRECT_PASSWORD, Role.COMPANY)
        );
    }

    @Test
    @DisplayName("Wrong password should throw AuthenticationException")
    void loginWithWrongPassword_shouldThrow() {
        when(userRepository.findByEmailAndRole(STUDENT_EMAIL, Role.STUDENT)).thenReturn(Optional.of(studentUser));

        assertThrows(
                AuthenticationException.class,
                () -> userService.authenticatePassword(STUDENT_EMAIL, WRONG_PASSWORD, Role.STUDENT)
        );
    }
}
