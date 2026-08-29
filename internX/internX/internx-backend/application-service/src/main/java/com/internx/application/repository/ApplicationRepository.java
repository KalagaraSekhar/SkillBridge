package com.internx.application.repository;

import com.internx.application.entity.Application;
import com.internx.common.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {
    List<Application> findByStudentId(String studentId);
    List<Application> findByInternshipId(String internshipId);
    List<Application> findByCompanyId(String companyId);
    List<Application> findByInternshipIdAndStatus(String internshipId, ApplicationStatus status);
    Optional<Application> findByStudentIdAndInternshipId(String studentId, String internshipId);
    long countByInternshipIdAndStatus(String internshipId, ApplicationStatus status);
}
