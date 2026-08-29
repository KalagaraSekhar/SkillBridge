package com.internx.internship.service;

import com.internx.common.dto.InternshipDto;
import com.internx.internship.entity.Internship;
import com.internx.internship.repository.InternshipRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InternshipService {

    @Autowired
    private InternshipRepository internshipRepository;

    @PostConstruct
    public void seedInternships() {
        if (internshipRepository.count() == 0) {
            // Google
            seedInternship("int-g-1", "comp-google", "Google LLC", "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80",
                    "Software Engineering Intern (Cloud Systems & Go)", "Tech",
                    List.of("Go", "Kubernetes", "Distributed Systems", "gRPC"),
                    "$8,200 / mo", 8200, 12, "12 Weeks (Summer 2026)", "Mountain View, CA", true, 6, 2,
                    "Join Google Cloud Core Infrastructure to build planetary-scale storage and compute systems using Go and Kubernetes.");

            seedInternship("int-g-2", "comp-google", "Google LLC", "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80",
                    "AI & Machine Learning Research Intern (Gemini)", "Data",
                    List.of("Python", "PyTorch", "Transformers", "JAX"),
                    "$9,000 / mo", 9000, 14, "14 Weeks (Summer 2026)", "Mountain View, CA", false, 4, 1,
                    "Work with Google DeepMind researchers on multi-modal representation learning and large language model architectures.");

            seedInternship("int-g-3", "comp-google", "Google LLC", "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80",
                    "UX & Design Systems Intern (Material Design)", "Design",
                    List.of("Figma", "Design Systems", "Prototyping", "User Research"),
                    "$7,500 / mo", 7500, 12, "12 Weeks (Summer 2026)", "New York, NY", true, 3, 1,
                    "Design intuitive, accessible UI interactions for Google Workspace applications used by billions of users.");

            // Microsoft
            seedInternship("int-ms-1", "comp-microsoft", "Microsoft Corporation", "https://images.unsplash.com/photo-1642132652075-2bfa3224765d?w=120&auto=format&fit=crop&q=80",
                    "Cloud & DevOps Engineering Intern (Azure)", "Tech",
                    List.of("Azure", "Terraform", "C#", ".NET Core", "Docker"),
                    "$7,800 / mo", 7800, 12, "12 Weeks (Summer 2026)", "Redmond, WA", true, 5, 2,
                    "Help power Azure Cloud edge networking and telemetry pipelines across global cloud regions.");

            seedInternship("int-ms-2", "comp-microsoft", "Microsoft Corporation", "https://images.unsplash.com/photo-1642132652075-2bfa3224765d?w=120&auto=format&fit=crop&q=80",
                    "Data Analytics & Business Intelligence Intern", "Data",
                    List.of("PowerBI", "SQL", "Azure Synapse", "Python"),
                    "$6,800 / mo", 6800, 10, "10 Weeks (Summer 2026)", "Redmond, WA", true, 4, 1,
                    "Extract actionable intelligence from global developer telemetry to shape future Microsoft product strategies.");

            // Amazon
            seedInternship("int-amz-1", "comp-amazon", "Amazon", "https://images.unsplash.com/photo-1523474253243-231a51138b38?w=120&auto=format&fit=crop&q=80",
                    "Software Development Engineer Intern (AWS Serverless)", "Tech",
                    List.of("Java", "AWS Lambda", "DynamoDB", "TypeScript"),
                    "$8,000 / mo", 8000, 12, "12 Weeks (Summer 2026)", "Seattle, WA", true, 8, 3,
                    "Design and implement high-availability event-driven backend microservices on AWS Lambda and DynamoDB.");

            seedInternship("int-amz-2", "comp-amazon", "Amazon", "https://images.unsplash.com/photo-1523474253243-231a51138b38?w=120&auto=format&fit=crop&q=80",
                    "Applied Machine Learning Intern (Search & Recommendations)", "Data",
                    List.of("Python", "Deep Learning", "AWS SageMaker", "Spark"),
                    "$8,500 / mo", 8500, 12, "12 Weeks (Summer 2026)", "Seattle, WA", false, 4, 1,
                    "Build ranking algorithms that personalize item discovery for over 300 million Amazon global shoppers.");

            // TCS
            seedInternship("int-tcs-1", "comp-tcs", "Tata Consultancy Services (TCS)", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80",
                    "Enterprise Java & Spring Cloud Microservices Intern", "Tech",
                    List.of("Java 17", "Spring Boot", "Kafka", "PostgreSQL"),
                    "$3,000 / mo", 3000, 16, "16 Weeks (Fall 2026)", "Mumbai, India", true, 10, 4,
                    "Develop resilient enterprise microservices and Kafka streaming architectures for Tier-1 financial institutions.");

            seedInternship("int-tcs-2", "comp-tcs", "Tata Consultancy Services (TCS)", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80",
                    "Cloud Security & Governance Analyst Intern", "Tech",
                    List.of("Cybersecurity", "Cloud Architecture", "ISO 27001", "Python"),
                    "$2,800 / mo", 2800, 12, "12 Weeks (Fall 2026)", "Bangalore, India", true, 6, 2,
                    "Audit cloud compliance postures and implement automated vulnerability scanning across hybrid cloud deployments.");

            // NovaScale AI
            seedInternship("int-101", "comp-1", "NovaScale AI", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
                    "Frontend Engineering Intern (React & Three.js)", "Tech",
                    List.of("React", "TypeScript", "Three.js", "TailwindCSS", "WebGL"),
                    "$3,500 / mo", 3500, 12, "12 Weeks (Summer 2026)", "San Francisco, CA", true, 4, 2,
                    "Join our core web experience team to build real-time interactive dashboards for AI agent orchestration.");
        }
    }

    private void seedInternship(String id, String companyId, String companyName, String companyLogo,
                                String title, String category, List<String> skills, String stipend,
                                int stipendAmount, int durationWeeks, String durationText, String location,
                                boolean remote, int maxPositions, int filledPositions, String description) {
        Internship i = new Internship();
        i.setId(id);
        i.setCompanyId(companyId);
        i.setCompanyName(companyName);
        i.setCompanyLogo(companyLogo);
        i.setTitle(title);
        i.setCategory(category);
        i.setSkillsRequired(skills);
        i.setStipend(stipend);
        i.setStipendAmount(stipendAmount);
        i.setDurationWeeks(durationWeeks);
        i.setDurationText(durationText);
        i.setLocation(location);
        i.setRemote(remote);
        i.setMaxPositions(maxPositions);
        i.setFilledPositions(filledPositions);
        i.setDescription(description);
        i.setStatus("ACTIVE");
        internshipRepository.save(i);
    }

    public List<InternshipDto> getAllInternships(String category, Boolean remote, String search) {
        List<Internship> list = internshipRepository.findAll();

        return list.stream()
                .filter(i -> category == null || category.equalsIgnoreCase("All") || i.getCategory().equalsIgnoreCase(category))
                .filter(i -> remote == null || i.isRemote() == remote)
                .filter(i -> {
                    if (search == null || search.isBlank()) return true;
                    String q = search.toLowerCase();
                    return i.getTitle().toLowerCase().contains(q) ||
                            i.getCompanyName().toLowerCase().contains(q) ||
                            i.getDescription().toLowerCase().contains(q) ||
                            i.getSkillsRequired().stream().anyMatch(s -> s.toLowerCase().contains(q));
                })
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public InternshipDto getById(String id) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Internship listing not found: " + id));
        return toDto(internship);
    }

    @Transactional
    public InternshipDto createInternship(InternshipDto dto) {
        Internship internship = new Internship();
        internship.setCompanyId(dto.getCompanyId());
        internship.setCompanyName(dto.getCompanyName());
        internship.setCompanyLogo(dto.getCompanyLogo());
        internship.setTitle(dto.getTitle());
        internship.setDescription(dto.getDescription());
        internship.setCategory(dto.getCategory());
        internship.setSkillsRequired(dto.getSkillsRequired());
        internship.setStipend(dto.getStipend());
        internship.setStipendAmount(dto.getStipendAmount());
        internship.setDurationWeeks(dto.getDurationWeeks());
        internship.setDurationText(dto.getDurationText());
        internship.setLocation(dto.getLocation());
        internship.setRemote(dto.isRemote());
        internship.setMaxPositions(dto.getMaxPositions() != null ? dto.getMaxPositions() : 1);
        internship.setFilledPositions(0);
        internship.setStatus("ACTIVE");

        Internship saved = internshipRepository.save(internship);
        return toDto(saved);
    }

    @Transactional
    public boolean incrementFilledPositionsSafely(String internshipId) {
        Internship internship = internshipRepository.findByIdForUpdate(internshipId)
                .orElseThrow(() -> new IllegalArgumentException("Internship not found: " + internshipId));

        if (internship.getFilledPositions() >= internship.getMaxPositions()) {
            return false; // Capacity exceeded
        }

        internship.setFilledPositions(internship.getFilledPositions() + 1);
        internshipRepository.save(internship);
        return true;
    }

    public InternshipDto toDto(Internship internship) {
        InternshipDto dto = new InternshipDto();
        dto.setId(internship.getId());
        dto.setCompanyId(internship.getCompanyId());
        dto.setCompanyName(internship.getCompanyName());
        dto.setCompanyLogo(internship.getCompanyLogo());
        dto.setTitle(internship.getTitle());
        dto.setDescription(internship.getDescription());
        dto.setCategory(internship.getCategory());
        dto.setSkillsRequired(internship.getSkillsRequired());
        dto.setStipend(internship.getStipend());
        dto.setStipendAmount(internship.getStipendAmount());
        dto.setDurationWeeks(internship.getDurationWeeks());
        dto.setDurationText(internship.getDurationText());
        dto.setLocation(internship.getLocation());
        dto.setRemote(internship.isRemote());
        dto.setMaxPositions(internship.getMaxPositions());
        dto.setFilledPositions(internship.getFilledPositions());
        dto.setStatus(internship.getStatus());
        dto.setPostedAt(internship.getPostedAt());
        return dto;
    }
}
