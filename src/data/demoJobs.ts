import { JobListing, UserPreferences } from '../types';

export const DEMO_PREFERENCES: UserPreferences = {
  targetRole: 'Frontend Engineer',
  targetExperience: 'entry',
  preferredLocations: ['Bengaluru', 'Remote', 'Pune'],
  preferredWorkModes: ['remote', 'hybrid'],
  skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Git', 'REST API'],
  minSalaryInr: 600000,
};

// Anchor reference date for relative timestamps (October 2026)
const NOW = new Date('2026-10-18T10:00:00.000Z').getTime();

const hoursAgo = (h: number): string => new Date(NOW - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number): string =>
  new Date(NOW - d * 24 * 60 * 60 * 1000).toISOString();

export const DEMO_JOBS: JobListing[] = [
  {
    id: 'opp-in-001',
    title: 'Frontend Engineering Intern',
    company: {
      id: 'comp-01',
      name: 'Kavach Technologies',
      location: 'Bengaluru, Karnataka',
      tagline: 'Modern payment security and fraud detection APIs',
      size: '51-200',
      industry: 'FinTech',
      websiteUrl: 'https://example.com/kavach',
    },
    location: 'Bengaluru, Karnataka',
    workMode: 'hybrid',
    experienceLevel: 'internship',
    category: 'frontend',
    salary: {
      min: 35000,
      max: 45000,
      currency: 'INR',
      period: 'monthly',
      display: '₹35,000 – 45,000/mo',
    },
    requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
    preferredSkills: ['TypeScript', 'Tailwind CSS', 'Next.js'],
    description:
      'Join our core merchant dashboard team as a Frontend Engineering Intern. You will work alongside staff engineers to build fast, accessible transaction monitors and verification flows utilized by thousands of Indian online merchants.',
    responsibilities: [
      'Implement accessible and reusable React components according to design specifications.',
      'Collaborate with backend engineers to integrate REST APIs and WebSocket status feeds.',
      'Write comprehensive unit tests with Vitest and React Testing Library.',
      'Diagnose and address UI rendering bottlenecks on mobile and desktop viewports.',
    ],
    qualifications: [
      'Pursuing or recently completed B.Tech / B.E. / BCA / MCA in Computer Science or related engineering discipline.',
      'Demonstrated portfolio or personal projects showcasing modern React and CSS.',
      'Solid foundation in JavaScript fundamentals (ES6+, DOM APIs, async/await).',
      'Comfortable with Git workflows (branches, PRs, code reviews).',
    ],
    benefits: [
      'Pre-Placement Offer (PPO) opportunity based on 6-month internship performance.',
      'Monthly wellness stipend & high-end developer laptop provided.',
      'Mentorship pairing with a Senior Frontend Engineer.',
      'Flexible working hours with 2 remote days per week.',
    ],
    postedAt: hoursAgo(4), // 4 hours ago -> Fresh today!
    isFresh: true,
    isFeatured: true,
    demoNotice:
      'Demonstration listing for portfolio testing — not a genuine external vacancy.',
  },
  {
    id: 'opp-in-002',
    title: 'Junior React Developer',
    company: {
      id: 'comp-02',
      name: 'Zypher Health',
      location: 'Hyderabad, Telangana',
      tagline: 'Telemedicine and clinical patient management platform',
      size: '201-1000',
      industry: 'HealthTech',
    },
    location: 'Hyderabad, Telangana',
    workMode: 'onsite',
    experienceLevel: 'junior',
    category: 'frontend',
    salary: {
      min: 700000,
      max: 1000000,
      currency: 'INR',
      period: 'yearly',
      display: '₹7.0 – 10.0 LPA',
    },
    requiredSkills: ['React', 'TypeScript', 'State Management', 'REST API'],
    preferredSkills: ['TanStack Query', 'Chart.js', 'WCAG Accessibility'],
    description:
      'Zypher Health is building the next generation of clinical interfaces for Indian hospitals and diagnostic clinics. We are looking for a Junior React Developer passionate about user experience, data visualization, and web performance.',
    responsibilities: [
      'Develop interactive patient vitals dashboards and appointment scheduling modules.',
      'Ensure high standards of accessibility (WCAG 2.2 AA) across clinical interfaces.',
      'Optimize client-side caching using TanStack Query to minimize network roundtrips.',
      'Participate actively in architectural discussions and code reviews.',
    ],
    qualifications: [
      '1–2 years of practical experience with React, TypeScript, and modern state patterns.',
      'Strong understanding of component lifecycle, custom hooks, and memoization patterns.',
      'Proven ability to translate Figma specs into clean, responsive CSS.',
    ],
    benefits: [
      'Comprehensive family medical insurance including parents.',
      'Annual learning allowance of ₹40,000 for courses and conferences.',
      'Catered daily lunch at the Hyderabad Hitec City campus.',
    ],
    postedAt: hoursAgo(14), // 14 hours ago -> Fresh today!
    isFresh: true,
    demoNotice:
      'Demonstration listing for portfolio testing — not a genuine external vacancy.',
  },
  {
    id: 'opp-in-003',
    title: 'Associate Software Engineer - Frontend',
    company: {
      id: 'comp-03',
      name: 'Prism Data Labs',
      location: 'Gurugram, Haryana',
      tagline: 'Developer observability and distributed logging tools',
      size: '11-50',
      industry: 'DevTools & SaaS',
    },
    location: 'Gurugram, Haryana',
    workMode: 'remote',
    experienceLevel: 'entry',
    category: 'frontend',
    salary: {
      min: 900000,
      max: 1300000,
      currency: 'INR',
      period: 'yearly',
      display: '₹9.0 – 13.0 LPA',
    },
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'CSS Modules', 'Git'],
    preferredSkills: ['WebSockets', 'Canvas API', 'Core Web Vitals'],
    description:
      'Prism Data Labs is an engineering-first startup building observability dashboards. As an Associate Frontend Engineer, you will craft high-frequency log stream viewers, filter builders, and telemetry visualizers capable of rendering thousands of events per second.',
    responsibilities: [
      'Build real-time streaming interfaces using WebSockets and virtualized lists.',
      'Collaborate on client-side state models that stay responsive under high telemetry volume.',
      'Write clean, strictly typed TypeScript with unit and end-to-end test coverage.',
      'Audit and optimize Core Web Vitals (LCP, INP, CLS) across all core routes.',
    ],
    qualifications: [
      '0–1 year of relevant frontend experience or strong open-source project portfolio.',
      'Proficiency in TypeScript strict mode and modern React patterns.',
      'Familiarity with event streaming or real-time web mechanics is a plus.',
    ],
    benefits: [
      '100% remote work policy across India with ₹60,000 home office setup budget.',
      'Flexible paid time off (PTO) policy and mental health wellness days.',
      'Generous equity options grant (ESOPs).',
    ],
    postedAt: hoursAgo(22), // 22 hours ago -> Fresh today!
    isFresh: true,
    isFeatured: true,
    demoNotice:
      'Demonstration listing for portfolio testing — not a genuine external vacancy.',
  },
  {
    id: 'opp-in-004',
    title: 'Junior Web Developer (UI & Design Systems)',
    company: {
      id: 'comp-04',
      name: 'Vriksha Commerce',
      location: 'Bengaluru, Karnataka',
      tagline: 'D2C platform empowering local Indian artisans and brands',
      size: '51-200',
      industry: 'E-Commerce',
    },
    location: 'Bengaluru, Karnataka',
    workMode: 'hybrid',
    experienceLevel: 'entry',
    category: 'frontend',
    salary: {
      min: 650000,
      max: 900000,
      currency: 'INR',
      period: 'yearly',
      display: '₹6.5 – 9.0 LPA',
    },
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Figma'],
    preferredSkills: ['Design Tokens', 'Storybook', 'Accessibility'],
    description:
      'Help us scale the Vriksha design system across our merchant portals and consumer checkout experiences. You will maintain reusable UI components, enforce token consistency, and advocate for accessible, mobile-first design.',
    responsibilities: [
      'Translate design tokens and component specs into modular React components.',
      'Ensure strict WCAG 2.2 AA contrast and keyboard accessibility compliance.',
      'Collaborate with product designers to resolve edge cases in responsive layouts.',
      'Document component props, usage patterns, and accessibility guidelines.',
    ],
    qualifications: [
      'Bachelor’s degree or equivalent practical experience in frontend development.',
      'Exceptional eye for typographic hierarchy, spacing rhythm, and micro-interactions.',
      'Strong grasp of CSS custom properties, flexbox, and CSS grid.',
    ],
    benefits: [
      'Hybrid work model (3 days office in Indiranagar, 2 days remote).',
      'Annual book and professional development stipend.',
      'Comprehensive health coverage for self and spouse.',
    ],
    postedAt: daysAgo(1), // 1 day ago -> 24h-48h fresh
    isFresh: true,
    demoNotice:
      'Demonstration listing for portfolio testing — not a genuine external vacancy.',
  },
  {
    id: 'opp-in-005',
    title: 'Full-Stack Developer (Entry-Level)',
    company: {
      id: 'comp-05',
      name: 'Nirvana Logistics',
      location: 'Pune, Maharashtra',
      tagline: 'Autonomous supply chain intelligence and route optimization',
      size: '201-1000',
      industry: 'Logistics Tech',
    },
    location: 'Pune, Maharashtra',
    workMode: 'hybrid',
    experienceLevel: 'entry',
    category: 'fullstack',
    salary: {
      min: 750000,
      max: 1100000,
      currency: 'INR',
      period: 'yearly',
      display: '₹7.5 – 11.0 LPA',
    },
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'SQL', 'REST API'],
    preferredSkills: ['PostgreSQL', 'Docker', 'Redis'],
    description:
      'Nirvana Logistics coordinates fleet operations for top FMCG brands across India. We seek a passionate entry-level Full-Stack Developer to work across our dispatch coordinator portal and backend API microservices.',
    responsibilities: [
      'Build end-to-end tracking views for warehouse managers and logistics coordinators.',
      'Implement robust REST endpoints with validation and error handling in Node.js/TypeScript.',
      'Optimize database queries and client-side data synchronization.',
      'Contribute to automated CI/CD pipeline tests and deployments.',
    ],
    qualifications: [
      'Solid command over JavaScript/TypeScript on both client and server runtimes.',
      'Experience building relational database schemas (SQL) and writing structured queries.',
      'Demonstrated curiosity and problem-solving aptitude.',
    ],
    benefits: [
      'Pune Magarpatta campus with state-of-the-art facilities.',
      'Quarterly company performance bonuses.',
      'Relocation assistance package for candidates moving to Pune.',
    ],
    postedAt: daysAgo(2), // 2 days ago
    isFresh: true,
    demoNotice:
      'Demonstration listing for portfolio testing — not a genuine external vacancy.',
  },
  {
    id: 'opp-in-006',
    title: 'Frontend Engineer - Telematics Dashboard',
    company: {
      id: 'comp-06',
      name: 'Aura Mobility',
      location: 'Chennai, Tamil Nadu',
      tagline: 'Next-gen electric vehicle telematics and fleet operating system',
      size: '51-200',
      industry: 'Automotive & IoT',
    },
    location: 'Chennai, Tamil Nadu',
    workMode: 'onsite',
    experienceLevel: 'junior',
    category: 'frontend',
    salary: {
      min: 800000,
      max: 1200000,
      currency: 'INR',
      period: 'yearly',
      display: '₹8.0 – 12.0 LPA',
    },
    requiredSkills: ['React', 'TypeScript', 'WebSockets', 'CSS', 'Git'],
    preferredSkills: ['Mapbox GL', 'Deck.gl', 'TanStack Table'],
    description:
      'Aura Mobility powers telemetry for commercial electric two-wheeler fleets across South India. In this role, you will build live battery health monitors, driver performance dashboards, and geofence configuration tools.',
    responsibilities: [
      'Render live fleet location markers and status metrics via WebSocket streams.',
      'Implement data-dense filterable tables with sorting, multi-select, and export.',
      'Collaborate with hardware firmware teams to visualize real-time battery sensor data.',
      'Ensure zero layout shift and smooth 60fps pan/zoom performance on map views.',
    ],
    qualifications: [
      '1+ years of experience with modern frontend development in React.',
      'Experience handling streaming or asynchronous event data.',
      'Understanding of memory management in long-lived browser sessions.',
    ],
    benefits: [
      'Competitive base pay + EV lease subsidy scheme.',
      'Comprehensive medical insurance covering parents.',
      'Flexible annual leave and sponsored technical certifications.',
    ],
    postedAt: daysAgo(3),
    isFresh: false,
    demoNotice:
      'Demonstration listing for portfolio testing — not a genuine external vacancy.',
  },
  {
    id: 'opp-in-007',
    title: 'Graduate Frontend Engineer (New Grad 2026)',
    company: {
      id: 'comp-07',
      name: 'Setu Analytics',
      location: 'Bengaluru, Karnataka',
      tagline: 'Financial account aggregator APIs and consent management',
      size: '51-200',
      industry: 'FinTech',
    },
    location: 'Bengaluru, Karnataka',
    workMode: 'remote',
    experienceLevel: 'entry',
    category: 'frontend',
    salary: {
      min: 1000000,
      max: 1500000,
      currency: 'INR',
      period: 'yearly',
      display: '₹10.0 – 15.0 LPA',
    },
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
    preferredSkills: ['Next.js', 'Security Best Practices', 'IndexedDB'],
    description:
      'Setu Analytics is opening its 2026 graduate engineering cohort. You will receive structured mentorship while contributing to bank-grade financial consent screens, authentication dialogs, and developer documentation hubs.',
    responsibilities: [
      'Develop secure client-side consent collection flows with stringent security standards.',
      'Work with IndexedDB and service workers for resilient offline data collection.',
      'Participate in bi-weekly design sprint reviews and architecture workshops.',
      'Maintain automated test coverage across all supported browser versions.',
    ],
    qualifications: [
      'Graduating in 2025/2026 with a degree in Engineering, Computer Science, or Mathematics.',
      'Proficiency in modern TypeScript, data structures, and web browser runtime APIs.',
      'Active GitHub contributions or standout technical project work.',
    ],
    benefits: [
      '100% remote flexibility across India.',
      'Competitive starting salary with annual revision cycles.',
      '₹75,000 learning budget for conferences, books, and courses.',
      'Company-provided MacBook Pro.',
    ],
    postedAt: daysAgo(4),
    isFresh: false,
    isFeatured: true,
    demoNotice:
      'Demonstration listing for portfolio testing — not a genuine external vacancy.',
  },
  {
    id: 'opp-in-008',
    title: 'Junior Software Engineer - Web Platform',
    company: {
      id: 'comp-08',
      name: 'Samay Payroll',
      location: 'Mumbai, Maharashtra',
      tagline: 'Automated payroll and compliance for Indian enterprises',
      size: '51-200',
      industry: 'HRTech & Payroll',
    },
    location: 'Mumbai, Maharashtra',
    workMode: 'hybrid',
    experienceLevel: 'junior',
    category: 'frontend',
    salary: {
      min: 850000,
      max: 1250000,
      currency: 'INR',
      period: 'yearly',
      display: '₹8.5 – 12.5 LPA',
    },
    requiredSkills: ['React', 'TypeScript', 'HTML', 'CSS', 'REST API'],
    preferredSkills: ['Form Validation (Zod/Formik)', 'i18n', 'Accessibility'],
    description:
      'Samay Payroll calculates salary disbursements and tax deductions for over 250,000 Indian corporate employees. We are seeking a Junior Software Engineer to join our core Web Platform team to build accessible, multilingual employee self-service portals.',
    responsibilities: [
      'Build complex form wizards for tax declarations, reimbursement claims, and leave management.',
      'Implement strict client-side validation using TypeScript and schema libraries.',
      'Support accessibility compliance across vernacular Indian language translations.',
      'Write end-to-end regression tests to verify calculation flows.',
    ],
    qualifications: [
      '1–2 years of frontend engineering experience or demonstrated complex project mastery.',
      'Deep understanding of form state handling and browser keyboard navigation.',
      'Good communication skills and an empathetic mindset for user workflows.',
    ],
    benefits: [
      'Hybrid model with office in Bandra Kurla Complex (BKC), Mumbai.',
      'Medical insurance with ₹5,00,000 sum insured.',
      'Subsidized local commute passes.',
    ],
    postedAt: daysAgo(5),
    isFresh: false,
    demoNotice:
      'Demonstration listing for portfolio testing — not a genuine external vacancy.',
  },
  {
    id: 'opp-in-009',
    title: 'Frontend Developer Intern - Interactive Classroom',
    company: {
      id: 'comp-09',
      name: 'Krupa EdTech',
      location: 'Pune, Maharashtra',
      tagline: 'Interactive STEM simulations and live coding classrooms',
      size: '11-50',
      industry: 'EdTech',
    },
    location: 'Pune, Maharashtra',
    workMode: 'remote',
    experienceLevel: 'internship',
    category: 'frontend',
    salary: {
      min: 25000,
      max: 35000,
      currency: 'INR',
      period: 'monthly',
      display: '₹25,000 – 35,000/mo',
    },
    requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS'],
    preferredSkills: ['Canvas', 'SVG Animation', 'TypeScript'],
    description:
      'We are looking for a creative Frontend Intern to build interactive physics simulations, geometry sketchpads, and real-time quiz widgets for middle-school and high-school students.',
    responsibilities: [
      'Develop responsive interactive canvas widgets and SVG diagrams.',
      'Build mobile-friendly touch interfaces that run reliably on low-bandwidth connections.',
      'Help build reusable UI components for teacher grading portals.',
    ],
    qualifications: [
      'Current student in final or pre-final year of undergraduate degree.',
      'Good grasp of vanilla JavaScript, DOM manipulation, and CSS animations.',
      'Passion for education and clean code.',
    ],
    benefits: [
      'Stipend of ₹25,000 – ₹35,000 per month.',
      'PPO opportunities for top performers.',
      'Mentorship from experienced senior developers.',
    ],
    postedAt: daysAgo(6),
    isFresh: false,
    demoNotice:
      'Demonstration listing for portfolio testing — not a genuine external vacancy.',
  },
  {
    id: 'opp-in-010',
    title: 'Junior Cloud Portal Engineer',
    company: {
      id: 'comp-10',
      name: 'Vyom Cloud',
      location: 'Remote India',
      tagline: 'Sovereign cloud compute and container orchestration',
      size: '51-200',
      industry: 'Cloud Infrastructure',
    },
    location: 'Remote India',
    workMode: 'remote',
    experienceLevel: 'junior',
    category: 'frontend',
    salary: {
      min: 950000,
      max: 1400000,
      currency: 'INR',
      period: 'yearly',
      display: '₹9.5 – 14.0 LPA',
    },
    requiredSkills: ['React', 'TypeScript', 'TanStack Query', 'CSS Modules'],
    preferredSkills: ['Kubernetes APIs', 'Dark Mode UI', 'Micro-frontends'],
    description:
      'Vyom Cloud operates domestic Indian data center compute clusters. We are seeking a Junior Cloud Portal Engineer to expand our customer cloud console, virtual machine provisioning wizards, and storage tier managers.',
    responsibilities: [
      'Develop cloud infrastructure management dashboards with high density and fast load times.',
      'Implement real-time server cluster status monitors and alerting ribbons.',
      'Ensure responsive behavior across laptop screens and tablet terminals.',
    ],
    qualifications: [
      '1–2 years of hands-on experience in React with TypeScript.',
      'Solid understanding of HTTP caching, REST APIs, and client-side error boundaries.',
    ],
    benefits: [
      'Work from anywhere in India.',
      'Internet and co-working space monthly stipend.',
      'Annual team offsite in Goa or Himachal Pradesh.',
    ],
    postedAt: daysAgo(7),
    isFresh: false,
    demoNotice:
      'Demonstration listing for portfolio testing — not a genuine external vacancy.',
  },
];
