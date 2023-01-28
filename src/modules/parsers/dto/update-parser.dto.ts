import { PartialType } from '@nestjs/swagger';
import { CreateParserDto } from './create-parser.dto';

export class UpdateParserDto extends PartialType(CreateParserDto) {}
