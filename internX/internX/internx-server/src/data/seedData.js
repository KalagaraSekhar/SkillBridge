export const seedUsers = [
  {
    id: "usr-1",
    name: "Alex Rivera",
    email: "student@internx.dev",
    password: "$2a$10$wEkgz3u4ZgU6P4nEw6v77.q4n3U9rK5aV1k8n3u4ZgU6P4nEw6v77", // password: password123
    phone: "+1 (555) 234-5678",
    role: "STUDENT",
    emailVerified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    university: "Stanford University",
    major: "Computer Science & Design",
    gradYear: "2026",
    resumeUrl: "Alex_Rivera_Resume_2026.pdf",
    skills: ["React", "TypeScript", "Node.js", "Figma", "TailwindCSS", "Python", "Go", "AWS", "SQL"]
  },
  {
    id: "usr-google",
    name: "Google University Recruiting",
    email: "google@internx.dev",
    password: "$2a$10$wEkgz3u4ZgU6P4nEw6v77.q4n3U9rK5aV1k8n3u4ZgU6P4nEw6v77",
    phone: "+1 (555) 650-0000",
    role: "COMPANY",
    companyId: "comp-google",
    emailVerified: true,
    avatar: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80",
    companyName: "Google LLC",
    designation: "Lead University Talent Partner"
  },
  {
    id: "usr-microsoft",
    name: "Microsoft Aspire Talent",
    email: "microsoft@internx.dev",
    password: "$2a$10$wEkgz3u4ZgU6P4nEw6v77.q4n3U9rK5aV1k8n3u4ZgU6P4nEw6v77",
    phone: "+1 (555) 425-0000",
    role: "COMPANY",
    companyId: "comp-microsoft",
    emailVerified: true,
    avatar: "https://images.unsplash.com/photo-1642132652075-2bfa3224765d?w=150&auto=format&fit=crop&q=80",
    companyName: "Microsoft Corporation",
    designation: "Principal Technical Recruiter"
  },
  {
    id: "usr-amazon",
    name: "Amazon Student Programs",
    email: "amazon@internx.dev",
    password: "$2a$10$wEkgz3u4ZgU6P4nEw6v77.q4n3U9rK5aV1k8n3u4ZgU6P4nEw6v77",
    phone: "+1 (555) 206-0000",
    role: "COMPANY",
    companyId: "comp-amazon",
    emailVerified: true,
    avatar: "https://images.unsplash.com/photo-1523474253243-231a51138b38?w=150&auto=format&fit=crop&q=80",
    companyName: "Amazon",
    designation: "Senior University Programs Manager"
  },
  {
    id: "usr-tcs",
    name: "TCS Campus Talent",
    email: "tcs@internx.dev",
    password: "$2a$10$wEkgz3u4ZgU6P4nEw6v77.q4n3U9rK5aV1k8n3u4ZgU6P4nEw6v77",
    phone: "+91 22 6778 9999",
    role: "COMPANY",
    companyId: "comp-tcs",
    emailVerified: true,
    avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80",
    companyName: "Tata Consultancy Services (TCS)",
    designation: "Global Campus Talent Leader"
  },
  {
    id: "usr-2",
    name: "Elena Rostova",
    email: "company@internx.dev",
    password: "$2a$10$wEkgz3u4ZgU6P4nEw6v77.q4n3U9rK5aV1k8n3u4ZgU6P4nEw6v77",
    phone: "+1 (555) 876-5432",
    role: "COMPANY",
    companyId: "comp-1",
    emailVerified: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    companyName: "NovaScale AI",
    designation: "Head of Talent Acquisition"
  },
  {
    id: "usr-3",
    name: "Marcus Vance",
    email: "admin@internx.dev",
    password: "$2a$10$wEkgz3u4ZgU6P4nEw6v77.q4n3U9rK5aV1k8n3u4ZgU6P4nEw6v77",
    phone: "+1 (555) 999-0000",
    role: "ADMIN",
    emailVerified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  }
];

