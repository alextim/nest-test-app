import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

import { CustomerExists } from '../../../decorators/customer-exists';
import { ProxyExists } from '../../../decorators/proxy-exists';
import { QueryExists } from '../../../decorators/query-exists';
import { UserExists } from '../../../decorators/user-exists';

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
  @QueryExists()
  @IsInt()
  @IsNotEmpty()
  queryId: number;

  @ApiPropertyOptional()
  @ProxyExists()
  @IsInt()
  @IsOptional()
  proxyId?: number;

  @ApiProperty()
  @CustomerExists()
  @IsInt()
  @IsNotEmpty()
  customerId: number;

  @ApiProperty()
  @UserExists()
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
