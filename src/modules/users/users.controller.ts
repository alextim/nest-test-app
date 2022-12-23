import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';

import { FileUploadingUtils } from '../../interceptors/FileUploadingUtils';
import { SelfGuard } from '../auth/guards/self.guard';
import RequestWithUser from '../auth/interfaces/requestWithUser.interface';
import { ChangePasswordDto } from './dto/change-password.dto';

import { User } from './entities/user.entity';
import { UserNotFoundException } from './users.error';
import { UsersService } from './users.service';

@ApiCookieAuth()
@UseGuards(SelfGuard)
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
      interceptors: [FileUploadingUtils.singleFileUploader('avatar')],
    },
    updateOneBase: {
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

  @ApiNotFoundResponse()
  @Override()
  @ApiConsumes('multipart/form-data')
  async replaceOne(
    @Param('id') id: number,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: User,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    if (!(await this.service.idExists(id))) {
      throw new UserNotFoundException();
    }
    dto.avatar = avatar?.filename;
    return this.base.replaceOneBase(req, dto);
  }

  @ApiNotFoundResponse()
  @Override()
  @ApiConsumes('multipart/form-data')
  async updateOne(
    @Param('id') id: number,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: User,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    if (!(await this.service.idExists(id))) {
      throw new UserNotFoundException();
    }
    dto.avatar = avatar?.filename;
    return this.base.updateOneBase(req, dto);
  }

  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(200)
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: RequestWithUser,
  ) {
    const user = await this.service.findById(req.user.id);
    if (!user) {
      throw new UserNotFoundException();
    }
    const isPasswordValid = await user.comparePasswords(
      changePasswordDto.oldPassword,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong password');
    }
    user.setPassword(changePasswordDto.newPassword);
    return await this.service.save(user);
  }
}
