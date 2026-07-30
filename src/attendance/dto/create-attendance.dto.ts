import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AttendanceStatus } from '../../../generated/prisma/enums';
import { Type } from 'class-transformer';

class AttendanceRecordDto {
  @IsInt()
  studentId!: number;

  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @IsOptional()
  @IsString()
  remarks!: string;
}

export class CreateAttendanceDto {
  @IsInt()
  attendanceSessionId!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDto)
  records!: AttendanceRecordDto[];
}
