import { PartialType, OmitType, ApiProperty } from '@nestjs/swagger';
import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateCustomerDto } from './create-customer.dto';
import { UpdateLinkedInProfileDto } from './linked-in-profile.dto';

class UpdateCustomerDtoBase extends OmitType(CreateCustomerDto, [
  'linkedInProfile',
] as const) {
  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateLinkedInProfileDto)
  linkedInProfile: UpdateLinkedInProfileDto;
}

export class UpdateCustomerDto extends PartialType(UpdateCustomerDtoBase) {}
