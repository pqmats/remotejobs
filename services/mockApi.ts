
import { Job, User, Application, JobAlert, CandidateStats, CompanyStats, AdminStats, ApplicationStatus, UserRole, JobArea, JobLevel, JobType, Currency, RemoteType, Notification } from '../types';

// Helper to generate dates
const daysAgo = (days: number) => new Date(Date.now() - 1000 * 60 * 60 * 24 * days).toISOString();

// Expanded Mock Data
let MOCK_JOBS: Job[] = [
  {
    id: '1',
    companyId: 'c1',
    companyName: 'TechFlow',
    companyLogo: 'https://ui-avatars.com/api/?name=TechFlow&background=5865F2&color=fff',
    title: 'Senior Frontend Engineer (React)',
    description: 'Lead our migration to Next.js App Router.',
    requirements: ['5+ years XP', 'React', 'TypeScript'],
    benefits: ['Stock Options', 'Health'],
    type: 'PJ',
    level: 'SENIOR',
    currency: 'USD',
    salaryMin: 5000,
    salaryMax: 7000,
    salaryVisible: true,
    location: 'Remote',
    remoteType: 'GLOBAL',
    postedAt: daysAgo(0),
    area: 'Frontend',
    subArea: 'React',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
    languages: [{ language: 'English', level: 'Fluent' }],
    verifiedCompany: true,
    status: 'ACTIVE',
    sponsored: true
  },
  {
    id: '2',
    companyId: 'c2',
    companyName: 'DataCorp',
    companyLogo: 'https://ui-avatars.com/api/?name=DataCorp&background=random',
    title: 'Data Engineer (Python/Spark)',
    description: 'Build scalable data pipelines.',
    requirements: ['Python', 'Spark', 'AWS'],
    benefits: ['Bonus'],
    type: 'CLT_BR',
    level: 'MID',
    currency: 'BRL',
    salaryMin: 12000,
    salaryMax: 16000,
    salaryVisible: true,
    location: 'São Paulo (Remote)',
    remoteType: 'BRAZIL_ONLY',
    postedAt: daysAgo(1),
    area: 'Data_AI',
    subArea: 'Data Engineering',
    skills: ['Python', 'SQL', 'Spark', 'AWS'],
    languages: [{ language: 'Portuguese', level: 'Native' }],
    verifiedCompany: false,
    status: 'ACTIVE'
  },
  {
    id: '3',
    companyId: 'c3',
    companyName: 'GlobalPay',
    companyLogo: 'https://ui-avatars.com/api/?name=GlobalPay&background=random',
    title: 'Product Designer',
    description: 'Design complex fintech interfaces.',
    requirements: ['Figma', 'Design Systems'],
    benefits: ['PTO', 'Equipment'],
    type: 'CLT_INTL',
    level: 'SENIOR',
    currency: 'EUR',
    salaryMin: 4000,
    salaryMax: 5500,
    salaryVisible: true,
    location: 'Remote',
    remoteType: 'GLOBAL',
    postedAt: daysAgo(2),
    area: 'Design',
    subArea: 'Product Design',
    skills: ['Figma', 'UI/UX', 'Prototyping'],
    languages: [{ language: 'English', level: 'Advanced' }],
    verifiedCompany: true,
    status: 'ACTIVE'
  },
  {
    id: '4',
    companyId: 'c4',
    companyName: 'StartUp Z',
    companyLogo: 'https://ui-avatars.com/api/?name=StartUpZ&background=random',
    title: 'Backend Developer (Node.js)',
    description: 'Microservices architecture.',
    requirements: ['Node.js', 'PostgreSQL'],
    benefits: ['Equity'],
    type: 'PJ',
    level: 'MID',
    currency: 'BRL',
    salaryMin: 8000,
    salaryMax: 12000,
    salaryVisible: false, // Salary hidden
    location: 'Remote',
    remoteType: 'LATAM',
    postedAt: daysAgo(5),
    area: 'Backend',
    subArea: 'Node.js',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
    languages: [{ language: 'English', level: 'Intermediate' }],
    verifiedCompany: false,
    status: 'ACTIVE'
  },
  {
    id: '5',
    companyId: 'c5',
    companyName: 'SecurIT',
    companyLogo: 'https://ui-avatars.com/api/?name=SecurIT&background=random',
    title: 'Security Analyst',
    description: 'Blue team operations.',
    requirements: ['SIEM', 'Incident Response'],
    benefits: ['Health'],
    type: 'CLT_BR',
    level: 'JUNIOR',
    currency: 'BRL',
    salaryMin: 5000,
    salaryMax: 7000,
    salaryVisible: true,
    location: 'Remote',
    remoteType: 'BRAZIL_ONLY',
    postedAt: daysAgo(0),
    area: 'Security',
    subArea: 'Blue Team',
    skills: ['SIEM', 'Splunk', 'Linux'],
    languages: [{ language: 'Portuguese', level: 'Native' }],
    verifiedCompany: true,
    status: 'ACTIVE'
  },
  {
    id: '6',
    companyId: 'c1',
    companyName: 'TechFlow',
    companyLogo: 'https://ui-avatars.com/api/?name=TechFlow&background=5865F2&color=fff',
    title: 'Mobile Engineer (Flutter)',
    description: 'Cross-platform app development.',
    requirements: ['Flutter', 'Dart'],
    benefits: [],
    type: 'FREELANCE',
    level: 'SENIOR',
    currency: 'USD',
    salaryMin: 40,
    salaryMax: 60,
    salaryVisible: true, // hourly
    location: 'Remote',
    remoteType: 'GLOBAL',
    postedAt: daysAgo(3),
    area: 'Mobile',
    subArea: 'Flutter',
    skills: ['Flutter', 'Dart', 'Firebase'],
    languages: [{ language: 'English', level: 'Advanced' }],
    verifiedCompany: true,
    status: 'ACTIVE'
  }
];

