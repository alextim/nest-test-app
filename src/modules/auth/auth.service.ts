import {
  ForbiddenException,
  UnauthorizedException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';

import { UsersService } from '../users/users.service';
import { UserExternalAuthorizationDto } from './dto/user-external-authorization.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid username/password');
    }

    if (!(await user.comparePasswords(plainTextPassword))) {
      throw new UnauthorizedException('Invalid username/password');
    }

    if (!user.verifiedAt) {
      throw new ForbiddenException(
        'You need to complete email verification to login. Check your mail',
      );
    }

    return user;
  }

  async findOrCreateUser(dto: UserExternalAuthorizationDto) {
    if (!dto.providerId) {
      throw new BadRequestException('providerId required');
    }

    let facebookId: string;
    let googleId: string;

    switch (dto.providerName) {
      case 'google':
        googleId = dto.providerId;
        break;
      case 'facebook':
        facebookId = dto.providerId;
        break;
      default:
        throw new BadRequestException('Unsupported provider');
    }

    const user = await this.usersService.findByEmail(dto.email);

    if (user) {
      return this.updateUserFromExternal(user, dto);
    }

    const avatarId = await this.usersService.downloadAvatarFromUrl(
      dto.avatar,
      dto.email.split('@')[0],
    );

    return this.usersService.create({
      email: dto.email,
      firstName: dto.email,
      lastName: dto.email,
      googleId,
      isRegisteredWithGoogle: !!googleId,
      facebookId,
      isRegisteredWithFacebook: !!facebookId,
      avatarId,
      verifiedAt: new Date(),
    });
  }

  async updateUserFromExternal(
    user: User,
    {
      providerId,
      providerName,
      email,
      firstName,
      lastName,
      avatar,
    }: UserExternalAuthorizationDto,
  ) {
    let needUpdate = false;
    if (!user.lastName && lastName) {
      needUpdate = true;
      user.lastName = lastName;
    }
    if (!user.firstName && firstName) {
      needUpdate = true;
      user.lastName = firstName;
    }

    if (providerName === 'google' && !user.googleId) {
      needUpdate = true;
      user.googleId = providerId;
    }

    if (providerName === 'facebook' && !user.facebookId) {
      needUpdate = true;
      user.facebookId = providerId;
    }

    if (!user.verifiedAt) {
      needUpdate = true;
      user.verifiedAt = new Date();
    }

    if (!user.avatarId && avatar) {
      const avatarId = await this.usersService.downloadAvatarFromUrl(
        avatar,
        email.split('@')[0],
      );
      if (avatarId) {
        needUpdate = true;
        user.avatarId = avatarId;
      }
    }

    if (needUpdate) {
      return this.usersService.save(user);
    }

    return user;
  }
}
