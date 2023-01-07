import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { UsersModule } from '../users/users.module';
import { GoogleAuthController } from './google-auth.controller';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [GoogleAuthController],
  providers: [AuthService],
})
export class GoogleAuthModule {}
