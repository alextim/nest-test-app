import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsValidTimeInterval } from '../../../decorators/is-valid-time-interval.decorator';
import { IsCron } from '../../../decorators/is-cron.decorator';
import { UserExists } from '../../../decorators/user-exists';
import { QueryExists } from '../../../decorators/query-exists';
import { CustomerExists } from '../../../decorators/customer-exists';

import { IntervalType, SchedulerType } from '../entities/schedule.types';
import { ProxyExists } from 'src/decorators/proxy-exists';

export class CreateScheduleDto {
  @ApiProperty()
  @Min(500)
  @IsInt()
  @IsNotEmpty()
  requestInterval: number;

  @ApiProperty()
  @Min(500)
  @IsInt()
  @IsNotEmpty()
  pageLoadDelay: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  timeout: number;

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

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  schedulerEnabled?: boolean;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  timezoneId?: number;

  @ApiProperty()
  @IsEnum(SchedulerType)
  @IsNotEmpty()
  @ValidateIf(({ schedulerEnabled }) => schedulerEnabled)
  schedulerType: SchedulerType;

  /**
   * daily
   */
  @ApiProperty()
  @Max(6, { each: true })
  @Min(0, { each: true })
  @IsInt({ each: true })
  @ArrayMaxSize(7)
  @IsArray()
  @IsNotEmpty()
  @ValidateIf(({ schedulerType }) => schedulerType === SchedulerType.Daily)
  dailyWeekdays: number[];

  @ApiProperty()
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Doesn't match HH:MM",
  })
  @IsString()
  @MinLength(5)
  @MaxLength(5)
  @IsNotEmpty()
  @ValidateIf(({ schedulerType }) => schedulerType === SchedulerType.Daily)
  dailyTime: string;

  /**
   * interval
   */
  @ApiProperty()
  @IsValidTimeInterval()
  @IsInt()
  @IsNotEmpty()
  @ValidateIf(({ schedulerType }) => schedulerType === SchedulerType.Interval)
  interval: number;

  @ApiProperty()
  @IsEnum(IntervalType)
  @IsNotEmpty()
  @ValidateIf(({ schedulerType }) => schedulerType === SchedulerType.Interval)
  intervalType: IntervalType;

  /**
   * custom
   */
  @ApiProperty()
  @IsCron()
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  @ValidateIf(({ schedulerType }) => schedulerType === SchedulerType.Custom)
  @Transform(({ value }) => value?.trim())
  cron: string;
}
