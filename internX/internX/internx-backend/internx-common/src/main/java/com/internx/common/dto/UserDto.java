package com.internx.common.dto;

import com.internx.common.enums.Role;
import java.time.LocalDateTime;

public class UserDto {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String password;
    private String googleId;
    private boolean emailVerified;
    private Role role;
    private String university;
    private String major;
    private String gradYear;
    private String resumeUrl;
    private LocalDateTime createdAt;

    public UserDto() {}

    public UserDto(String id, String name, String email, String phone, boolean emailVerified, Role role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.emailVerified = emailVerified;
        this.role = role;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getUniversity() { return university; }
    public void setUniversity(String university) { this.university = university; }

    public String getMajor() { return major; }
    public void setMajor(String major) { this.major = major; }

    public String getGradYear() { return gradYear; }
    public void setGradYear(String gradYear) { this.gradYear = gradYear; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
