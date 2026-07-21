import { IsInt } from 'class-validator';

export class UpdateTeacherAssignmentDto {
  @IsInt()
  teacherId!: number;
}
