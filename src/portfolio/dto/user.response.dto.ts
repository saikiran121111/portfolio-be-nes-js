import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SummaryDto {
  @ApiPropertyOptional()
  bugs?: number;
  @ApiPropertyOptional()
  codeSmells?: number;
  @ApiPropertyOptional()
  qualityGate?: string;
  @ApiPropertyOptional()
  vulnerabilities?: number;
  @ApiPropertyOptional()
  coverage?: number;
  @ApiPropertyOptional()
  low?: number;
  @ApiPropertyOptional()
  medium?: number;
  @ApiPropertyOptional()
  high?: number;
}

export class ScanReportDto {
  @ApiProperty()
  type!: string;
  @ApiPropertyOptional()
  commitSha!: string | null;
  @ApiProperty()
  runAt!: Date;
  @ApiPropertyOptional()
  artifactUrl!: string | null;
  @ApiPropertyOptional({ type: () => SummaryDto })
  summary!: SummaryDto | null;
}

export class SkillDto {
  @ApiProperty()
  name!: string;
  @ApiProperty()
  category!: string;
  @ApiProperty()
  level!: string;
}

export class ExperienceDto {
  @ApiProperty()
  title!: string;
  @ApiProperty()
  company!: string;
  @ApiPropertyOptional()
  location!: string | null;
  @ApiProperty()
  startDate!: Date;
  @ApiPropertyOptional()
  endDate?: Date | null;
  @ApiPropertyOptional()
  description!: string | null;
  @ApiProperty({ type: [String] })
  bullets!: string[];
  @ApiProperty({ type: [String] })
  techStack!: string[];
}

export class ProjectDto {
  @ApiProperty()
  title!: string;
  @ApiProperty()
  description!: string;
  @ApiPropertyOptional()
  repoUrl!: string | null;
  @ApiPropertyOptional()
  liveUrl!: string | null;
  @ApiProperty({ type: [String] })
  tech!: string[];
  @ApiProperty({ type: [String] })
  highlights!: string[];
  @ApiPropertyOptional()
  startDate!: Date | null;
  @ApiPropertyOptional()
  endDate!: Date | null;
}

export class EducationDto {
  @ApiProperty()
  institution!: string;
  @ApiProperty()
  degree!: string;
  @ApiPropertyOptional()
  field!: string | null;
  @ApiProperty()
  startDate!: Date;
  @ApiPropertyOptional()
  endDate!: Date | null;
  @ApiPropertyOptional()
  description?: string | null;
}

export class CertificationDto {
  @ApiProperty()
  title!: string;
  @ApiProperty()
  issuer!: string;
  @ApiProperty()
  date!: Date;
  @ApiPropertyOptional()
  link!: string | null;
}

export class AchievementDto {
  @ApiProperty()
  title!: string;
  @ApiPropertyOptional()
  date!: Date | null;
  @ApiPropertyOptional()
  link!: string | null;
}

export class LanguageDto {
  @ApiProperty()
  name!: string;
  @ApiProperty()
  level!: string;
}

export class SocialsDto {
  @ApiPropertyOptional()
  github?: string;
  @ApiPropertyOptional()
  linkedin?: string;
  @ApiPropertyOptional()
  portfolio?: string;
}

export class ToolDocDto {
  @ApiProperty()
  key!: string;
  @ApiProperty()
  title!: string;
  @ApiProperty()
  icon!: string;
  @ApiPropertyOptional()
  summary?: string;
  @ApiProperty()
  content!: string;
  @ApiPropertyOptional()
  order?: number;
}
