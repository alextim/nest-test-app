import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { LocalFilesModule } from '../local-files/local-files.module';
import { Schedule } from '../schedules/entities/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Schedule]), LocalFilesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
