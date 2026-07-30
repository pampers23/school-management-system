import { IsDateString, IsInt } from 'class-validator';

export class CreateAttendanceSessionDto {
  @IsInt()
  sectionSubjectId!: number;

  @IsInt()
  schoolYearId!: number;

  @IsDateString()
  attendanceDate!: string;
}
