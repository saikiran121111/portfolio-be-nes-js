import { 
    IAchievements,
    ICertifications,
    IEducation,
    IExperience,
    ILanguages,
    IProjects,
    ISkill } from './user.interface';


export interface IPortfolio {
  name: string;
  email: string;
  headline?: string;
  summary?: string;
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
}

export interface ISocials {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}