export const seedCompanies = [
  {
    id: "comp-google",
    name: "Google LLC",
    website: "https://careers.google.com",
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80",
    category: "Tech",
    location: "Mountain View, CA",
    about: "Organizing the world's information and making it universally accessible and useful through AI, Cloud, and web technologies.",
    approvedStatus: "APPROVED",
    ownerUserId: "usr-google",
    foundedYear: "1998",
    employeeCount: "100000+"
  },
  {
    id: "comp-microsoft",
    name: "Microsoft Corporation",
    website: "https://careers.microsoft.com",
    logo: "https://images.unsplash.com/photo-1642132652075-2bfa3224765d?w=120&auto=format&fit=crop&q=80",
    category: "Tech",
    location: "Redmond, WA",
    about: "Empowering every person and every organization on the planet to achieve more with Azure, Windows, and AI Copilots.",
    approvedStatus: "APPROVED",
    ownerUserId: "usr-microsoft",
    foundedYear: "1975",
    employeeCount: "100000+"
  },
  {
    id: "comp-amazon",
    name: "Amazon",
    website: "https://amazon.jobs",
    logo: "https://images.unsplash.com/photo-1523474253243-231a51138b38?w=120&auto=format&fit=crop&q=80",
    category: "Tech",
    location: "Seattle, WA",
    about: "Global pioneer in e-commerce, cloud computing with AWS, digital streaming, and artificial intelligence.",
    approvedStatus: "APPROVED",
    ownerUserId: "usr-amazon",
    foundedYear: "1994",
    employeeCount: "100000+"
  },
  {
    id: "comp-tcs",
    name: "Tata Consultancy Services (TCS)",
    website: "https://www.tcs.com",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80",
    category: "Tech",
    location: "Mumbai, India",
    about: "Leading global IT services, consulting, and business solutions organization transforming Fortune 500 enterprises.",
    approvedStatus: "APPROVED",
    ownerUserId: "usr-tcs",
    foundedYear: "1968",
    employeeCount: "500000+"
  },
  {
    id: "comp-1",
    name: "NovaScale AI",
    website: "https://novascale.ai",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    category: "Tech",
    location: "San Francisco, CA",
    about: "Building the next-generation distributed inference engine for autonomous AI agents.",
    approvedStatus: "APPROVED",
    ownerUserId: "usr-2",
    foundedYear: "2022",
    employeeCount: "45-100"
  },
  {
    id: "comp-2",
    name: "Aura Studio Design",
    website: "https://aurastudio.design",
    logo: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=120&auto=format&fit=crop&q=80",
    category: "Design",
    location: "New York, NY",
    about: "Award-winning product design and digital brand identity studio for high-growth tech startups.",
    approvedStatus: "APPROVED",
    ownerUserId: "usr-4",
    foundedYear: "2020",
    employeeCount: "20-50"
  },
  {
    id: "comp-3",
    name: "PulseWave Growth Lab",
    website: "https://pulsewave.io",
    logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80",
    category: "Marketing",
    location: "Austin, TX",
    about: "Data-driven growth marketing agency powering Series A to D SaaS companies across North America.",
    approvedStatus: "APPROVED",
    ownerUserId: "usr-5",
    foundedYear: "2021",
    employeeCount: "30-70"
  },
  {
    id: "comp-4",
    name: "QuantumEdge Data",
    website: "https://quantumedge.io",
    logo: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=120&auto=format&fit=crop&q=80",
    category: "Data",
    location: "Seattle, WA",
    about: "Enterprise data platform solving extreme-scale analytics and streaming ETL workflows.",
    approvedStatus: "PENDING",
    ownerUserId: "usr-6",
    foundedYear: "2023",
    employeeCount: "15-30"
  }
];

