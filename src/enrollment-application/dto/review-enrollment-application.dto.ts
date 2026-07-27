import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '../../../generated/prisma/enums';

export class ReviewEnrollmentApplicationDto {
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;

  @IsOptional()
  @IsString()
  remarks?: string;
}
