import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { JobStatus } from '../entities/job-status.enum';

export class CreateJobDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  requestInterval: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pageLoadDelay: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  timeout: number;

  @ApiProperty()
  @IsEnum(JobStatus)
  @IsNotEmpty()
  status: JobStatus;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  proxyId?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  queryId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  customerId: number;
}
