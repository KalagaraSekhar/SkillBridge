package com.internx.internship.controller;

import com.internx.common.dto.ApiResponse;
import com.internx.common.dto.InternshipDto;
import com.internx.internship.service.InternshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internships")
public class InternshipController {

    @Autowired
    private InternshipService internshipService;

    @GetMapping
    public ResponseEntity<List<InternshipDto>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean remote,
            @RequestParam(required = false) String search
    ) {
        List<InternshipDto> list = internshipService.getAllInternships(category, remote, search);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InternshipDto> getById(@PathVariable String id) {
        InternshipDto dto = internshipService.getById(id);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestHeader(value = "X-User-Role", defaultValue = "") String role,
            @RequestBody InternshipDto dto
    ) {
        if (!"COMPANY".equalsIgnoreCase(role) && !"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Forbidden: Only Employer or Admin accounts can post internships."));
        }
        InternshipDto created = internshipService.createInternship(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/allocate-seat")
    public ResponseEntity<ApiResponse<Boolean>> allocateSeat(@PathVariable String id) {
        boolean success = internshipService.incrementFilledPositionsSafely(id);
        if (!success) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("Capacity limit reached (409 Conflict): No open positions remaining."));
        }
        return ResponseEntity.ok(ApiResponse.ok("Capacity seat safely allocated.", true));
    }
}
