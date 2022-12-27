import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  StreamableFile,
  Res,
  ParseIntPipe,
  Post,
  HttpCode,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiPayloadTooLargeResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';

import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { MediaUploadDto } from './dto/media-upload.dto';
import LocalFilesInterceptor from './local-files.interceptor';
import LocalFilesService from './local-files.service';
import { ParseFile } from './parse-file.pipe';

@Controller('local-files')
@UseInterceptors(ClassSerializerInterceptor)
export default class LocalFilesController {
  constructor(private readonly localFilesService: LocalFilesService) {}

  @Get(':id')
  async getDatabaseFileById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const file = await this.localFilesService.getFileById(id);

    const stream = createReadStream(join(process.cwd(), file.path));

    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': file.mimetype,
    });

    return new StreamableFile(stream);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: MediaUploadDto })
  @ApiNotFoundResponse()
  @ApiUnsupportedMediaTypeResponse()
  @ApiPayloadTooLargeResponse()
  @HttpCode(200)
  @Post('upload-media')
  @UseInterceptors(LocalFilesInterceptor({ fieldName: 'file' }))
  async uploadMedia(@UploadedFile(ParseFile) file: Express.Multer.File) {
    const newFile = await this.localFilesService.saveLocalFileData({
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype,
    });

    return newFile;
  }
}
