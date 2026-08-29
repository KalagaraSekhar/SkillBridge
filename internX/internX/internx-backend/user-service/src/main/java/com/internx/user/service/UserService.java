package com.internx.user.service;

import com.internx.common.dto.JwtResponse;
import com.internx.common.dto.UserDto;
import com.internx.common.enums.Role;
import com.internx.common.security.JwtUtils;
import com.internx.user.entity.User;
import com.internx.user.exception.AuthenticationException;
import com.internx.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpService otpService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @jakarta.annotation.PostConstruct
    public void seedDemoUsers() {
        seedUser("student@internx.dev", "Alex Rivera", Role.STUDENT, "Stanford University", "Computer Science");
        seedUser("company@internx.dev", "Elena Rostova", Role.COMPANY, null, null);
        seedUser("tcs@internx.dev", "TCS Campus Talent", Role.COMPANY, null, null);
        seedUser("google@internx.dev", "Google University Programs", Role.COMPANY, null, null);
        seedUser("microsoft@internx.dev", "Microsoft Aspire Recruiting", Role.COMPANY, null, null);
        seedUser("amazon@internx.dev", "Amazon Student Programs", Role.COMPANY, null, null);
        seedUser("admin@internx.dev", "Marcus Vance", Role.ADMIN, null, null);
    }

    private void seedUser(String email, String name, Role role, String university, String major) {
        String normalizedEmail = email.toLowerCase().trim();
        Optional<User> existing = userRepository.findByEmail(normalizedEmail);
        User user = existing.orElseGet(User::new);
        user.setEmail(normalizedEmail);
        user.setName(name);
        user.setRole(role);
        user.setEmailVerified(true);
        user.setPasswordHash(passwordEncoder.encode("password123"));
        user.setUniversity(university);
        user.setMajor(major);
        userRepository.save(user);
    }

    @Transactional
    public JwtResponse registerUser(UserDto dto) {
        String normalizedEmail = dto.getEmail().toLowerCase().trim();

        Optional<User> existing = userRepository.findByEmail(normalizedEmail);
        User user = existing.orElseGet(User::new);
        user.setName(dto.getName());
        user.setEmail(normalizedEmail);
        user.setPhone(dto.getPhone());
        user.setRole(dto.getRole() != null ? dto.getRole() : Role.STUDENT);
        user.setEmailVerified(true);
        user.setUniversity(dto.getUniversity());
        user.setMajor(dto.getMajor());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        }

        user = userRepository.save(user);

        String token = JwtUtils.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new JwtResponse(token, toDto(user));
    }

    public JwtResponse authenticatePassword(String email, String rawPassword, Role expectedRole) {
        String normalizedEmail = (email != null) ? email.toLowerCase().trim() : "";
        
        // Fetch user by email + expected role
        User user = userRepository.findByEmailAndRole(normalizedEmail, expectedRole)
                .orElseThrow(() -> new AuthenticationException("Invalid email or password"));

        // Verify password using BCrypt
        if (user.getPasswordHash() == null || !passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new AuthenticationException("Invalid email or password");
        }

        String token = JwtUtils.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new JwtResponse(token, toDto(user));
    }

    @Transactional
    public JwtResponse authenticateOrCreateGoogleUser(String verifiedEmail, String verifiedName, String googleId, Role expectedRole) {
        String normalizedEmail = verifiedEmail.toLowerCase().trim();
        final String finalName = (verifiedName != null && !verifiedName.isBlank()) ? verifiedName : "Google User";
        final String finalGoogleId = (googleId != null && !googleId.isBlank()) ? googleId : "google-" + System.currentTimeMillis();

        Optional<User> existingUserOpt = userRepository.findByEmail(normalizedEmail);
        User user;

        if (existingUserOpt.isPresent()) {
            user = existingUserOpt.get();
            if (user.getRole() != expectedRole) {
                throw new AuthenticationException(
                        String.format("Account registered as %s. Cannot log in to %s portal.", user.getRole(), expectedRole)
                );
            }
            user.setEmailVerified(true);
            if (user.getGoogleId() == null) {
                user.setGoogleId(finalGoogleId);
            }
            user = userRepository.save(user);
        } else {
            user = new User();
            user.setEmail(normalizedEmail);
            user.setName(finalName);
            user.setGoogleId(finalGoogleId);
            user.setRole(expectedRole);
            user.setEmailVerified(true);
            user = userRepository.save(user);
        }

        String token = JwtUtils.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new JwtResponse(token, toDto(user));
    }

    public String[] parseGoogleToken(String idToken, String fallbackEmail, String fallbackName) {
        String email = fallbackEmail;
        String name = fallbackName != null ? fallbackName : "Google User";
        String googleId = "google-" + System.currentTimeMillis();

        if (idToken != null && idToken.contains(".")) {
            try {
                String[] parts = idToken.split("\\.");
                if (parts.length >= 2) {
                    String payloadJson = new String(java.util.Base64.getUrlDecoder().decode(parts[1]));
                    com.fasterxml.jackson.databind.JsonNode payload = new com.fasterxml.jackson.databind.ObjectMapper().readTree(payloadJson);

                    if (payload.has("email")) {
                        email = payload.get("email").asText();
                    }
                    if (payload.has("name")) {
                        name = payload.get("name").asText();
                    }
                    if (payload.has("sub")) {
                        googleId = payload.get("sub").asText();
                    }
                }
            } catch (Exception e) {
                // If parsing fails and no fallback, throw error
                if (email == null || email.isBlank()) {
                    throw new IllegalArgumentException("Invalid Google id_token signature or payload format.");
                }
            }
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Failed to extract verified email from Google identity token.");
        }

        return new String[]{email.toLowerCase().trim(), name, googleId};
    }

    public UserDto getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toDto(user);
    }

    public UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setEmailVerified(user.isEmailVerified());
        dto.setUniversity(user.getUniversity());
        dto.setMajor(user.getMajor());
        dto.setGradYear(user.getGradYear());
        dto.setResumeUrl(user.getResumeUrl());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
