package com.internx.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internx.common.dto.JwtResponse;
import com.internx.common.dto.UserDto;
import com.internx.common.enums.Role;
import com.internx.user.exception.AuthenticationException;
import com.internx.user.service.OtpService;
import com.internx.user.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private OtpService otpService;

    @MockBean
    private com.internx.user.repository.UserRepository userRepository;

    @MockBean
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("POST /api/auth/student/login - Success")
    void studentLogin_success() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setEmail("student@internx.dev");
        userDto.setRole(Role.STUDENT);

        JwtResponse jwtResponse = new JwtResponse("mock-student-jwt", userDto);
        when(userService.authenticatePassword(eq("student@internx.dev"), eq("password123"), eq(Role.STUDENT)))
                .thenReturn(jwtResponse);

        mockMvc.perform(post("/api/auth/student/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "student@internx.dev",
                                "password", "password123"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").value("mock-student-jwt"))
                .andExpect(jsonPath("$.data.user.role").value("STUDENT"));
    }

    @Test
    @DisplayName("POST /api/auth/company/login - Success")
    void companyLogin_success() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setEmail("company@internx.dev");
        userDto.setRole(Role.COMPANY);

        JwtResponse jwtResponse = new JwtResponse("mock-company-jwt", userDto);
        when(userService.authenticatePassword(eq("company@internx.dev"), eq("password123"), eq(Role.COMPANY)))
                .thenReturn(jwtResponse);

        mockMvc.perform(post("/api/auth/company/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "company@internx.dev",
                                "password", "password123"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").value("mock-company-jwt"))
                .andExpect(jsonPath("$.data.user.role").value("COMPANY"));
    }

    @Test
    @DisplayName("POST /api/auth/admin/login - Success")
    void adminLogin_success() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setEmail("admin@internx.dev");
        userDto.setRole(Role.ADMIN);

        JwtResponse jwtResponse = new JwtResponse("mock-admin-jwt", userDto);
        when(userService.authenticatePassword(eq("admin@internx.dev"), eq("password123"), eq(Role.ADMIN)))
                .thenReturn(jwtResponse);

        mockMvc.perform(post("/api/auth/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "admin@internx.dev",
                                "password", "password123"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").value("mock-admin-jwt"))
                .andExpect(jsonPath("$.data.user.role").value("ADMIN"));
    }

    @Test
    @DisplayName("POST /api/auth/google/student - Google Sign-In Success")
    void googleStudentLogin_success() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setEmail("student.google@gmail.com");
        userDto.setRole(Role.STUDENT);

        JwtResponse jwtResponse = new JwtResponse("google-student-jwt", userDto);
        when(userService.parseGoogleToken(any(), any(), any()))
                .thenReturn(new String[]{"student.google@gmail.com", "Google Student", "google-sub-123"});
        when(userService.authenticateOrCreateGoogleUser(eq("student.google@gmail.com"), eq("Google Student"), eq("google-sub-123"), eq(Role.STUDENT)))
                .thenReturn(jwtResponse);

        mockMvc.perform(post("/api/auth/google/student")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "token", "mock-google-token",
                                "email", "student.google@gmail.com",
                                "name", "Google Student"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").value("google-student-jwt"))
                .andExpect(jsonPath("$.data.user.email").value("student.google@gmail.com"));
    }
}
