
export type UserRole = 'CANDIDATE' | 'COMPANY' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  avatarUrl?: string;
  skills?: string[];
  links?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  resume?: {
    url: string;
    filename: string;
    uploadedAt: string;
    size: number; // in bytes
  };
  verified?: boolean; // For companies
}

export type Currency = 'BRL' | 'USD' | 'EUR' | 'GBP';
export type JobType = 'CLT_BR' | 'CLT_INTL' | 'PJ' | 'FREELANCE';
export type JobLevel = 'INTERN' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'C_LEVEL';
export type RemoteType = 'GLOBAL' | 'LATAM' | 'BRAZIL_ONLY' | 'HYBRID';

export type JobArea = 
  | 'Frontend' | 'Backend' | 'Fullstack' | 'Mobile' | 'Data_AI' 
  | 'DevOps' | 'QA' | 'Security' | 'Design' | 'Product' | 'Blockchain';

export interface LanguageRequirement {
  language: 'Portuguese' | 'English' | 'Spanish' | 'French' | 'German';
  level: 'Basic' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  description: string;
  requirements: string[];
  benefits: string[];
  type: JobType;
  level: JobLevel;
  currency: Currency;
  salaryMin: number;
  salaryMax: number;
  location: string;
  remoteType: RemoteType;
  postedAt: string;
  area: JobArea;
  subArea?: string; // e.g., "React", "Node.js", "UX Design"
  skills: string[]; // General tags
  languages: LanguageRequirement[];
  matchPercentage?: number; 
  sponsored?: boolean; 
  salaryVisible: boolean;
  verifiedCompany: boolean;
  status: 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'UNDER_REVIEW';
}

// --- Candidate Specific ---

export type ApplicationStatus = 'SAVED' | 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED';

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  status: ApplicationStatus;
  appliedAt: string;
  notes?: string;
}

export interface JobAlert {
  id: string;
  name: string;
  filters: {
    area?: string;
    level?: JobLevel;
    currency?: Currency;
  };
  frequency: 'DAILY' | 'WEEKLY';
  active: boolean;
}

export interface CandidateStats {
  totalApplied: number;
  responseRate: number; // percentage
  avgResponseTime: number; // days
  topArea: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  createdAt: string;
  read: boolean;
  link?: string;
}

// --- Company Specific ---

export interface CompanyStats {
  activeJobs: number;
  totalViews: number;
  totalApplications: number;
  conversionRate: number;
}

// --- Admin Specific ---

export interface AdminStats {
  totalUsers: number;
  activeJobs: number;
  monthlyRevenue: number;
  pendingVerifications: number;
}

export interface FreelanceCalculation {
  targetMonthly: number;
  hoursPerDay: number;
  daysPerMonth: number;
  taxRate: number;
  reserveRate: number;
  profitRate: number;
  currency: Currency;
}
