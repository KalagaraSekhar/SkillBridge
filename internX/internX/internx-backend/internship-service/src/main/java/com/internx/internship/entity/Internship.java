package com.internx.internship.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "internships")
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String companyId;

    @Column(nullable = false)
    private String companyName;

    private String companyLogo;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private String category;

    @ElementCollection
    @CollectionTable(name = "internship_skills", joinColumns = @JoinColumn(name = "internship_id"))
    @Column(name = "skill")
    private List<String> skillsRequired = new ArrayList<>();

    private String stipend;
    private Integer stipendAmount;
    private Integer durationWeeks;
    private String durationText;
    private String location;
    private boolean remote = false;

    @Column(nullable = false)
    private Integer maxPositions = 1;

    @Column(nullable = false)
    private Integer filledPositions = 0;

    @Version
    private Long version;

    private String status = "ACTIVE";

    @Column(nullable = false, updatable = false)
    private LocalDateTime postedAt = LocalDateTime.now();

    public Internship() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCompanyId() { return companyId; }
    public void setCompanyId(String companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyLogo() { return companyLogo; }
    public void setCompanyLogo(String companyLogo) { this.companyLogo = companyLogo; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<String> getSkillsRequired() { return skillsRequired; }
    public void setSkillsRequired(List<String> skillsRequired) { this.skillsRequired = skillsRequired; }

    public String getStipend() { return stipend; }
    public void setStipend(String stipend) { this.stipend = stipend; }

    public Integer getStipendAmount() { return stipendAmount; }
    public void setStipendAmount(Integer stipendAmount) { this.stipendAmount = stipendAmount; }

    public Integer getDurationWeeks() { return durationWeeks; }
    public void setDurationWeeks(Integer durationWeeks) { this.durationWeeks = durationWeeks; }

    public String getDurationText() { return durationText; }
    public void setDurationText(String durationText) { this.durationText = durationText; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public boolean isRemote() { return remote; }
    public void setRemote(boolean remote) { this.remote = remote; }

    public Integer getMaxPositions() { return maxPositions; }
    public void setMaxPositions(Integer maxPositions) { this.maxPositions = maxPositions; }

    public Integer getFilledPositions() { return filledPositions; }
    public void setFilledPositions(Integer filledPositions) { this.filledPositions = filledPositions; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getPostedAt() { return postedAt; }
    public void setPostedAt(LocalDateTime postedAt) { this.postedAt = postedAt; }
}
