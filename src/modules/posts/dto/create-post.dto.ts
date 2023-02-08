import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { CustomerExists } from '../../../decorators/customer-exists';
import { UserExists } from '../../../decorators/user-exists';

import { PostType } from '../entities/post-type.enum';

export class CreatePostDto {
  @ApiProperty()
  @MaxLength(128)
  @IsString()
  @IsNotEmpty()
  postId: string;

  @ApiProperty()
  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  postUrl: string;

  @ApiPropertyOptional()
  @MaxLength(256)
  @IsString()
  @IsOptional()
  articleUrl?: string;

  @ApiPropertyOptional()
  @MaxLength(256)
  @IsString()
  @IsOptional()
  targetUrl?: string;

  @ApiPropertyOptional()
  @MaxLength(256)
  @IsString()
  @IsOptional()
  contentUrl?: string;

  @ApiPropertyOptional()
  @MaxLength(256)
  @IsString()
  @IsOptional()
  contentImage?: string;

  @ApiPropertyOptional()
  @MaxLength(256)
  @IsString()
  @IsOptional()
  contentVideo?: string;

  @ApiPropertyOptional()
  @MaxLength(256)
  @IsString()
  @IsOptional()
  contentShare?: string;

  @ApiPropertyOptional()
  @MaxLength(256)
  @IsString()
  @IsOptional()
  contentDocument?: string;

  @ApiProperty()
  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  profileUrl: string;

  @ApiProperty()
  @MaxLength(64)
  @IsString()
  @IsNotEmpty()
  profileName: string;

  @ApiPropertyOptional()
  @MaxLength(64)
  @IsString()
  @IsOptional()
  authorName?: string;

  @ApiProperty()
  @IsEnum(PostType)
  @IsNotEmpty()
  type: PostType;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  likes?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  comments?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  views?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  reposts?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  tags?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  tagsCount?: number;

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
