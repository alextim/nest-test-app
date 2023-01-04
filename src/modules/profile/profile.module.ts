import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '../../mail/mail.module';
import { UsersModule } from '../users/users.module';

import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

import { TokensService } from './tokens.service';
import { Token } from './entities/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    UsersModule,
    MailModule,
    ConfigModule,
  ],
  providers: [ProfileService, TokensService],
  controllers: [ProfileController],
  exports: [ProfileService, TokensService],
})
export class ProfileModule {}
