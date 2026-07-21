import { IsInt } from 'class-validator';

export class CreateTeacherAssignmentDto {
  @IsInt()
  teacherId!: number;

  @IsInt()
  sectionSubjectId!: number;

  @IsInt()
  schoolYearId!: number;
}
