import { Module } from '@nestjs/common';
import { LocalFilesModule } from '../local-files/local-files.module';
import { UsersModule } from '../users/users.module';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';

@Module({
  imports: [
    UsersModule,
    LocalFilesModule,
  ],  
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService]
})
export class GoogleAuthModule {}
