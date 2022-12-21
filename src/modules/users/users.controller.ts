import { Controller, FileTypeValidator, ParseFilePipe, UploadedFile } from '@nestjs/common';
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
    dto.avatar = avatar?.filename; // log to see all available data
    return this.base.createOneBase(req, dto);
  }
}
