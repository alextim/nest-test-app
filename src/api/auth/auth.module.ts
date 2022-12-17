import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { LocalSerializer } from './local.serializer';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    /*
 PassportModule.register({
      session: true,
    }),    
    */
    ConfigModule,
  ],
  providers: [AuthService, LocalStrategy, LocalSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
