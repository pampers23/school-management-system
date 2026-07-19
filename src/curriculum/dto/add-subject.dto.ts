import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class AddSubjectDto {
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  subjectIds!: number[];
}
