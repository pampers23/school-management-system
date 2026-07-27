import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import {
  Gender,
  Semester,
  Track,
  Strand,
} from '../../../generated/prisma/enums';

export class CreateEnrollmentApplicationDto {
  @IsInt()
  @Min(1)
  gradeLevel!: number;

  @IsBoolean()
  hasLRN!: boolean;

  @IsBoolean()
  @IsOptional()
  isReturning?: boolean;

  @IsInt()
  schoolYearId!: number;

  @IsOptional()
  @IsString()
  psaNumber?: string;

  @IsOptional()
  @IsString()
  lrn?: string;

  @IsString()
  firstName!: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsString()
  extensionName?: string;

  @IsDateString()
  birthDate!: string;

  @IsEnum(Gender)
  gender!: Gender;

  @IsString()
  placeOfBirth!: string;

  @IsBoolean()
  @IsOptional()
  isIP?: boolean;

  @IsOptional()
  @IsString()
  ipCommunity?: string;

  @IsBoolean()
  @IsOptional()
  is4Ps?: boolean;

  @IsOptional()
  @IsString()
  householdId?: string;

  @IsBoolean()
  @IsOptional()
  hasDisability?: boolean;

  @IsOptional()
  @IsInt()
  lastGradeCompleted?: number;

  @IsOptional()
  @IsString()
  lastSchoolYear?: string;

  @IsOptional()
  @IsString()
  lastSchoolAttended?: string;

  @IsOptional()
  @IsString()
  lastSchoolId?: string;

  @IsOptional()
  @IsEnum(Semester)
  semester?: Semester;

  @IsOptional()
  @IsEnum(Track)
  track?: Track;

  @IsOptional()
  @IsEnum(Strand)
  strand?: Strand;
}
