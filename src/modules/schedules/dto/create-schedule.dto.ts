import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsValidTimeInterval } from '../../../decorators/is-valid-time-interval.decorator';
import { IsCron } from '../../../decorators/is-cron.decorator';
import { UserExists } from '../../../decorators/user-exists';
import { QueryExists } from '../../../decorators/query-exists';
import { CustomerExists } from '../../../decorators/customer-exists';

import {
  DailyWeekdays,
  IntervalType,
  SchedulerType,
} from '../entities/schedule.types';
import { ProxyExists } from 'src/decorators/proxy-exists';

export class CreateScheduleDto {
  @ApiProperty()
  @Min(500)
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  requestInterval: number;

  @ApiProperty()
  @Min(500)
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  pageLoadDelay: number;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
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
  cronEnabled?: boolean;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  timezoneId?: number;

  @ApiProperty()
  @IsEnum(SchedulerType)
  @IsNotEmpty()
  @ValidateIf(({ cronEnabled }) => cronEnabled)
  schedulerType: SchedulerType;

  /**
   * daily
   */
  @ApiProperty()
  @IsBoolean({ each: true })
  @ArrayMinSize(7)
  @ArrayMaxSize(7)
  @ArrayNotEmpty()
  @IsArray()
  @IsNotEmpty()
  @ValidateIf(({ schedulerType }) => schedulerType === SchedulerType.Daily)
  dailyWeekdays: DailyWeekdays;

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
