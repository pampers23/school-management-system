import {
  IsString,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreateGradingPeriodDto {
  @IsString()
  name!: string;

  @IsInt()
  @Min(1)
  @Max(4)
  quarter!: number;

  @IsInt()
  schoolYearId!: number;

  @IsBoolean()
  @IsOptional()
  isCurrent?: boolean;

  @IsBoolean()
  @IsOptional()
  isOpen?: boolean;
}
