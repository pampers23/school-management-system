import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { AnnouncementAudience } from '../../../generated/prisma/enums';

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  content!: string;

  @IsEnum(AnnouncementAudience)
  audience!: AnnouncementAudience;

  @ValidateIf(
    (dto: CreateAnnouncementDto) =>
      dto.audience === AnnouncementAudience.SECTION,
  )
  @IsInt()
  sectionId?: number;

  @IsOptional()
  isPublished?: boolean;
}
