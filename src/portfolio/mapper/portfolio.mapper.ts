import { User, Skill, Experience, Project, Education, Certification, Achievement, Language, ScanReport } from '@prisma/client';
import { IAchievements, ICertifications, IEducation, IExperience, ILanguages, IProjects, IscanReports, ISkill, ISummary } from '../interface/user.interface';
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

function mapprojectsFromDb(projects: Project): IProjects {
  return {
    title: projects.title,
    description: projects.description,
    repoUrl: projects.repoUrl,
    liveUrl: projects.liveUrl,
    tech: projects.tech || [],
    highlights: projects.highlights || [],
    startDate: projects.startDate,
    endDate: projects.endDate,
  };
}

function mapeducationFromDb(education: Education): IEducation {
  return {
    institution: education.institution,
    degree: education.degree,
    field: education.field,
    startDate: education.startDate,
    endDate: education.endDate,
    description: education.description || null,
  };
}

function mapCertificationsFromDb(certification: Certification): ICertifications {
  return {
    title: certification.title,
    issuer: certification.issuer,
    date: certification.date,
    link: certification.link || null,
  };
}

function mapAchievementsFromDb(achievement: Achievement): IAchievements {
  return {
    title: achievement.title,
    date: achievement.date,
    link: achievement.link || null,
  };
}

function mapLanguagesFromDb(language: Language): ILanguages {
  return {
    name: language.name,
    level: language.level,
  };
}

function mapScanReportsFromDb(scanReport: ScanReport): IscanReports {
  const summary = typeof scanReport.summary === 'string' ? JSON.parse(scanReport.summary) as ISummary : null;
  return {
    type: scanReport.type,
    commitSha: scanReport.commitSha,
    runAt: scanReport.runAt,
    artifactUrl: scanReport.artifactUrl,
    summary: summary,
  }
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

export function mapPortfolioFromDb(user: User & 
  { 
  skills: Skill[], 
  experiences: Experience[], 
  projects: Project[], 
  education: Education[], 
  certifications: Certification[],
  achievements: Achievement[],
  languages: Language[],
  scanReports: ScanReport[],
  }): IPortfolio {
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
    projects: user.projects.map(mapprojectsFromDb),
    education: user.education.map(mapeducationFromDb),
    certifications: user.certifications.map(mapCertificationsFromDb),
    achievements: user.achievements.map(mapAchievementsFromDb),
    languages: user.languages.map(mapLanguagesFromDb),
    scanReports: user.scanReports.map(mapScanReportsFromDb),
  };
}