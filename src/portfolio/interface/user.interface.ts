export interface ISkill {
  name: string;
  category: string;
  level: string;
}

export interface IExperience {
  title: string;
  company: string;
  location: string | null;
  startDate: Date;
  endDate?: Date | null;
  description: string | null;
  bullets: string[];
  techStack: string[];
}