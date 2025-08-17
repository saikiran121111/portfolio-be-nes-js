import { Prisma, User, Skill, Experience, Project, Education, Certification, Achievement, Language, ScanReport } from '@prisma/client';
import { IAchievements, ICertifications, IEducation, IExperience, ILanguages, IProjects, IscanReports, ISkill, ISummary } from '../interface/user.interface';
import { IPortfolio } from '../interface/portfolio.interface';
import { getOrderedToolDocs } from '../toolsConstants/constants';

// Lightweight helpers
const asRecord = (v: unknown): Record<string, unknown> | undefined =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : undefined;

const parseJsonRecord = (v: Prisma.JsonValue | null | undefined): Record<string, unknown> | undefined => {
  if (!v) return undefined;
  if (typeof v === 'string') {
    try { return asRecord(JSON.parse(v)); } catch { return undefined; }
  }
  return asRecord(v);
};

function mapSkillFromDb(skill: Skill): ISkill {
  return { name: skill.name, category: skill.category, level: skill.level || 'beginner' };
}

function mapExperienceFromDb(experience: Experience): IExperience {
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

function mapProjectFromDb(project: Project): IProjects {
  return {
    title: project.title,
    description: project.description,
    repoUrl: project.repoUrl,
    liveUrl: project.liveUrl,
    tech: project.tech || [],
    highlights: project.highlights || [],
    startDate: project.startDate,
    endDate: project.endDate,
  };
}

function mapEducationFromDb(education: Education): IEducation {
  return {
    institution: education.institution,
    degree: education.degree,
    field: education.field,
    startDate: education.startDate,
    endDate: education.endDate,
    description: education.description || null,
  };
}

function mapCertificationFromDb(certification: Certification): ICertifications {
  return { title: certification.title, issuer: certification.issuer, date: certification.date, link: certification.link || null };
}

function mapAchievementFromDb(achievement: Achievement): IAchievements {
  return { title: achievement.title, date: achievement.date, link: achievement.link || null };
}

function mapLanguageFromDb(language: Language): ILanguages {
  return { name: language.name, level: language.level };
}

// Compact helper to normalize summary
const toSummary = (v: Prisma.JsonValue | null | undefined): ISummary | null => {
  const rec = parseJsonRecord(v);
  if (!rec) return null;
  const out: ISummary = {};
  const n = (k: keyof ISummary) => {
    const val = rec[k as string];
    if (typeof val === 'number') (out as any)[k] = val;
  };
  n('bugs'); n('codeSmells'); n('coverage'); n('low'); n('medium'); n('high'); n('vulnerabilities');
  const qg = rec['qualityGate'];
  if (typeof qg === 'string') out.qualityGate = qg;
  return out;
};

function mapScanReportsFromDb(scanReport: ScanReport): IscanReports {
  return {
    type: scanReport.type,
    commitSha: scanReport.commitSha,
    runAt: scanReport.runAt,
    artifactUrl: scanReport.artifactUrl,
    summary: toSummary(scanReport.summary as Prisma.JsonValue | null),
  };
}

function mapSocialsFromDb(socialsData: Prisma.JsonValue | null | undefined) {
  const s = parseJsonRecord(socialsData);
  if (!s) return undefined;
  return {
    github: typeof s.github === 'string' ? s.github : undefined,
    linkedin: typeof s.linkedin === 'string' ? s.linkedin : undefined,
    portfolio: typeof s.portfolio === 'string' ? s.portfolio : undefined,
  };
}

export function mapPortfolioFromDb(user: User & {
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
  languages: Language[];
  scanReports: ScanReport[];
  bottomHeadlines?: Array<{ text: string; order: number }>;
  repoData?: {
    nestJSGitRepo: string | null;
    nestJSDeployedServer: string | null;
    nestJSSwaggerUrl: string | null;
    nextJSGitRepo: string | null;
    nextJSDeployedServer: string | null;
    postgresDeployedServer: string | null;
  } | null;
}): IPortfolio {
  const r = user.repoData ?? null;
  const bottomHeadline = user.bottomHeadlines && user.bottomHeadlines.length
    ? user.bottomHeadlines.map(b => b.text)
    : undefined;

  const result = {
    name: user.name,
    email: user.email,
    headline: user.headline ?? undefined,
    summary: user.summary ?? undefined,
    copyrights: user.copyrights ?? undefined,
    location: user.location ?? undefined,
    phone: user.phone ?? undefined,
    socials: mapSocialsFromDb(user.socials as Prisma.JsonValue | null | undefined),

    // repo data merged into root
    nestJSGitRepo: r?.nestJSGitRepo ?? undefined,
    nestJSDeployedServer: r?.nestJSDeployedServer ?? undefined,
    nestJSSwaggerUrl: r?.nestJSSwaggerUrl ?? undefined,
    nextJSGitRepo: r?.nextJSGitRepo ?? undefined,
    nextJSDeployedServer: r?.nextJSDeployedServer ?? undefined,
    postgresDeployedServer: r?.postgresDeployedServer ?? undefined,

    skills: user.skills.map(mapSkillFromDb),
    experiences: user.experiences.map(mapExperienceFromDb),
    projects: user.projects.map(mapProjectFromDb),
    education: user.education.map(mapEducationFromDb),
    certifications: user.certifications.map(mapCertificationFromDb),
    achievements: user.achievements.map(mapAchievementFromDb),
    languages: user.languages.map(mapLanguageFromDb),
    scanReports: user.scanReports.map(mapScanReportsFromDb),
    bottomHeadline,
    toolDocs: getOrderedToolDocs(),
  } satisfies IPortfolio;

  return result;
}