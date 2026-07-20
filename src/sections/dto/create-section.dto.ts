import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  name!: string;

  @IsInt()
  curriculumId!: number;

  @IsOptional()
  @IsInt()
  capacity?: number;
}
