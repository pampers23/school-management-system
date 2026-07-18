import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @MaxLength(20)
  code!: string;

  @IsString()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;
}
