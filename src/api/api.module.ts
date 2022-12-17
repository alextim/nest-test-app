import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { GoogleAuthModule } from './google-auth/google-auth.module';
import { FacebookAuthModule } from './facebook-auth/facebook-auth.module';

@Module({
  imports: [
    UsersModule,
    HealthModule,
    AuthModule,
    GoogleAuthModule,
    FacebookAuthModule,
    AccountModule,
  ],
})
export class ApiModule {}
