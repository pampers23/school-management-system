import { IsBoolean, IsString, IsInt } from 'class-validator';

export class CreateSchoolYearDto {
  @IsString()
  name!: string;

  @IsInt()
  startYear!: number;

  @IsInt()
  endYear!: number;

  @IsBoolean()
  isCurrent!: boolean;
}
