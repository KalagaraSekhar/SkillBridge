package com.internx.user.controller;

import com.internx.common.dto.*;
import com.internx.common.enums.Role;
import com.internx.user.service.OtpService;
import com.internx.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @PostMapping("/student/login")
    public ResponseEntity<ApiResponse<JwtResponse>> studentLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        JwtResponse jwtResponse = userService.authenticatePassword(email, password, Role.STUDENT);
        return ResponseEntity.ok(ApiResponse.ok("Student login successful.", jwtResponse));
    }

    @PostMapping("/company/login")
    public ResponseEntity<ApiResponse<JwtResponse>> companyLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        JwtResponse jwtResponse = userService.authenticatePassword(email, password, Role.COMPANY);
        return ResponseEntity.ok(ApiResponse.ok("Company login successful.", jwtResponse));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<JwtResponse>> adminLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        JwtResponse jwtResponse = userService.authenticatePassword(email, password, Role.ADMIN);
        return ResponseEntity.ok(ApiResponse.ok("Admin login successful.", jwtResponse));
    }

    @PostMapping("/google/{role}")
    public ResponseEntity<ApiResponse<JwtResponse>> googleLogin(
            @PathVariable String role,
            @RequestBody Map<String, String> payload
    ) {
        Role targetRole;
        try {
            targetRole = Role.valueOf(role.toUpperCase());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role portal: " + role);
        }

        String token = payload.get("token");
        String fallbackEmail = payload.get("email");
        String fallbackName = payload.get("name");

        String[] parsed = userService.parseGoogleToken(token, fallbackEmail, fallbackName);
        String verifiedEmail = parsed[0];
        String verifiedName = parsed[1];
        String googleId = parsed[2];

        JwtResponse jwtResponse = userService.authenticateOrCreateGoogleUser(verifiedEmail, verifiedName, googleId, targetRole);
        return ResponseEntity.ok(ApiResponse.ok(targetRole.name() + " Google login successful.", jwtResponse));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<JwtResponse>> register(@RequestBody UserDto userDto) {
        JwtResponse jwtResponse = userService.registerUser(userDto);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful.", jwtResponse));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<JwtResponse>> verifyOtp(@RequestBody OtpVerifyRequest request) {
        JwtResponse jwtResponse = userService.verifyAndAuthenticate(request.getEmail(), request.getOtp());
        return ResponseEntity.ok(ApiResponse.ok("Email verified successfully.", jwtResponse));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Map<String, String>>> sendOtp(@RequestBody OtpRequest request) {
        otpService.generateAndSendOtp(request.getEmail());
        return ResponseEntity.ok(ApiResponse.ok("OTP sent successfully.", Map.of(
                "email", request.getEmail()
        )));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<Map<String, String>>> resendOtp(@RequestBody OtpRequest request) {
        otpService.generateAndSendOtp(request.getEmail());
        return ResponseEntity.ok(ApiResponse.ok("New OTP generated successfully.", Map.of(
                "email", request.getEmail()
        )));
    }
}