export const seedInternships = [
  {
    id: "int-g-1",
    companyId: "comp-google",
    companyName: "Google LLC",
    companyLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80",
    title: "Software Engineering Intern (Cloud Systems & Go)",
    category: "Tech",
    stipend: "$8,200 / mo",
    stipendAmount: 8200,
    durationWeeks: 12,
    durationText: "12 Weeks (Summer 2026)",
    location: "Mountain View, CA",
    remote: true,
    status: "ACTIVE",
    maxPositions: 6,
    filledPositions: 2,
    postedAt: "2026-08-20T10:00:00Z",
    skillsRequired: ["Go", "Kubernetes", "Distributed Systems", "gRPC", "Docker", "Linux"],
    description: "Join Google Cloud Core Infrastructure to build planetary-scale storage and compute systems using Go, C++, and Kubernetes.",
    responsibilities: [
      "Design and deploy high-throughput microservices handling millions of queries per second",
      "Optimize gRPC RPC endpoints for low latency across distributed Google datacenters",
      "Collaborate with senior Staff engineers on open source container orchestration tools"
    ],
    requirements: [
      "Solid CS fundamentals in algorithms, data structures, and concurrency",
      "Hands-on project experience in Go, C++, or Rust"
    ],
    perks: ["1-on-1 mentorship with Staff Engineer", "Full housing stipend", "$10,000 hardware allowance", "Full-time return offer pipeline"]
  },
  {
    id: "int-g-2",
    companyId: "comp-google",
    companyName: "Google LLC",
    companyLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80",
    title: "AI & Machine Learning Research Intern (Gemini)",
    category: "Data",
    stipend: "$9,000 / mo",
    stipendAmount: 9000,
    durationWeeks: 14,
    durationText: "14 Weeks (Summer 2026)",
    location: "Mountain View, CA",
    remote: false,
    status: "ACTIVE",
    maxPositions: 4,
    filledPositions: 1,
    postedAt: "2026-08-21T11:00:00Z",
    skillsRequired: ["Python", "PyTorch", "Transformers", "JAX", "NLP", "Computer Vision"],
    description: "Work alongside Google DeepMind researchers to push the frontiers of multimodal reasoning and neural architecture design.",
    responsibilities: [
      "Conduct empirical experiments on large-scale multimodal neural networks",
      "Benchmark token efficiency across specialized transformer attention heads",
      "Co-author research publications for top-tier AI venues"
    ],
    requirements: [
      "Strong background in deep learning, linear algebra, and PyTorch/JAX",
      "Prior machine learning projects or research publications are a plus"
    ],
    perks: ["TPU v5e compute cluster access", "Publication co-authorship", "Executive research mentorship"]
  },
  {
    id: "int-g-3",
    companyId: "comp-google",
    companyName: "Google LLC",
    companyLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80",
    title: "UX & Design Systems Intern (Material Design)",
    category: "Design",
    stipend: "$7,500 / mo",
    stipendAmount: 7500,
    durationWeeks: 12,
    durationText: "12 Weeks (Summer 2026)",
    location: "New York, NY",
    remote: true,
    status: "ACTIVE",
    maxPositions: 3,
    filledPositions: 1,
    postedAt: "2026-08-22T09:30:00Z",
    skillsRequired: ["Figma", "Design Systems", "Prototyping", "User Research", "WCAG"],
    description: "Shape the next iteration of Material You design components across web, Android, and interactive cross-platform experiences.",
    responsibilities: [
      "Create high-fidelity interactive component prototypes in Figma",
      "Conduct usability tests with diverse global user cohorts",
      "Deliver design tokens and spec documents to Android and Web engineering teams"
    ],
    requirements: [
      "Strong portfolio demonstrating user-centered product design process",
      "Deep understanding of accessibility (WCAG 2.1) and typography"
    ],
    perks: ["Direct mentorship with VP of Design", "NYC office experience with gourmet dining", "Design conference ticket"]
  },
  {
    id: "int-ms-1",
    companyId: "comp-microsoft",
    companyName: "Microsoft Corporation",
    companyLogo: "https://images.unsplash.com/photo-1642132652075-2bfa3224765d?w=120&auto=format&fit=crop&q=80",
    title: "Cloud & DevOps Engineering Intern (Azure)",
    category: "Tech",
    stipend: "$7,800 / mo",
    stipendAmount: 7800,
    durationWeeks: 12,
    durationText: "12 Weeks (Summer 2026)",
    location: "Redmond, WA",
    remote: true,
    status: "ACTIVE",
    maxPositions: 5,
    filledPositions: 2,
    postedAt: "2026-08-20T14:00:00Z",
    skillsRequired: ["Azure", "Terraform", "C#", ".NET Core", "Docker", "Kubernetes"],
    description: "Help scale Azure infrastructure-as-code pipelines, telemetry aggregation, and automated chaos testing for tier-0 cloud services.",
    responsibilities: [
      "Build automated CI/CD deployment pipelines using GitHub Actions and Terraform",
      "Implement observability dashboards using Azure Monitor and OpenTelemetry",
      "Improve container orchestration efficiency on Azure Kubernetes Service (AKS)"
    ],
    requirements: [
      "Experience with cloud fundamentals, Linux administration, and scripting",
      "Familiarity with C# or Python and container technologies"
    ],
    perks: ["Surface Laptop Studio 2 provided", "Azure certification sponsorship", "Hybrid flex schedule"]
  },
  {
    id: "int-ms-2",
    companyId: "comp-microsoft",
    companyName: "Microsoft Corporation",
    companyLogo: "https://images.unsplash.com/photo-1642132652075-2bfa3224765d?w=120&auto=format&fit=crop&q=80",
    title: "Data Analytics & Business Intelligence Intern",
    category: "Data",
    stipend: "$6,800 / mo",
    stipendAmount: 6800,
    durationWeeks: 10,
    durationText: "10 Weeks (Summer 2026)",
    location: "Redmond, WA",
    remote: true,
    status: "ACTIVE",
    maxPositions: 4,
    filledPositions: 1,
    postedAt: "2026-08-21T15:00:00Z",
    skillsRequired: ["PowerBI", "SQL", "Azure Synapse", "Python", "Data Modeling"],
    description: "Transform petabytes of developer ecosystem telemetry into actionable product insights for Microsoft Developer Division.",
    responsibilities: [
      "Write optimized SQL queries and ETL pipelines in Azure Synapse Analytics",
      "Build real-time Power BI reporting dashboards for executive leadership",
      "Model user retention and conversion funnels across VS Code and GitHub"
    ],
    requirements: [
      "Strong proficiency with SQL and statistical data analysis in Python",
      "Experience visualizing multi-dimensional datasets"
    ],
    perks: ["Mentorship by Principal Data Scientists", "Relocation package", "Full conversion pathway"]
  },
  {
    id: "int-amz-1",
    companyId: "comp-amazon",
    companyName: "Amazon",
    companyLogo: "https://images.unsplash.com/photo-1523474253243-231a51138b38?w=120&auto=format&fit=crop&q=80",
    title: "Software Development Engineer Intern (AWS Serverless)",
    category: "Tech",
    stipend: "$8,000 / mo",
    stipendAmount: 8000,
    durationWeeks: 12,
    durationText: "12 Weeks (Summer 2026)",
    location: "Seattle, WA",
    remote: true,
    status: "ACTIVE",
    maxPositions: 8,
    filledPositions: 3,
    postedAt: "2026-08-19T08:00:00Z",
    skillsRequired: ["Java", "AWS Lambda", "DynamoDB", "TypeScript", "CloudFormation"],
    description: "Design and implement resilient, low-latency microservices powering AWS Serverless event routing and DynamoDB integrations.",
    responsibilities: [
      "Develop asynchronous event processing microservices with Java and AWS SDK",
      "Design schema models for high-throughput NoSQL tables in DynamoDB",
      "Participate in design reviews and operational readiness audits"
    ],
    requirements: [
      "Solid understanding of Object-Oriented Programming (Java, C++, or Python)",
      "Excitement to learn and apply AWS cloud architecture best practices"
    ],
    perks: ["Competitive stipend", "AWS Cloud Practitioner & Architect certifications", "Dedicated mentor"]
  },
  {
    id: "int-tcs-1",
    companyId: "comp-tcs",
    companyName: "Tata Consultancy Services (TCS)",
    companyLogo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80",
    title: "Enterprise Java & Spring Cloud Microservices Intern",
    category: "Tech",
    stipend: "$3,000 / mo",
    stipendAmount: 3000,
    durationWeeks: 16,
    durationText: "16 Weeks (Fall 2026)",
    location: "Mumbai, India",
    remote: true,
    status: "ACTIVE",
    maxPositions: 10,
    filledPositions: 4,
    postedAt: "2026-08-18T10:00:00Z",
    skillsRequired: ["Java 17", "Spring Boot", "Kafka", "PostgreSQL", "Docker", "REST API"],
    description: "Develop resilient banking and enterprise microservices using Spring Boot 3, Kafka event streams, and PostgreSQL databases.",
    responsibilities: [
      "Implement RESTful APIs with automated validation and JWT security",
      "Integrate Kafka producers and consumers for asynchronous transaction events",
      "Write unit tests with JUnit 5 and Mockito achieving >85% code coverage"
    ],
    requirements: [
      "Strong Java programming skills and understanding of Spring Framework",
      "Familiarity with relational database design and SQL queries"
    ],
    perks: ["TCS Digital Fast-Track Conversion", "Global project exposure", "Hands-on cloud lab environments"]
  },
  {
    id: "int-101",
    companyId: "comp-1",
    companyName: "NovaScale AI",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    title: "Frontend Engineering Intern (React & Three.js)",
    category: "Tech",
    stipend: "$3,500 / mo",
    stipendAmount: 3500,
    durationWeeks: 12,
    durationText: "12 Weeks (Summer 2026)",
    location: "San Francisco, CA",
    remote: true,
    status: "ACTIVE",
    maxPositions: 4,
    filledPositions: 2,
    postedAt: "2026-08-22T14:30:00Z",
    skillsRequired: ["React", "TypeScript", "Three.js", "TailwindCSS", "WebGL"],
    description: "Join our core web experience team to build real-time interactive dashboards for AI agent orchestration. You'll work directly with founding engineers on WebGL visualizations.",
    responsibilities: [
      "Develop performant React components for large-scale telemetry visualizations",
      "Collaborate with product designers to implement pixel-perfect micro-interactions",
      "Participate in daily engineering standups and sprint planning"
    ],
    requirements: [
      "Strong proficiency with modern React (hooks, context, state management)",
      "Excitement for 3D web graphics and interactive UI design"
    ],
    perks: ["Founder 1-on-1 mentorship", "Generous equity grant upon conversion", "Remote workstation stipend"]
  },
  {
    id: "int-102",
    companyId: "comp-2",
    companyName: "Aura Studio Design",
    companyLogo: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=120&auto=format&fit=crop&q=80",
    title: "Product Design (UI/UX) Intern",
    category: "Design",
    stipend: "$2,800 / mo",
    stipendAmount: 2800,
    durationWeeks: 10,
    durationText: "10 Weeks (Summer 2026)",
    location: "New York, NY",
    remote: true,
    status: "ACTIVE",
    maxPositions: 2,
    filledPositions: 1,
    postedAt: "2026-08-23T12:00:00Z",
    skillsRequired: ["Figma", "Design Systems", "Prototyping", "User Research", "Wireframing"],
    description: "Design sleek, accessible digital interfaces for fast-growing SaaS startups in collaboration with world-class art directors.",
    responsibilities: [
      "Create high-fidelity UI screens and interactive prototypes in Figma",
      "Conduct user research interviews and translate findings into journey maps"
    ],
    requirements: [
      "Portfolio showcasing UI/UX case studies and visual polish",
      "Strong understanding of typography, grids, and accessibility"
    ],
    perks: ["Figma Enterprise license", "Mentorship with award-winning art directors", "Portfolio showcase feature"]
  }
];

