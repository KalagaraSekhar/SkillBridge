package com.internx.internship.repository;

import com.internx.internship.entity.Internship;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, String> {

    List<Internship> findByCategoryIgnoreCase(String category);
    List<Internship> findByCompanyId(String companyId);
    List<Internship> findByRemote(boolean remote);

    // Pessimistic Locking query for capacity-safe selection
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Internship i WHERE i.id = :id")
    Optional<Internship> findByIdForUpdate(@Param("id") String id);
}
