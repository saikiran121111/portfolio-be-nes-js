import { IExperience, ISkill } from './user.interface';


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
}

export interface ISocials {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}


