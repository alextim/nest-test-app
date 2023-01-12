import { PartialType } from '@nestjs/swagger';
import { CreateProxyDto } from './create-proxy.dto';

export class UpdateProxyDto extends PartialType(CreateProxyDto) {}
