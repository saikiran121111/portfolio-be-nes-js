import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IAdminPortfolio, IAdminRepoData, IAdminSocials } from './interface/admin-portfolio.interface';
import { IPortfolio } from './interface/portfolio.interface';
import { mapAdminPortfolioFromDb } from './mapper/admin-portfolio.mapper';
import { mapPortfolioFromDb } from './mapper/portfolio.mapper';

const adminPortfolioInclude = {
  skills: { orderBy: { order: 'asc' as const } },
  experiences: { orderBy: { order: 'asc' as const } },
  projects: { orderBy: { order: 'asc' as const } },
  education: { orderBy: { order: 'asc' as const } },
  certifications: { orderBy: { order: 'asc' as const } },
  achievements: { orderBy: { order: 'asc' as const } },
  languages: { orderBy: { id: 'asc' as const } },
  scanReports: { orderBy: { runAt: 'desc' as const } },
  bottomHeadlines: { orderBy: { order: 'asc' as const } },
  repoData: true,
  homepageProjects: { orderBy: { order: 'asc' as const } },
} as const;

type NullableString = string | null | undefined;

function toTrimmedRequiredString(value: NullableString, fieldName: string): string {
  const trimmed = (value ?? '').trim();
  if (!trimmed) {
    throw new BadRequestException(`${fieldName} is required`);
  }
  return trimmed;
}

function toNullableString(value: NullableString): string | null {
  const trimmed = (value ?? '').trim();
  return trimmed ? trimmed : null;
}

function toStringArray(values: string[] | null | undefined): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean);
}

function parseRequiredDate(value: NullableString, fieldName: string): Date {
  const trimmed = toNullableString(value);
  if (!trimmed) {
    throw new BadRequestException(`${fieldName} is required`);
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException(`${fieldName} must be a valid date`);
  }

  return date;
}

function parseOptionalDate(value: NullableString, fieldName: string): Date | null {
  const trimmed = toNullableString(value);
  if (!trimmed) {
    return null;
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException(`${fieldName} must be a valid date`);
  }

  return date;
}

function normalizeSocials(
  socials: IAdminSocials | null | undefined,
): Prisma.InputJsonValue | typeof Prisma.DbNull {
  const normalized = {
    github: toNullableString(socials?.github),
    linkedin: toNullableString(socials?.linkedin),
    portfolio: toNullableString(socials?.portfolio),
  };

  return Object.values(normalized).some((value) => value !== null)
    ? normalized
    : Prisma.DbNull;
}

function normalizeRepoData(repoData: IAdminRepoData | null | undefined): IAdminRepoData {
  return {
    nestJSGitRepo: toNullableString(repoData?.nestJSGitRepo),
    nestJSDeployedServer: toNullableString(repoData?.nestJSDeployedServer),
    nestJSSwaggerUrl: toNullableString(repoData?.nestJSSwaggerUrl),
    nextJSGitRepo: toNullableString(repoData?.nextJSGitRepo),
    nextJSDeployedServer: toNullableString(repoData?.nextJSDeployedServer),
    postgresDeployedServer: toNullableString(repoData?.postgresDeployedServer),
  };
}

function hasRepoDataContent(repoData: IAdminRepoData): boolean {
  return Object.values(repoData).some((value) => value !== null);
}

function normalizeSummary(summary: Record<string, unknown> | null | undefined): Prisma.InputJsonValue {
  if (!summary || typeof summary !== 'object' || Array.isArray(summary)) {
    return {};
  }

  return summary as Prisma.InputJsonValue;
}

@Injectable()
export class PortfolioService {
  // This service will handle portfolio-related logic
  constructor(private prisma: PrismaService) {}

  async getPortfolioV2(): Promise<IPortfolio | null> {
    const user = await this.prisma.user.findFirst({
      include: {
        skills: true,
        experiences: true,
        projects: {
          where: { isVisible: true },
          orderBy: { order: 'asc' },
        },
        education: true,
        certifications: true,
        achievements: true,
        languages: true,
        scanReports: true,
        bottomHeadlines: { orderBy: { order: 'asc' } },
        homepageProjects: { orderBy: { order: 'asc' } },
        repoData: {
          select: {
            nestJSGitRepo: true,
            nestJSDeployedServer: true,
            nestJSSwaggerUrl: true,
            nextJSGitRepo: true,
            nextJSDeployedServer: true,
            postgresDeployedServer: true,
          },
        },
      },
    });
    if (!user) {
      return null;
    }

    return mapPortfolioFromDb(user);
  }

