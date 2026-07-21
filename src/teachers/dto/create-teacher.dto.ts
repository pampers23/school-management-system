import { IsString, IsOptional } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  employeeId!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  extensionName?: string;
}
