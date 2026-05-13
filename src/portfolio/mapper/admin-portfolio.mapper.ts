import {
  Achievement,
  BottomHeadline,
  Certification,
  Education,
  Experience,
  Language,
  Prisma,
  Project,
  RepoData,
  ScanReport,
  Skill,
  User,
  HomepageProject,
} from '@prisma/client';
import {
  IAdminAchievement,
  IAdminCertification,
  IAdminEducation,
  IAdminExperience,
  IAdminLanguage,
  IAdminPortfolio,
  IAdminProject,
  IAdminRepoData,
  IAdminScanReport,
  IAdminSkill,
  IAdminSocials,
  IAdminUserProfile,
  IAdminHomepageProject,
} from '../interface/admin-portfolio.interface';

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;

const parseJsonRecord = (
  value: Prisma.JsonValue | null | undefined,
): Record<string, unknown> | undefined => {
  if (!value) return undefined;
  if (typeof value === 'string') {
    try {
      return asRecord(JSON.parse(value));
    } catch {
      return undefined;
    }
  }
  return asRecord(value);
};

const toIsoString = (value: Date | null | undefined): string | null =>
  value ? value.toISOString() : null;

function mapSocialsFromDb(
  socialsData: Prisma.JsonValue | null | undefined,
): IAdminSocials {
  const socials = parseJsonRecord(socialsData);
  return {
    github: typeof socials?.github === 'string' ? socials.github : null,
    linkedin: typeof socials?.linkedin === 'string' ? socials.linkedin : null,
    portfolio: typeof socials?.portfolio === 'string' ? socials.portfolio : null,
  };
}

function mapSummaryFromDb(
  summary: Prisma.JsonValue | null | undefined,
): Record<string, unknown> | null {
  return parseJsonRecord(summary) ?? null;
}

function mapUserProfileFromDb(user: User): IAdminUserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    headline: user.headline,
    summary: user.summary,
    copyrights: user.copyrights,
    location: user.location,
    phone: user.phone,
    socials: mapSocialsFromDb(
      user.socials as Prisma.JsonValue | null | undefined,
    ),
  };
}

function mapRepoDataFromDb(repoData: RepoData | null | undefined): IAdminRepoData {
  return {
    nestJSGitRepo: repoData?.nestJSGitRepo ?? null,
    nestJSDeployedServer: repoData?.nestJSDeployedServer ?? null,
    nestJSSwaggerUrl: repoData?.nestJSSwaggerUrl ?? null,
    nextJSGitRepo: repoData?.nextJSGitRepo ?? null,
    nextJSDeployedServer: repoData?.nextJSDeployedServer ?? null,
    postgresDeployedServer: repoData?.postgresDeployedServer ?? null,
  };
}

function mapSkillFromDb(skill: Skill): IAdminSkill {
  return {
    id: skill.id,
    name: skill.name,
    category: skill.category,
    level: skill.level,
    order: skill.order,
  };
}

function mapExperienceFromDb(experience: Experience): IAdminExperience {
  return {
    id: experience.id,
    title: experience.title,
    company: experience.company,
    location: experience.location,
    startDate: experience.startDate.toISOString(),
    endDate: toIsoString(experience.endDate),
    description: experience.description,
    bullets: experience.bullets ?? [],
    techStack: experience.techStack ?? [],
    order: experience.order,
  };
}

function mapProjectFromDb(project: Project): IAdminProject {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    projectUrl: project.projectUrl,
    repoUrl: project.repoUrl,
    liveUrl: project.liveUrl,
    type: project.type,
    isVisible: project.isVisible,
    tech: project.tech ?? [],
    highlights: project.highlights ?? [],
    startDate: toIsoString(project.startDate),
    endDate: toIsoString(project.endDate),
    order: project.order,
  };
}

function mapEducationFromDb(education: Education): IAdminEducation {
  return {
    id: education.id,
    institution: education.institution,
    degree: education.degree,
    field: education.field,
    startDate: education.startDate.toISOString(),
    endDate: toIsoString(education.endDate),
    location: education.location,
    description: education.description,
    order: education.order,
  };
}

function mapCertificationFromDb(
  certification: Certification,
): IAdminCertification {
  return {
    id: certification.id,
    title: certification.title,
    issuer: certification.issuer,
    date: certification.date.toISOString(),
    link: certification.link,
    order: certification.order,
  };
}

function mapAchievementFromDb(achievement: Achievement): IAdminAchievement {
  return {
    id: achievement.id,
    title: achievement.title,
    date: toIsoString(achievement.date),
    link: achievement.link,
    order: achievement.order,
  };
}

function mapLanguageFromDb(language: Language): IAdminLanguage {
  return {
    id: language.id,
    name: language.name,
    level: language.level,
  };
}

function mapScanReportFromDb(scanReport: ScanReport): IAdminScanReport {
  return {
    id: scanReport.id,
    type: scanReport.type,
    commitSha: scanReport.commitSha,
    runAt: scanReport.runAt.toISOString(),
    summary: mapSummaryFromDb(scanReport.summary),
    artifactUrl: scanReport.artifactUrl,
  };
}

function mapBottomHeadlineFromDb(bottomHeadline: BottomHeadline) {
  return {
    id: bottomHeadline.id,
    text: bottomHeadline.text,
    order: bottomHeadline.order,
  };
}

function mapHomepageProjectFromDb(homepageProject: HomepageProject): IAdminHomepageProject {
  return {
    id: homepageProject.id,
    title: homepageProject.title,
    url: homepageProject.url,
    order: homepageProject.order,
  };
}

export function mapAdminPortfolioFromDb(
  user: User & {
    skills: Skill[];
    experiences: Experience[];
    projects: Project[];
    education: Education[];
    certifications: Certification[];
    achievements: Achievement[];
    languages: Language[];
    scanReports: ScanReport[];
    bottomHeadlines: BottomHeadline[];
    repoData: RepoData | null;
    homepageProjects: HomepageProject[];
  },
): IAdminPortfolio {
  return {
    user: mapUserProfileFromDb(user),
    repoData: mapRepoDataFromDb(user.repoData),
    bottomHeadlines: user.bottomHeadlines.map(mapBottomHeadlineFromDb),
    skills: user.skills.map(mapSkillFromDb),
    experiences: user.experiences.map(mapExperienceFromDb),
    projects: user.projects.map(mapProjectFromDb),
    education: user.education.map(mapEducationFromDb),
    certifications: user.certifications.map(mapCertificationFromDb),
    achievements: user.achievements.map(mapAchievementFromDb),
    languages: user.languages.map(mapLanguageFromDb),
    scanReports: user.scanReports.map(mapScanReportFromDb),
    homepageProjects: user.homepageProjects.map(mapHomepageProjectFromDb),
  };
}
