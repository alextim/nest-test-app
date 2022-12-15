import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';

import { Token } from './entities/token.entity';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { LocalSerializer } from './local.serializer';
import { TokensService } from './tokens.service';
import { MailModule } from '../../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    UsersModule,
    PassportModule,
    MailModule,
  ],
  providers: [AuthService, LocalStrategy, LocalSerializer, TokensService],
  controllers: [AuthController],
})
export class AuthModule {}