// Mock Candidates for Talent Bank
const MOCK_CANDIDATES: User[] = [
    {
        id: 'u2',
        name: 'Ana Souza',
        email: 'ana@example.com',
        role: 'CANDIDATE',
        avatarUrl: 'https://ui-avatars.com/api/?name=Ana+Souza&background=random',
        bio: 'Senior UX Designer with 6 years of experience in FinTech.',
        skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research'],
        links: { linkedin: '#', portfolio: '#' },
        resume: { url: '#', filename: 'Ana_CV.pdf', uploadedAt: daysAgo(5), size: 1024000 }
    },
    {
        id: 'u3',
        name: 'Carlos Oliveira',
        email: 'carlos@example.com',
        role: 'CANDIDATE',
        avatarUrl: 'https://ui-avatars.com/api/?name=Carlos+O&background=random',
        bio: 'Fullstack Dev | Node.js & React | Open Source Contributor',
        skills: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
        links: { github: '#' },
        resume: { url: '#', filename: 'Carlos_Dev_Resume.pdf', uploadedAt: daysAgo(10), size: 2048000 }
    },
    {
        id: 'u4',
        name: 'Marina Costa',
        email: 'marina@example.com',
        role: 'CANDIDATE',
        avatarUrl: 'https://ui-avatars.com/api/?name=Marina+C&background=random',
        bio: 'Data Scientist focused on ML and NLP models.',
        skills: ['Python', 'PyTorch', 'TensorFlow', 'NLP'],
        links: { linkedin: '#' },
        resume: { url: '#', filename: 'Marina_Data.pdf', uploadedAt: daysAgo(1), size: 1500000 }
    }
];

// Mock Notifications
let MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', title: 'Bem-vindo à Remota!', message: 'Complete seu perfil para aumentar suas chances.', type: 'INFO', createdAt: daysAgo(0), read: false, link: '/profile' },
    { id: 'n2', title: 'Nova Vaga Compatível', message: 'Uma nova vaga de React Senior foi postada.', type: 'SUCCESS', createdAt: daysAgo(1), read: false, link: '/jobs/1' },
    { id: 'n3', title: 'Alerta de Segurança', message: 'Detectamos um novo login em sua conta.', type: 'WARNING', createdAt: daysAgo(5), read: true }
];

