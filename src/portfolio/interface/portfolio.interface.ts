import { ICertifications, IEducation, IExperience, IProjects, ISkill } from './user.interface';


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
}

export interface ISocials {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}


