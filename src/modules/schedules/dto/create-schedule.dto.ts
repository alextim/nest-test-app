import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { IsValidTimeInterval } from '../../../decorators/is-valid-time-interval.decorator';

import {
  DailyWeekdays,
  IntervalType,
  SchedulerType,
} from '../entities/schedule.types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  requestInterval: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pageLoadDelay: number;

  @IsNumber()
  @IsNotEmpty()
  timeout: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  queryId: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  proxyId?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  cronEnabled?: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  timezoneId: number;

  @ApiProperty()
  @IsEnum(SchedulerType)
  @IsNotEmpty()
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
  dailyWeekdays: DailyWeekdays;

  @ApiProperty()
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Doen't match HH:MM",
  })
  @IsString()
  @MinLength(5)
  @MaxLength(5)
  @IsNotEmpty()
  dailyTime: string;

  /**
   * interval
   */
  @ApiProperty()
  @IsValidTimeInterval()
  @IsNumber()
  @IsNotEmpty()
  interval: number;

  @ApiProperty()
  @IsEnum(IntervalType)
  @IsNotEmpty()
  intervalType: IntervalType;

  /**
   * custom
   */
  @ApiProperty()
  @MaxLength(40)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  minute: string;

  @ApiProperty()
  @MaxLength(40)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  hour: string;

  @ApiProperty()
  @MaxLength(40)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  dayOfMonth: string;

  @ApiProperty()
  @MaxLength(40)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  month: string;

  @ApiProperty()
  @MaxLength(40)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  dayOfWeek: string;
}
