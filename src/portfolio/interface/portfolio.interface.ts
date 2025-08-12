import { IExperience, ISkill } from './user.interface';

/**
 * The IUser interface represents a subset of the User model,
 * containing only the fields required for the portfolio.
 */

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


