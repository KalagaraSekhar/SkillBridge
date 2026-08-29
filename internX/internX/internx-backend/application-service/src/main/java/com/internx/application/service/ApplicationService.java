package com.internx.application.service;

import com.internx.application.client.InternshipClient;
import com.internx.application.entity.Application;
import com.internx.application.repository.ApplicationRepository;
import com.internx.common.dto.ApiResponse;
import com.internx.common.dto.ApplicationDto;
import com.internx.common.dto.InternshipDto;
import com.internx.common.enums.ApplicationStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private static final Logger log = LoggerFactory.getLogger(ApplicationService.class);

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired(required = false)
    private InternshipClient internshipClient;

    @Autowired(required = false)
    private KafkaTemplate<String, String> kafkaTemplate;

    @Transactional
    public ApplicationDto apply(ApplicationDto dto) {
        // Prevent duplicate applications
        if (applicationRepository.findByStudentIdAndInternshipId(dto.getStudentId(), dto.getInternshipId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already applied for this internship position.");
        }

        Application app = new Application();
        app.setStudentId(dto.getStudentId());
        app.setStudentName(dto.getStudentName());
        app.setStudentEmail(dto.getStudentEmail());
        app.setStudentUniversity(dto.getStudentUniversity());
        app.setInternshipId(dto.getInternshipId());
        app.setInternshipTitle(dto.getInternshipTitle());
        app.setCompanyId(dto.getCompanyId());
        app.setCompanyName(dto.getCompanyName());
        app.setCategory(dto.getCategory());
        app.setStipend(dto.getStipend());
        app.setResumeUrl(dto.getResumeUrl());
        app.setCoverNote(dto.getCoverNote());
        app.setPortfolioUrl(dto.getPortfolioUrl());
        app.setStatus(ApplicationStatus.APPLIED);
        app.setAppliedAt(LocalDateTime.now());
        app.setUpdatedAt(LocalDateTime.now());

        Application saved = applicationRepository.save(app);
        return toDto(saved);
    }

    /**
     * Concurrency-safe status update:
     * When marking as SELECTED, calls internship-service with pessimistic locking to allocate a capacity seat.
     * Throws 409 Conflict if max positions reached.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public ApplicationDto updateStatusSafely(String applicationId, ApplicationStatus newStatus) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found: " + applicationId));

        ApplicationStatus previousStatus = application.getStatus();

        if (newStatus == ApplicationStatus.SELECTED && previousStatus != ApplicationStatus.SELECTED) {
            // Allocate seat with concurrency check
            if (internshipClient != null) {
                try {
                    ApiResponse<Boolean> response = internshipClient.allocateSeat(application.getInternshipId());
                    if (response == null || !response.isSuccess()) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT,
                                "Capacity limit exceeded: All open positions for this internship have been filled.");
                    }
                } catch (Exception e) {
                    if (e instanceof ResponseStatusException) throw (ResponseStatusException) e;
                    log.warn("Feign call to allocate seat encountered error: {}", e.getMessage());
                }
            }
        }

        application.setStatus(newStatus);
        application.setUpdatedAt(LocalDateTime.now());
        Application updated = applicationRepository.save(application);

        // Publish status event to Kafka / Notification Service
        if (kafkaTemplate != null) {
            try {
                String payload = String.format("{\"applicationId\":\"%s\",\"studentEmail\":\"%s\",\"internshipTitle\":\"%s\",\"companyName\":\"%s\",\"status\":\"%s\"}",
                        updated.getId(), updated.getStudentEmail(), updated.getInternshipTitle(), updated.getCompanyName(), newStatus.name());
                kafkaTemplate.send("application-status-events", updated.getId(), payload);
            } catch (Exception e) {
                log.warn("Failed to publish Kafka status event: {}", e.getMessage());
            }
        }

        return toDto(updated);
    }

    public List<ApplicationDto> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getByStudentId(String studentId) {
        return applicationRepository.findByStudentId(studentId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getByCompanyId(String companyId) {
        return applicationRepository.findByCompanyId(companyId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getByInternshipId(String internshipId) {
        return applicationRepository.findByInternshipId(internshipId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ApplicationDto toDto(Application app) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());
        dto.setStudentId(app.getStudentId());
        dto.setStudentName(app.getStudentName());
        dto.setStudentEmail(app.getStudentEmail());
        dto.setStudentUniversity(app.getStudentUniversity());
        dto.setInternshipId(app.getInternshipId());
        dto.setInternshipTitle(app.getInternshipTitle());
        dto.setCompanyId(app.getCompanyId());
        dto.setCompanyName(app.getCompanyName());
        dto.setCategory(app.getCategory());
        dto.setStipend(app.getStipend());
        dto.setResumeUrl(app.getResumeUrl());
        dto.setCoverNote(app.getCoverNote());
        dto.setPortfolioUrl(app.getPortfolioUrl());
        dto.setStatus(app.getStatus());
        dto.setAppliedAt(app.getAppliedAt());
        dto.setUpdatedAt(app.getUpdatedAt());
        return dto;
    }
}
