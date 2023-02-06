import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@rewiko/crud-typeorm';

import { Timezone } from './entities/timezone.entity';

@Injectable()
export class TimezonesService extends TypeOrmCrudService<Timezone> {
  constructor(@InjectRepository(Timezone) tzRepo) {
    super(tzRepo);
  }
}
