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
import MailService from './mail/mail.service';
import MailProvider from '../../services/mail/implementation/MailProvider';

@Module({
  imports: [TypeOrmModule.forFeature([Token]), UsersModule, PassportModule],
  providers: [
    AuthService,
    LocalStrategy,
    LocalSerializer,
    TokensService,
    MailService,
    MailProvider,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
