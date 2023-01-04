import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import randtoken from 'rand-token';

import { Token, TokenType, TOKEN_LENGTH } from './entities/token.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token) private readonly repo,
    private readonly configService: ConfigService,
  ) {}

  private static generateToken() {
    return randtoken.uid(TOKEN_LENGTH);
  }

  private async createToken(
    userId: number,
    type: TokenType,
    expiresIn: number,
  ) {
    const token = TokensService.generateToken();
    const dto = {
      userId,
      token,
      type,
      expiresAt: new Date(new Date().getTime() + expiresIn * 1000),
    };
    const tokenEntity = this.repo.create(dto);
    await this.repo.save(tokenEntity);

    return token;
  }

  async createEmailVerificationToken(userId: number) {
    return this.createToken(
      userId,
      TokenType.EmailVerification,
      this.configService.get<number>('auth.emailVerificationTokenTTL'),
    );
  }

  async createPasswordResetToken(userId: number) {
    return this.createToken(
      userId,
      TokenType.PasswordReset,
      this.configService.get<number>('auth.passwordRecoveryTokenTTL'),
    );
  }

  async findPasswordResetToken(token: string) {
    return this.repo.findOneBy({ token, type: TokenType.PasswordReset });
  }

  async findEmailVerificationToken(token: string) {
    return this.repo.findOneBy({ token, type: TokenType.EmailVerification });
  }

  async expire(tokenId: number) {
    await this.repo.update(
      { id: tokenId },
      { expiresAt: new Date('1970-01-01') },
    );
  }
}
