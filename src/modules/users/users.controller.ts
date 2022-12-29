import path from 'node:path';
import fs from 'node:fs/promises';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
  StreamableFile,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiPayloadTooLargeResponse,
  ApiUnauthorizedResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Response, Request } from 'express';
import etag from 'etag';

import LocalFilesInterceptor from 'src/modules/local-files/local-files.interceptor';
import { ParseFile } from 'src/modules/local-files/parse-file.pipe';

import { SelfGuard } from '../auth/guards/self.guard';
import RequestWithUser from '../auth/interfaces/requestWithUser.interface';
import LocalFilesService from '../local-files/local-files.service';
import { AvatarUploadDto } from './dto/avatar-upload.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';
import { AvatarNotFoundException, UserNotFoundException } from './users.error';
import { UsersService } from './users.service';

// @ApiCookieAuth()
// @UseGuards(SelfGuard)
@Crud({
  model: {
    type: User,
  },
  dto: {
    create: CreateUserDto,
    update: UpdateUserDto,
    replace: CreateUserDto,
  },
  query: {
    exclude: ['password'],
    join: {
      avatar: { eager: true, allow: ['id', 'url'] },
    },
  },
  routes: {
    deleteOneBase: {
      returnDeleted: true,
    },
  },
})
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(
    public readonly service: UsersService,
    private readonly localFilesService: LocalFilesService,
  ) {}

  get base(): CrudController<User> {
    return this;
  }


  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateUserDto,
  ) {
    return this.base.createOneBase(req, dto as any);
  }  


  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Override()
  async replaceOne(
    @Param('id', ParseIntPipe) id: number,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: UpdateUserDto,
  ) {
    if (!(await this.service.idExists(id))) {
      throw new UserNotFoundException();
    }
    return this.base.replaceOneBase(req, dto as any);
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Override()
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: UpdateUserDto,
  ) {
    if (!(await this.service.idExists(id))) {
      throw new UserNotFoundException();
    }
    return this.base.updateOneBase(req, dto as any);
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(200)
  @Post('change-password')
  async changePasswordForAuthenticatedUser(
    @Body() dto: ChangePasswordDto,
    @Req() req: RequestWithUser,
  ) {
    if (!req.user) {
      throw new UnauthorizedException(
        'The user must be logged in to change the password',
      );
    }
    return this.changePassword(req.user.id, dto, req);
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(200)
  @Put('change-password/:id')
  async changePasswordForAdmin(
    @Param('id', ParseIntPipe) id: number,    
    @Body() dto: ChangePasswordDto,
    @Req() req: RequestWithUser,
  ) {
    return this.changePassword(id, dto, req);
  }

  async changePassword(id: number, { oldPassword, newPassword }: ChangePasswordDto, req: RequestWithUser) {
    if (oldPassword === newPassword) {
      throw new BadRequestException(
        'The new password is the same as the old one',
      );
    }
    const user = await this.service.findById(id);
    if (!user) {
      throw new UserNotFoundException();
    }
    const isPasswordValid = !user.password || await user.comparePasswords(oldPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong password');
    }
    user.setPassword(newPassword);
    await this.service.save(user);
    return 'New password set';
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AvatarUploadDto })
  @ApiNotFoundResponse()
  @ApiUnsupportedMediaTypeResponse()
  @ApiPayloadTooLargeResponse()
  @HttpCode(200)
  @Post(':id/avatar')
  @UseInterceptors(LocalFilesInterceptor({ fieldName: 'file' }))
  async uploadAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(ParseFile) file: Express.Multer.File,
  ) {
    if (!(await this.service.idExists(id))) {
      throw new UserNotFoundException();
    }

    return this.service.addAvatar(id, {
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype,
    });
  }

  @Get(':id/avatar')
  async getAvatar(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const user = await this.service.findById(id);
    if (!user) {
      throw new UserNotFoundException();
    }
    const fileId = user.avatarId;
    if (!fileId) {
      throw new AvatarNotFoundException();
    }
    const fileMetadata = await this.localFilesService.getFileById(
      user.avatarId,
    );

    // const pathOnDisk = path.join(process.cwd(), fileMetadata.path);
    const pathOnDisk = fileMetadata.path;

    const file = await fs.readFile(pathOnDisk);

    const tag = etag(file);

    response.set({
      'Content-Disposition': `inline; filename="${fileMetadata.filename}"`,
      'Content-Type': fileMetadata.mimetype,
      ETag: tag,
    });

    if (request.headers['if-none-match'] === tag) {
      response.status(304);
      return;
    }

    return new StreamableFile(file);
  }

  @ApiNotFoundResponse()
  @Delete(':id/avatar')
  async removeAvatar(@Param('id', ParseIntPipe) id: number) {
    const user = await this.service.findById(id);
    if (!user) {
      throw new UserNotFoundException();
    }
    if (!user.avatarId) {
      throw new AvatarNotFoundException();
    }

    return this.service.removeAvatar(id);
  }
}