  async getPortfolioV1() {
    return await this.prisma.user.findFirst({
      include: {
        skills: true,
        experiences: true,
        projects: true,
        education: true,
        certifications: true,
        achievements: true,
        languages: true,
        scanReports: true,
        bottomHeadlines: { orderBy: { order: 'asc' } },
      },
    });
  }

  async getAdminPortfolio(): Promise<IAdminPortfolio | null> {
    const user = await this.prisma.user.findFirst({
      include: adminPortfolioInclude,
    });

    if (!user) {
      return null;
    }

    return mapAdminPortfolioFromDb(user);
  }

  async saveAdminPortfolio(payload: IAdminPortfolio): Promise<IAdminPortfolio> {
    const existingUser = await this.prisma.user.findFirst({
      select: { id: true },
    });

    if (!existingUser) {
      throw new NotFoundException('Portfolio user not found');
    }

    const userId = existingUser.id;

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          name: toTrimmedRequiredString(payload.user?.name, 'user.name'),
          email: toTrimmedRequiredString(payload.user?.email, 'user.email'),
          avatarUrl: toNullableString(payload.user?.avatarUrl),
          headline: toNullableString(payload.user?.headline),
          summary: toNullableString(payload.user?.summary),
          copyrights: toNullableString(payload.user?.copyrights),
          location: toNullableString(payload.user?.location),
          phone: toNullableString(payload.user?.phone),
          socials: normalizeSocials(payload.user?.socials),
        },
      });

      const repoData = normalizeRepoData(payload.repoData);
      const existingRepoData = await tx.repoData.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (hasRepoDataContent(repoData)) {
        if (existingRepoData) {
          await tx.repoData.update({
            where: { userId },
            data: repoData,
          });
        } else {
          await tx.repoData.create({
            data: {
              userId,
              ...repoData,
            },
          });
        }
      } else if (existingRepoData) {
        await tx.repoData.delete({
          where: { userId },
        });
      }

      await tx.homepageProject.deleteMany({ where: { userId } });
      if (payload.homepageProjects.length) {
        await tx.homepageProject.createMany({
          data: payload.homepageProjects.map((project, index) => ({
            userId,
            title: toTrimmedRequiredString(project.title, "homepageProjects[].title"),
            url: toTrimmedRequiredString(project.url, "homepageProjects[].url"),
            order: index,
          })),
        });
      }

      await tx.bottomHeadline.deleteMany({ where: { userId } });
      if (payload.bottomHeadlines.length) {
        await tx.bottomHeadline.createMany({
          data: payload.bottomHeadlines.map((item, index) => ({
            userId,
            text: toTrimmedRequiredString(item.text, `bottomHeadlines[${index}].text`),
            order: index,
          })),
        });
      }

      await tx.skill.deleteMany({ where: { userId } });
      if (payload.skills.length) {
        await tx.skill.createMany({
          data: payload.skills.map((skill, index) => ({
            userId,
            name: toTrimmedRequiredString(skill.name, `skills[${index}].name`),
            category: toTrimmedRequiredString(
              skill.category,
              `skills[${index}].category`,
            ),
            level: toTrimmedRequiredString(skill.level, `skills[${index}].level`),
            order: index,
          })),
        });
      }

      await tx.experience.deleteMany({ where: { userId } });
      if (payload.experiences.length) {
        await tx.experience.createMany({
          data: payload.experiences.map((experience, index) => ({
            userId,
            title: toTrimmedRequiredString(
              experience.title,
              `experiences[${index}].title`,
            ),
            company: toTrimmedRequiredString(
              experience.company,
              `experiences[${index}].company`,
            ),
            location: toNullableString(experience.location),
            startDate: parseRequiredDate(
              experience.startDate,
              `experiences[${index}].startDate`,
            ),
            endDate: parseOptionalDate(
              experience.endDate,
              `experiences[${index}].endDate`,
            ),
            description: toNullableString(experience.description),
            bullets: toStringArray(experience.bullets),
            techStack: toStringArray(experience.techStack),
            order: index,
          })),
        });
      }

      await tx.project.deleteMany({ where: { userId } });
      if (payload.projects.length) {
        await tx.project.createMany({
          data: payload.projects.map((project, index) => ({
            userId,
            title: toTrimmedRequiredString(project.title, `projects[${index}].title`),
            description: toTrimmedRequiredString(
              project.description,
              `projects[${index}].description`,
            ),
            projectUrl: toNullableString(project.projectUrl),
            repoUrl: toNullableString(project.repoUrl),
            liveUrl: toNullableString(project.liveUrl),
            type: toNullableString(project.type),
            isVisible:
              typeof project.isVisible === 'boolean' ? project.isVisible : true,
            tech: toStringArray(project.tech),
            highlights: toStringArray(project.highlights),
            startDate: parseOptionalDate(
              project.startDate,
              `projects[${index}].startDate`,
            ),
            endDate: parseOptionalDate(project.endDate, `projects[${index}].endDate`),
            order: index,
          })),
        });
      }

      await tx.education.deleteMany({ where: { userId } });
      if (payload.education.length) {
        await tx.education.createMany({
          data: payload.education.map((education, index) => ({
            userId,
            institution: toTrimmedRequiredString(
              education.institution,
              `education[${index}].institution`,
            ),
            degree: toTrimmedRequiredString(
              education.degree,
              `education[${index}].degree`,
            ),
            field: toNullableString(education.field),
            startDate: parseRequiredDate(
              education.startDate,
              `education[${index}].startDate`,
            ),
            endDate: parseOptionalDate(
              education.endDate,
              `education[${index}].endDate`,
            ),
            location: toNullableString(education.location),
            description: toNullableString(education.description),
            order: index,
          })),
        });
      }

      await tx.certification.deleteMany({ where: { userId } });
      if (payload.certifications.length) {
        await tx.certification.createMany({
          data: payload.certifications.map((certification, index) => ({
            userId,
            title: toTrimmedRequiredString(
              certification.title,
              `certifications[${index}].title`,
            ),
            issuer: toTrimmedRequiredString(
              certification.issuer,
              `certifications[${index}].issuer`,
            ),
            date: parseRequiredDate(
              certification.date,
              `certifications[${index}].date`,
            ),
            link: toNullableString(certification.link),
            order: index,
          })),
        });
      }

      await tx.achievement.deleteMany({ where: { userId } });
      if (payload.achievements.length) {
        await tx.achievement.createMany({
          data: payload.achievements.map((achievement, index) => ({
            userId,
            title: toTrimmedRequiredString(
              achievement.title,
              `achievements[${index}].title`,
            ),
            date: parseOptionalDate(achievement.date, `achievements[${index}].date`),
            link: toNullableString(achievement.link),
            order: index,
          })),
        });
      }

      await tx.language.deleteMany({ where: { userId } });
      if (payload.languages.length) {
        await tx.language.createMany({
          data: payload.languages.map((language, index) => ({
            userId,
            name: toTrimmedRequiredString(language.name, `languages[${index}].name`),
            level: toTrimmedRequiredString(
              language.level,
              `languages[${index}].level`,
            ),
          })),
        });
      }

      await tx.scanReport.deleteMany({ where: { userId } });
      if (payload.scanReports.length) {
        await tx.scanReport.createMany({
          data: payload.scanReports.map((scanReport, index) => ({
            userId,
            type: toTrimmedRequiredString(scanReport.type, `scanReports[${index}].type`),
            commitSha: toNullableString(scanReport.commitSha),
            runAt: parseRequiredDate(scanReport.runAt, `scanReports[${index}].runAt`),
            summary: normalizeSummary(scanReport.summary),
            artifactUrl: toNullableString(scanReport.artifactUrl),
          })),
        });
      }
    });

    const updatedUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: adminPortfolioInclude,
    });

    if (!updatedUser) {
      throw new NotFoundException('Updated portfolio user not found');
    }

    return mapAdminPortfolioFromDb(updatedUser);
  }
}
