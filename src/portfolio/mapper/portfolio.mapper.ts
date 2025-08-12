import { User, Skill, Experience } from '@prisma/client';
import { IExperience, ISkill } from '../interface/user.interface';
import { IPortfolio } from '../interface/portfolio.interface';

function mapSkillFromDb(skill: Skill): ISkill {
  return {
    name: skill.name,
    category: skill.category,
    level: skill.level || 'beginner',
  };
}

function mapexperienceFromDb(experience: Experience): IExperience {
  return {
    title: experience.title,
    company: experience.company,
    location: experience.location,
    startDate: experience.startDate,
    endDate: experience.endDate,
    description: experience.description,
    bullets: experience.bullets || [],
    techStack: experience.techStack || [],
  };
}

function mapSocialsFromDb(socialsData: any) {
  if (!socialsData) return undefined;
  try {
    const s = typeof socialsData === 'string' ? JSON.parse(socialsData) : socialsData;
    if (typeof s === 'object' && !Array.isArray(s)) {
      return {
        github: s.github,
        linkedin: s.linkedin,
        portfolio: s.portfolio,
      };
    }
  } catch {}
  return undefined;
}

export function mapPortfolioFromDb(user: User & { skills: Skill[], experiences: Experience[] }): IPortfolio {
  return {
    name: user.name,
    email: user.email,
    headline: user.headline ?? undefined,
    summary: user.summary ?? undefined,
    location: user.location ?? undefined,
    phone: user.phone ?? undefined,
    socials: mapSocialsFromDb(user.socials),
    skills: user.skills.map(mapSkillFromDb),
    experiences: user.experiences.map(mapexperienceFromDb),
  };
}