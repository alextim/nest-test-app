import { BadRequestException, Body, Controller, HttpCode, HttpStatus, NotFoundException, Param, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { FilesToBodyInterceptor, FileToBodyInterceptor } from 'src/interceptors/file-to-body';
import LocalFilesInterceptor from 'src/interceptors/localFiles.interceptor';
import RequestWithUser from '../auth/interfaces/requestWithUser.interface';
import { MultipleFilesFormDataDTO, SingleFileFormDataDTO } from './dto/uploads.dto';


@Controller('test')
export class TestController {
  constructor() {}


  @ApiConsumes('multipart/form-data')
   /*
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        description: { type: 'string' },
        id: { type: 'integer' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  */
  @Post('single')
  // @UseInterceptors(FileToBodyInterceptor)
  @UseInterceptors(FileInterceptor('image'))
  async uploadSingleFile(
    // @Req() req,
    // @Body() body: SingleFileFormDataDTO,
     @UploadedFile() image: Express.Multer.File
  ): Promise<void> {
    if (!image) {
      throw new BadRequestException('no image file sent.');
    }
    return;
  }
  
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        description: { type: 'string' },
        id: { type: 'integer' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.OK })  
  @ApiResponse({ status: HttpStatus.PAYLOAD_TOO_LARGE })  
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })  
  @Post('avatar')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(LocalFilesInterceptor({
    fieldName: 'image',
    path: 'avatars',
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.includes('image')) {
        return callback(new BadRequestException('Provide a valid image'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: Math.pow(10, 2) // 1MB
    }
  }))
  async addAvatar(@Req() req: RequestWithUser, @UploadedFile() image: Express.Multer.File, @Body() body: any,
  ) {
    console.log(image, req.user);
    /*
    return this.usersService.addAvatar(req.user.id, {
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype
    });
    */
  }
  
  @ApiBody({ type: MultipleFilesFormDataDTO })
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('images'), FilesToBodyInterceptor)
  async uploadMultipleFiles(
    @Body() body: MultipleFilesFormDataDTO,
  ): Promise<void> {
    if (!body.images) {
      throw new BadRequestException('no image file sent.');
    }
    return;
  }  
}


