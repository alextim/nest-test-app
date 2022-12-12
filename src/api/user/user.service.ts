import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { FindOptionsWhere } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) repo) {
    super(repo);
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
}
