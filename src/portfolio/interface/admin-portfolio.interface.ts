export interface IAdminSocials {
  github: string | null;
  linkedin: string | null;
  portfolio: string | null;
}

export interface IAdminUserProfile {
  id?: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  headline: string | null;
  summary: string | null;
  copyrights: string | null;
  location: string | null;
  phone: string | null;
  socials: IAdminSocials;
}

export interface IAdminRepoData {
  nestJSGitRepo: string | null;
  nestJSDeployedServer: string | null;
  nestJSSwaggerUrl: string | null;
  nextJSGitRepo: string | null;
  nextJSDeployedServer: string | null;
  postgresDeployedServer: string | null;
}

export interface IAdminBottomHeadline {
  id?: number;
  text: string;
  order: number;
}

export interface IAdminSkill {
  id?: number;
  name: string;
  category: string;
  level: string;
  order: number;
}

export interface IAdminExperience {
  id?: number;
  title: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  bullets: string[];
  techStack: string[];
  order: number;
}

export interface IAdminProject {
  id?: number;
  title: string;
  description: string;
  projectUrl: string | null;
  repoUrl: string | null;
  liveUrl: string | null;
  type: string | null;
  isVisible: boolean;
  tech: string[];
  highlights: string[];
  startDate: string | null;
  endDate: string | null;
  order: number;
}

export interface IAdminEducation {
  id?: number;
  institution: string;
  degree: string;
  field: string | null;
  startDate: string;
  endDate: string | null;
  location: string | null;
  description: string | null;
  order: number;
}

export interface IAdminCertification {
  id?: number;
  title: string;
  issuer: string;
  date: string;
  link: string | null;
  order: number;
}

export interface IAdminAchievement {
  id?: number;
  title: string;
  date: string | null;
  link: string | null;
  order: number;
}

export interface IAdminLanguage {
  id?: number;
  name: string;
  level: string;
}

export interface IAdminScanReport {
  id?: number;
  type: string;
  commitSha: string | null;
  runAt: string;
  summary: Record<string, unknown> | null;
  artifactUrl: string | null;
}

export interface IAdminPortfolio {
  user: IAdminUserProfile;
  repoData: IAdminRepoData;
  bottomHeadlines: IAdminBottomHeadline[];
  skills: IAdminSkill[];
  experiences: IAdminExperience[];
  projects: IAdminProject[];
  education: IAdminEducation[];
  certifications: IAdminCertification[];
  achievements: IAdminAchievement[];
  languages: IAdminLanguage[];
  scanReports: IAdminScanReport[];
}
