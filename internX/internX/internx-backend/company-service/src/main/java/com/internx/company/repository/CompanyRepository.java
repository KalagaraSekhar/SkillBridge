package com.internx.company.repository;

import com.internx.common.enums.CompanyStatus;
import com.internx.company.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, String> {
    List<Company> findByApprovedStatus(CompanyStatus status);
    Optional<Company> findByOwnerUserId(String ownerUserId);
}