// --- Mock Filtering Logic ---
export interface JobFilters {
  query?: string;
  areas?: JobArea[];
  levels?: JobLevel[];
  types?: JobType[];
  remoteTypes?: RemoteType[];
  currencies?: Currency[];
  minSalary?: number;
  languages?: string[]; // e.g., "English"
  techStack?: string[]; // e.g., "React"
  verifiedOnly?: boolean;
  salaryVisibleOnly?: boolean;
}

export const MockApi = {
  getJobs: async (filters?: JobFilters): Promise<Job[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...MOCK_JOBS].filter(j => j.status === 'ACTIVE');

        if (filters) {
          // Text Search
          if (filters.query) {
            const q = filters.query.toLowerCase();
            filtered = filtered.filter(j => 
              j.title.toLowerCase().includes(q) || 
              j.companyName.toLowerCase().includes(q) ||
              j.skills.some(s => s.toLowerCase().includes(q))
            );
          }

          // Multi-select Filters (OR logic within category)
          if (filters.areas && filters.areas.length > 0) {
            filtered = filtered.filter(j => filters.areas!.includes(j.area));
          }
          if (filters.levels && filters.levels.length > 0) {
            filtered = filtered.filter(j => filters.levels!.includes(j.level));
          }
          if (filters.types && filters.types.length > 0) {
            filtered = filtered.filter(j => filters.types!.includes(j.type));
          }
          if (filters.remoteTypes && filters.remoteTypes.length > 0) {
            filtered = filtered.filter(j => filters.remoteTypes!.includes(j.remoteType));
          }
          if (filters.currencies && filters.currencies.length > 0) {
            filtered = filtered.filter(j => filters.currencies!.includes(j.currency));
          }

          // Range Filters
          if (filters.minSalary) {
            filtered = filtered.filter(j => j.salaryMax >= (filters.minSalary || 0));
          }

          // Tech Stack (AND logic - must have at least one of selected, can be stricter)
          if (filters.techStack && filters.techStack.length > 0) {
             filtered = filtered.filter(j => 
                filters.techStack!.some(tech => j.skills.some(s => s.toLowerCase() === tech.toLowerCase()))
             );
          }

          // Languages
          if (filters.languages && filters.languages.length > 0) {
             filtered = filtered.filter(j => 
                filters.languages!.some(lang => j.languages.some(l => l.language === lang))
             );
          }

          // Booleans
          if (filters.verifiedOnly) {
            filtered = filtered.filter(j => j.verifiedCompany);
          }
          if (filters.salaryVisibleOnly) {
            filtered = filtered.filter(j => j.salaryVisible);
          }
        }

        // Sort: Sponsored first, then date
        filtered.sort((a, b) => {
            if (a.sponsored && !b.sponsored) return -1;
            if (!a.sponsored && b.sponsored) return 1;
            return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
        });

        resolve(filtered);
      }, 600);
    });
  },

  getJobById: async (id: string): Promise<Job | undefined> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_JOBS.find(j => j.id === id)), 300));
  },
  
  getSavedJobs: async (): Promise<Job[]> => {
      // Simulate getting saved jobs (random selection for demo)
      return new Promise((resolve) => setTimeout(() => resolve(MOCK_JOBS.slice(0, 3)), 400));
  },
  
  toggleSavedJob: async (jobId: string): Promise<boolean> => {
      // Simulate toggle. Returns true if saved, false if removed
      return new Promise((resolve) => setTimeout(() => resolve(Math.random() > 0.5), 300));
  },

  getNotifications: async (): Promise<Notification[]> => {
      return new Promise((resolve) => setTimeout(() => resolve([...MOCK_NOTIFICATIONS]), 400));
  },

  markNotificationRead: async (id: string): Promise<void> => {
      MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS.map(n => n.id === id ? { ...n, read: true } : n);
  },

  getCandidates: async (): Promise<User[]> => {
      return new Promise((resolve) => setTimeout(() => resolve(MOCK_CANDIDATES), 500));
  },

  createJob: async (jobData: Omit<Job, 'id' | 'postedAt' | 'status' | 'companyLogo' | 'verifiedCompany'>): Promise<Job> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              const newJob: Job = {
                  ...jobData,
                  id: Date.now().toString(),
                  postedAt: new Date().toISOString(),
                  status: 'ACTIVE',
                  companyLogo: `https://ui-avatars.com/api/?name=${jobData.companyName}&background=random`,
                  verifiedCompany: true,
                  sponsored: false,
                  salaryVisible: true
              };
              MOCK_JOBS.unshift(newJob);
              resolve(newJob);
          }, 1000);
      });
  },

  // ... (Keep existing Auth/User methods as is)
  login: async (email: string, role: UserRole): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const finalRole = email.includes('admin') ? 'ADMIN' : role;
        resolve({
          id: 'u1',
          name: email.split('@')[0],
          email,
          role: finalRole,
          avatarUrl: `https://ui-avatars.com/api/?name=${email}&background=random`,
          bio: 'Apaixonado por tecnologia e trabalho remoto.',
          skills: ['React', 'Node.js', 'TypeScript'],
          verified: finalRole === 'COMPANY',
          resume: finalRole === 'CANDIDATE' ? {
             url: 'https://example.com/resume.pdf',
             filename: 'CV_Fullstack_2024.pdf',
             uploadedAt: daysAgo(2),
             size: 1024 * 1024 * 2.5 // 2.5MB
          } : undefined
        });
      }, 800);
    });
  },

  socialLogin: async (provider: 'google' | 'apple'): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `u-${provider}-${Date.now()}`,
          name: provider === 'google' ? 'Google User' : 'Apple User',
          email: provider === 'google' ? 'user@gmail.com' : 'user@icloud.com',
          role: 'CANDIDATE',
          avatarUrl: provider === 'google' ? 'https://picsum.photos/100/100?random=100' : 'https://picsum.photos/100/100?random=101',
          bio: `Conta criada via ${provider}.`,
          skills: ['Social Login']
        });
      }, 800);
    });
  },

  // --- Upload Mock ---
  uploadFile: async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Validation Logic (Server-side simulation)
            const MAX_SIZE_MB = 10;
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                reject(new Error(`Arquivo muito grande. Máximo de ${MAX_SIZE_MB}MB.`));
                return;
            }

            // Create a fake URL
            // In a real app, this would be an S3/Cloudinary URL
            // We use URL.createObjectURL for preview purposes in mock
            const url = URL.createObjectURL(file);
            resolve(url);
        }, 1500); // 1.5s network delay
    });
  },

  // ... (Keep existing candidate/company stats methods)
  getCandidateStats: async (): Promise<CandidateStats> => {
    return new Promise(resolve => setTimeout(() => resolve({
      totalApplied: 12,
      responseRate: 25,
      avgResponseTime: 4,
      topArea: 'Frontend'
    }), 400));
  },

  getApplications: async (): Promise<Application[]> => {
    return new Promise(resolve => setTimeout(() => resolve([]), 400));
  },

  updateApplicationStatus: async (id: string, status: ApplicationStatus): Promise<void> => {},

  getAlerts: async (): Promise<JobAlert[]> => {
    return new Promise(resolve => setTimeout(() => resolve([]), 300));
  },

  toggleAlert: async (id: string): Promise<void> => {},

  getCompanyStats: async (): Promise<CompanyStats> => {
    return new Promise(resolve => setTimeout(() => resolve({
      activeJobs: 3,
      totalViews: 1250,
      totalApplications: 48,
      conversionRate: 3.8
    }), 400));
  },

  getCompanyJobs: async (companyId: string): Promise<Job[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_JOBS.filter(j => j.companyId === 'c1')), 400));
  },

  getAdminStats: async (): Promise<AdminStats> => {
    return new Promise(resolve => setTimeout(() => resolve({
      totalUsers: 15420,
      activeJobs: 842,
      monthlyRevenue: 45000,
      pendingVerifications: 12
    }), 400));
  }
};
