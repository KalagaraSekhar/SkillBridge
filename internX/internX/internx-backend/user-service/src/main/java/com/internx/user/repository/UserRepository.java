package com.internx.user.repository;

import com.internx.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndRole(String email, com.internx.common.enums.Role role);
    Optional<User> findByGoogleId(String googleId);
    boolean existsByEmail(String email);
}
