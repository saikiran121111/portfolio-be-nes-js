import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SkillDto, ExperienceDto, ProjectDto, EducationDto, CertificationDto, AchievementDto, LanguageDto, ScanReportDto, SocialsDto, ToolDocDto } from './user.response.dto';

export class PortfolioResponseDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiPropertyOptional()
  headline?: string;

  @ApiPropertyOptional()
  summary?: string;

  @ApiPropertyOptional()
  copyrights?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional({ type: () => SocialsDto })
  socials?: SocialsDto;

  @ApiProperty({ type: () => [SkillDto] })
  skills!: SkillDto[];

  @ApiProperty({ type: () => [ExperienceDto] })
  experiences!: ExperienceDto[];

  @ApiPropertyOptional({ type: () => [ProjectDto] })
  projects?: ProjectDto[];

  @ApiProperty({ type: () => [EducationDto] })
  education!: EducationDto[];

  @ApiPropertyOptional({ type: () => [CertificationDto] })
  certifications?: CertificationDto[];

  @ApiPropertyOptional({ type: () => [AchievementDto] })
  achievements?: AchievementDto[];

  @ApiPropertyOptional({ type: () => [LanguageDto] })
  languages?: LanguageDto[];

  @ApiPropertyOptional({ type: () => [ScanReportDto] })
  scanReports?: ScanReportDto[];

  @ApiPropertyOptional({ type: () => [String] })
  bottomHeadline?: string[];

  @ApiPropertyOptional({ type: () => [ToolDocDto] })
  toolDocs?: ToolDocDto[];
}

export function toPortfolioResponseDto(raw: any): PortfolioResponseDto {
  // Shallow assign is sufficient because nested shapes match already
  return Object.assign(new PortfolioResponseDto(), raw);
}
