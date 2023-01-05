import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import type { DeepPartial, FindOptionsWhere } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { LocalFileDto } from '../local-files/dto/local-file.dto';
import LocalFilesService from '../local-files/local-files.service';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) repo,
    private localFilesService: LocalFilesService,
  ) {
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

  async idExists(id: number) {
    return this.exists({ id });
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

  async setGoogleId(user: User, googleId: string) {
    await this.repo.update({ id: user.id }, { googleId });
  }

  async setFacebookId(user: User, facebookId: string) {
    await this.repo.update({ id: user.id }, { facebookId });
  }

  async updatePassword(user: User, plainPassword: string) {
    const hashedPassword = await User.hash(plainPassword);
    await this.repo.update({ id: user.id }, { password: hashedPassword });
  }

  async save(user: User): Promise<User> {
    return await this.repo.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async addAvatar(userId: number, fileData: LocalFileDto) {
    const { id: avatarId } = await this.localFilesService.saveLocalFileData(
      fileData,
    );
    await this.repo.update({ id: userId }, { avatarId });
  }

  async removeAvatar(userId: number) {
    await this.repo.update({ id: userId }, { avatarId: null });
  }

  async updateOneBy(dto: UpdateUserDto, req: CrudRequest) {
    const { allowParamsOverride, returnShallow } = req.options.routes.updateOneBase;
    const paramsFilters = this.getParamFilters(req.parsed);
    const found = await this.getOneOrFail(req, returnShallow);
    delete found.avatar;
    const toSave = { ...found, ...dto, ...(allowParamsOverride ? {} : paramsFilters), ...req.parsed.authPersist };

    const user = plainToInstance(this.entityType, toSave);
    const updated = await this.repo.save(user);

    if (returnShallow) {
        return updated;
    }

    req.parsed.paramsFilter.forEach((filter) => {
        filter.value = updated[filter.field];
    });
    return this.getOneOrFail(req);
  }
}
