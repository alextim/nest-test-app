import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

import { JobStatus } from '../entities/job-status.enum';

export class CreateJobDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  requestInterval: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  pageLoadDelay: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  timeout: number;

  @ApiProperty()
  @IsEnum(JobStatus)
  @IsNotEmpty()
  status: JobStatus;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  proxyId?: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  queryId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  customerId: number;
}
