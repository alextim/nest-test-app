import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
} from 'class-validator';

export type OrderItem = [number, number | null];

export class ReorderParsersDto {
  @IsArray()
  @ArrayMinSize(2, { each: true })
  @ArrayMaxSize(2, { each: true })
  @IsArray({ each: true })
  @ArrayNotEmpty()
  items: OrderItem[];
}
