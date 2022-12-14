import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial, FindOptionsWhere } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) repo) {
    super(repo);
  }
  async findById(id: number) {
    return this.repo.findOneBy({ id });
  }

  async findByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  private async exists(where: FindOptionsWhere<User>) {
    const count = await this.repo.countBy(where);
    return count > 0;
  }

  async emailExists(email: string) {
    return this.exists({ email });
  }

  async findByUsername(username: string) {
    return this.repo.findOneBy({ username });
  }

  async usernameExists(username: string) {
    return this.exists({ username });
  }

  async create(dto: DeepPartial<User>) {
    const user = this.repo.create(dto);
    return this.repo.save(user);
  }

  async setVerificationCodeSentAt(user: User, date = new Date()) {
    await this.repo.update({ id: user.id }, { verificationCodeSentAt: date });
  }

  async setVerifiedAt(user: User, date = new Date()) {
    await this.repo.update({ id: user.id }, { verifiedAt: date });
  }

  async setPassword(user: User, plainPassword: string) {
    const hashedPassword = await User.hash(plainPassword);
    await this.repo.update({ id: user.id }, { password: hashedPassword });
  }
}
