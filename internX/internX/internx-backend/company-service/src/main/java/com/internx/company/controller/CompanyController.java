package com.internx.company.controller;

import com.internx.common.dto.ApiResponse;
import com.internx.common.enums.CompanyStatus;
import com.internx.company.entity.Company;
import com.internx.company.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @GetMapping
    public ResponseEntity<List<Company>> getAll() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getById(@PathVariable String id) {
        return ResponseEntity.ok(companyService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Company> register(@RequestBody Company company) {
        return ResponseEntity.ok(companyService.registerCompany(company));
    }

    @PatchMapping("/{id}/approval")
    public ResponseEntity<?> updateApproval(
            @RequestHeader(value = "X-User-Role", defaultValue = "") String role,
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied: Admin role required for company approval."));
        }
        String statusStr = body.get("status");
        CompanyStatus status = CompanyStatus.valueOf(statusStr.toUpperCase());
        Company updated = companyService.updateApprovalStatus(id, status);
        return ResponseEntity.ok(updated);
    }
}
