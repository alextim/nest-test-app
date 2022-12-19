import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '../../mail/mail.module';
import { UsersModule } from '../users/users.module';

import { AccountService } from './account.service';
import { AccountController } from './account.controller';

import { TokensService } from './tokens.service';
import { Token } from './entities/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    UsersModule,
    MailModule,
    ConfigModule,
  ],
  providers: [AccountService, TokensService],
  controllers: [AccountController],
  exports: [AccountService, TokensService],
})
export class AccountModule {}
