package com.internx.company.service;

import com.internx.common.enums.CompanyStatus;
import com.internx.company.entity.Company;
import com.internx.company.repository.CompanyRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @PostConstruct
    public void seedCompanies() {
        if (companyRepository.count() == 0) {
            seedCompany("comp-google", "Google LLC", "https://careers.google.com", "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80", "Tech", "Mountain View, CA", "Organizing the world's information and making it universally accessible and useful.", CompanyStatus.APPROVED, "20000+");
            seedCompany("comp-microsoft", "Microsoft Corporation", "https://careers.microsoft.com", "https://images.unsplash.com/photo-1642132652075-2bfa3224765d?w=120&auto=format&fit=crop&q=80", "Tech", "Redmond, WA", "Empowering every person and every organization on the planet to achieve more.", CompanyStatus.APPROVED, "50000+");
            seedCompany("comp-amazon", "Amazon", "https://amazon.jobs", "https://images.unsplash.com/photo-1523474253243-231a51138b38?w=120&auto=format&fit=crop&q=80", "Tech", "Seattle, WA", "Guided by four principles: customer obsession, passion for invention, commitment to excellence, and long-term thinking.", CompanyStatus.APPROVED, "100000+");
            seedCompany("comp-tcs", "Tata Consultancy Services (TCS)", "https://www.tcs.com/careers", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80", "Tech", "Mumbai, India", "Leading global IT services, consulting, and business solutions organization transforming world-class enterprises.", CompanyStatus.APPROVED, "500000+");
            seedCompany("comp-1", "NovaScale AI", "https://novascale.ai", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80", "Tech", "San Francisco, CA", "Building next-generation distributed inference engine for autonomous agents.", CompanyStatus.APPROVED, "45-100");
        }
    }

    private void seedCompany(String id, String name, String website, String logo, String category, String location, String about, CompanyStatus status, String employeeCount) {
        Company c = new Company();
        c.setId(id);
        c.setName(name);
        c.setWebsite(website);
        c.setLogo(logo);
        c.setCategory(category);
        c.setLocation(location);
        c.setAbout(about);
        c.setApprovedStatus(status);
        c.setEmployeeCount(employeeCount);
        companyRepository.save(c);
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public List<Company> getPendingCompanies() {
        return companyRepository.findByApprovedStatus(CompanyStatus.PENDING);
    }

    public Company getById(String id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Company not found: " + id));
    }

    public Company registerCompany(Company company) {
        company.setApprovedStatus(CompanyStatus.PENDING);
        return companyRepository.save(company);
    }

    public Company updateApprovalStatus(String id, CompanyStatus status) {
        Company comp = getById(id);
        comp.setApprovedStatus(status);
        return companyRepository.save(comp);
    }
}
