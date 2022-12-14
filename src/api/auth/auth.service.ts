import {
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  Inject,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { UserDto } from '../users/dto/UserDto';
import { User } from '../users/entities/user.entity';

import { UsersService } from '../users/users.service';

import { SignupDto } from './dto/signup.dto';
import { Mapper } from '../users/mapper';
import { TokensService } from './tokens.service';
import MailService from './mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  @Inject(UsersService) private readonly usersService: UsersService;

  constructor(private readonly tokensService: TokensService, private readonly mailService: MailService) {}

  public async signup(signupDto: SignupDto) {
    const user = await this.usersService.create(signupDto);
    try {
      const token = await this.tokensService.createEmailVerificationToken(
        user.id,
      );

      this.mailService.sendVerificationToken(user, token);      

      await this.usersService.setVerificationCodeSentAt(user);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async verifyEmailByToken(tokenValue: string) {
    const token = await this.tokensService.findEmailVerificationToken(
      tokenValue,
    );
    if (!token) {
      throw new NotFoundException('Token not found');
    }
    if (token.expiresAt < new Date()) {
      throw new BadRequestException('Token expired');
    }

    const user = await this.usersService.findById(token.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.verifiedAt) {
      throw new ForbiddenException('User already verified');
    }

    await this.usersService.setVerifiedAt(user);
  }

  async sendPasswordResetToken(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = await this.tokensService.createPasswordResetToken(
      user.id,
    );
    
    try {
      this.mailService.sendPasswordResetToken(user, token);      
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }    
  }

  async resetPasswordByToken({ token: tokenValue, password: plainPassword }: ResetPasswordDto) {
    const token = await this.tokensService.findPasswordResetToken(
      tokenValue,
    );
    if (!token) {
      throw new NotFoundException('Token not found');
    }
    if (token.expiresAt < new Date()) {
      throw new BadRequestException('Token expired');
    }

    const user = await this.usersService.findById(token.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.verifiedAt) {
      throw new ForbiddenException('User not verified');
    }

    await this.usersService.setPassword(user, plainPassword);
    await this.tokensService.expire(token.id);
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    if (!(await user.comparePasswords(plainTextPassword))) {
      throw new UnauthorizedException('Wrong credentials');
    }

    if (!user.verifiedAt) {
      throw new ForbiddenException('Verification is not completed');
    }

    return Mapper.toDto(user); 
  }
}
