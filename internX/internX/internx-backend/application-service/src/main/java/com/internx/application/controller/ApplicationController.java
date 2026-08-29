package com.internx.application.controller;

import com.internx.application.service.ApplicationService;
import com.internx.common.dto.ApplicationDto;
import com.internx.common.enums.ApplicationStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApplicationDto> apply(@RequestBody ApplicationDto dto) {
        ApplicationDto created = applicationService.apply(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<ApplicationDto>> getAll(
            @RequestParam(required = false) String companyId,
            @RequestParam(required = false) String studentId,
            @RequestParam(required = false) String internshipId
    ) {
        if (studentId != null && !studentId.isBlank()) {
            return ResponseEntity.ok(applicationService.getByStudentId(studentId));
        }
        if (companyId != null && !companyId.isBlank()) {
            return ResponseEntity.ok(applicationService.getByCompanyId(companyId));
        }
        if (internshipId != null && !internshipId.isBlank()) {
            return ResponseEntity.ok(applicationService.getByInternshipId(internshipId));
        }
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<ApplicationDto>> getByCompany(@PathVariable String companyId) {
        return ResponseEntity.ok(applicationService.getByCompanyId(companyId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ApplicationDto>> getByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(applicationService.getByStudentId(studentId));
    }

    @GetMapping("/internship/{internshipId}")
    public ResponseEntity<List<ApplicationDto>> getByInternship(@PathVariable String internshipId) {
        return ResponseEntity.ok(applicationService.getByInternshipId(internshipId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @RequestHeader(value = "X-User-Role", defaultValue = "") String role,
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        if (!"COMPANY".equalsIgnoreCase(role) && !"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Forbidden: Only Employer or Admin accounts can update application status."));
        }
        String statusStr = body.get("status");
        ApplicationStatus status = ApplicationStatus.valueOf(statusStr.toUpperCase());
        ApplicationDto updated = applicationService.updateStatusSafely(id, status);
        return ResponseEntity.ok(updated);
    }
}
