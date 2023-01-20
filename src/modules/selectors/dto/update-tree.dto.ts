import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';

export type TreeItem = [number, number | null];

export class UpdateTreeDto {
  @IsArray()
  @ArrayMinSize(2, { each: true })
  @ArrayMaxSize(2, { each: true })
  @IsArray({ each: true })
  @ArrayNotEmpty()
  items: TreeItem[];
}
