import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  DailyWeekdays,
  IntervalType,
  SchedulerType,
} from '../entities/schedule.types';

export class CreateScheduleDto {
  @IsNumber()
  @IsNotEmpty()
  requestInterval: number;

  @IsNumber()
  @IsNotEmpty()
  pageLoadDelay: number;

  @IsNumber()
  @IsNotEmpty()
  timeout: number;

  @IsNumber()
  @IsNotEmpty()
  queryId: number;

  @IsNumber()
  @IsOptional()
  proxyId?: number;

  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsBoolean()
  @IsOptional()
  cronEnabled?: boolean;

  @IsNumber()
  @IsOptional()
  timezoneId?: number;

  @IsEnum(SchedulerType)
  @IsOptional()
  schedulerType?: SchedulerType;

  /**
   * daily
   */
  @IsBoolean({ each: true })
  @ArrayMinSize(7)
  @ArrayMaxSize(7)
  @ArrayNotEmpty()
  @IsArray()
  @IsOptional()
  dailyWeekdays?: DailyWeekdays;

  @IsDate()
  @IsOptional()
  dailyTime?: Date;

  /**
   * interval
   */
  @IsString()
  @MaxLength(4)
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  interval?: string;

  @IsEnum(IntervalType)
  @IsOptional()
  intervalType?: IntervalType;

  /**
   * custom
   */
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  minute?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  hour?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  dayOfMonth?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  month?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  dayOfWeek?: string;
}