export const seedApplications = [
  {
    id: "app-301",
    studentId: "usr-1",
    studentName: "Alex Rivera",
    studentEmail: "student@internx.dev",
    studentUniversity: "Stanford University",
    internshipId: "int-g-1",
    internshipTitle: "Software Engineering Intern (Cloud Systems & Go)",
    companyId: "comp-google",
    companyName: "Google LLC",
    companyLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80",
    category: "Tech",
    stipend: "$8,200 / mo",
    appliedAt: "2026-08-25T10:30:00Z",
    status: "APPLIED",
    resumeUrl: "Alex_Rivera_Resume_2026.pdf",
    coverNote: "I have built distributed systems in Go and would love to contribute to Google Cloud's core storage infrastructure.",
    matchScore: 96
  },
  {
    id: "app-302",
    studentId: "usr-1",
    studentName: "Alex Rivera",
    studentEmail: "student@internx.dev",
    studentUniversity: "Stanford University",
    internshipId: "int-ms-1",
    internshipTitle: "Cloud & DevOps Engineering Intern (Azure)",
    companyId: "comp-microsoft",
    companyName: "Microsoft Corporation",
    companyLogo: "https://images.unsplash.com/photo-1642132652075-2bfa3224765d?w=120&auto=format&fit=crop&q=80",
    category: "Tech",
    stipend: "$7,800 / mo",
    appliedAt: "2026-08-24T14:15:00Z",
    status: "SHORTLISTED",
    resumeUrl: "Alex_Rivera_Resume_2026.pdf",
    coverNote: "Excited about automated cloud infrastructure, Terraform modules, and Azure Kubernetes Service.",
    matchScore: 92
  },
  {
    id: "app-303",
    studentId: "usr-1",
    studentName: "Alex Rivera",
    studentEmail: "student@internx.dev",
    studentUniversity: "Stanford University",
    internshipId: "int-amz-1",
    internshipTitle: "Software Development Engineer Intern (AWS Serverless)",
    companyId: "comp-amazon",
    companyName: "Amazon",
    companyLogo: "https://images.unsplash.com/photo-1523474253243-231a51138b38?w=120&auto=format&fit=crop&q=80",
    category: "Tech",
    stipend: "$8,000 / mo",
    appliedAt: "2026-08-23T09:00:00Z",
    status: "APPLIED",
    resumeUrl: "Alex_Rivera_Resume_2026.pdf",
    coverNote: "AWS certified developer with experience building Lambda event-driven pipelines and DynamoDB data models.",
    matchScore: 90
  },
  {
    id: "app-304",
    studentId: "usr-1",
    studentName: "Alex Rivera",
    studentEmail: "student@internx.dev",
    studentUniversity: "Stanford University",
    internshipId: "int-tcs-1",
    internshipTitle: "Enterprise Java & Spring Cloud Microservices Intern",
    companyId: "comp-tcs",
    companyName: "Tata Consultancy Services (TCS)",
    companyLogo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80",
    category: "Tech",
    stipend: "$3,000 / mo",
    appliedAt: "2026-08-22T16:20:00Z",
    status: "SELECTED",
    resumeUrl: "Alex_Rivera_Resume_2026.pdf",
    coverNote: "Strong Spring Boot and PostgreSQL backend skills with practical experience in microservice event architectures.",
    matchScore: 94
  },
  {
    id: "app-305",
    studentId: "usr-7",
    studentName: "Sophia Chen",
    studentEmail: "sophia.chen@berkeley.edu",
    studentUniversity: "UC Berkeley",
    internshipId: "int-g-1",
    internshipTitle: "Software Engineering Intern (Cloud Systems & Go)",
    companyId: "comp-google",
    companyName: "Google LLC",
    companyLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80",
    category: "Tech",
    stipend: "$8,200 / mo",
    appliedAt: "2026-08-26T11:45:00Z",
    status: "APPLIED",
    resumeUrl: "Sophia_Chen_Resume.pdf",
    coverNote: "Experienced in distributed systems, Go, and high-concurrency computing.",
    matchScore: 95
  }
];

