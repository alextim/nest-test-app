/**
 * очень хорошее объяснение
 * 1)
 * https://medium.com/@prashantramnyc/how-to-implement-google-authentication-in-node-js-using-passport-js-9873f244b55e
 * 
 * 2)
 * https://stackoverflow.com/questions/71021405/nestjs-using-oauth-along-with-session
 * 
 * 3) react + zustand
 * https://blog.logrocket.com/implement-secure-single-sign-on-nestjs-google/
 * 
 * 4)!!!
 * https://dev.to/nestjs/setting-up-sessions-with-nestjs-passport-and-redis-210

 5) user -roles - prvileges
 https://dev.to/ismaeil_shajar/create-a-multi-tenancy-application-in-nestjs-part-4-authentication-and-authorization-setup-2c47
 * 
 * https://dev.to/imichaelowolabi/how-to-implement-login-with-google-in-nest-js-2aoa/comments
 * 
 * https://www.geeksforgeeks.org/google-authentication-using-passport-in-node-js/
 * 
 * https://www.makeuseof.com/nodejs-google-authentication/
 * 
 * https://blog.loginradius.com/engineering/google-authentication-with-nodejs-and-passportjs/
 */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';

import { FacebookAuthController } from './facebook-auth.controller';
import { FacebookAuthService } from './facebook-auth.service';
import { FacebookStrategy } from './facebook.strategy';

@Module({
  imports: [UsersModule],
  controllers: [FacebookAuthController],
  providers: [FacebookAuthService, FacebookStrategy],
})
export class FacebookAuthModule {}
