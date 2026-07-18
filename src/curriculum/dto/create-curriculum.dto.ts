import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Strand, Track } from '../../../generated/prisma/enums';

export class CreateCurriculumDto {
  @IsString()
  @MaxLength(100)
  curriculumName!: string;

  @IsInt()
  gradeLevel!: number;

  @IsInt()
  schoolYearId!: number;

  @IsOptional()
  @IsEnum(Track)
  track?: Track;

  @IsOptional()
  @IsEnum(Strand)
  strand?: Strand;
}
