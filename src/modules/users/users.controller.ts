import { Controller, NotFoundException, UploadedFile } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';

import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { FileUploadingUtils } from '../../interceptors/FileUploadingUtils';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Crud({
  model: {
    type: User,
  },
  query: {
    exclude: ['password'],
  },
  routes: {
    createOneBase: {
      interceptors: [FileUploadingUtils.singleFileUploader('avatar')],
    },
    replaceOneBase: {
      // allowParamsOverride: true,
      interceptors: [FileUploadingUtils.singleFileUploader('avatar')],
    },
    updateOneBase: {
      // allowParamsOverride: true,
      interceptors: [FileUploadingUtils.singleFileUploader('avatar')],
    },
    deleteOneBase: {
      returnDeleted: true,
    },
  },
})
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public readonly service: UsersService) {}

  get base(): CrudController<User> {
    return this;
  }

  @Override()
  @ApiConsumes('multipart/form-data')
  createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: User,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    dto.avatar = avatar?.filename;
    return this.base.createOneBase(req, dto);
  }

  @Override()
  @ApiConsumes('multipart/form-data')
  async replaceOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: User,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const id = req.parsed.paramsFilter[0].value;
    if (!(await this.service.idExists(id))) {
      throw new NotFoundException('User not found');
    }
    dto.avatar = avatar?.filename;
    return this.base.replaceOneBase(req, dto);
  }

  @Override()
  @ApiConsumes('multipart/form-data')
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: User,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const id = req.parsed.paramsFilter[0].value;
    if (!(await this.service.idExists(id))) {
      throw new NotFoundException('User not found');
    }
    dto.avatar = avatar?.filename;
    return this.base.updateOneBase(req, dto);
  }
}