export const seedNotifications = [
  {
    id: "notif-1",
    studentEmail: "student@internx.dev",
    studentId: "usr-1",
    title: "Application Selected! 🎉",
    message: "Congratulations! Your application for Enterprise Java & Spring Cloud Microservices Intern at Tata Consultancy Services (TCS) was SELECTED!",
    type: "success",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    read: false
  },
  {
    id: "notif-2",
    studentEmail: "student@internx.dev",
    studentId: "usr-1",
    title: "Application Shortlisted 🌟",
    message: "Your application for Cloud & DevOps Engineering Intern (Azure) at Microsoft Corporation has been shortlisted for technical interviews.",
    type: "info",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    read: true
  }
];

export const seedConversations = [
  {
    id: "conv-1",
    studentId: "usr-1",
    studentName: "Alex Rivera",
    studentEmail: "student@internx.dev",
    companyId: "comp-google",
    companyName: "Google LLC",
    internshipId: "int-g-1",
    internshipTitle: "Software Engineering Intern (Cloud Systems & Go)",
    lastMessage: "Hi Alex! We reviewed your Go systems projects and would like to schedule an introductory chat.",
    lastMessageAt: new Date(Date.now() - 7200000).toISOString(),
    messages: [
      {
        id: "msg-1",
        senderId: "usr-google",
        senderName: "Google University Recruiting",
        senderRole: "COMPANY",
        text: "Hi Alex! Thanks for applying to Google Cloud Core Infrastructure. We were impressed by your distributed systems coursework.",
        timestamp: new Date(Date.now() - 14400000).toISOString()
      },
      {
        id: "msg-2",
        senderId: "usr-1",
        senderName: "Alex Rivera",
        senderRole: "STUDENT",
        text: "Thank you so much! I am very excited about the scale Google Cloud operates at.",
        timestamp: new Date(Date.now() - 10800000).toISOString()
      },
      {
        id: "msg-3",
        senderId: "usr-google",
        senderName: "Google University Recruiting",
        senderRole: "COMPANY",
        text: "Hi Alex! We reviewed your Go systems projects and would like to schedule an introductory chat.",
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ]
  }
];
