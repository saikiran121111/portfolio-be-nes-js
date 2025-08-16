import { 
    IAchievements,
    ICertifications,
    IEducation,
    IExperience,
    ILanguages,
    IProjects,
    ISkill,
    IscanReports } from './user.interface';


export interface IPortfolio {
  name: string;
  email: string;
  headline?: string;
  summary?: string;
  copyrights?: string;
  location?: string;
  phone?: string;
  socials?: ISocials;
  skills: ISkill[];
  experiences: IExperience[];
  projects?: IProjects[];
  education: IEducation[];
  certifications?: ICertifications[];
  achievements?: IAchievements[];
  languages?: ILanguages[];
  scanReports?: IscanReports[];
  bottomHeadline?: string[];
  // Added: tool docs (moved from .txt files)
  toolDocs?: IToolDoc[];
}

export interface ISocials {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

// New interface describing tool/docs items
export interface IToolDoc {
  key: string;
  title: string;
  icon: string;
  summary?: string;
  content: string;
  order?: number;
}


