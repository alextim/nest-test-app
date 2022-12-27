import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import fs from 'node:fs';

import { LocalFileDto } from './dto/local-file.dto';
import LocalFile from './entities/local-file.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
class LocalFilesService {
  constructor(
    @InjectRepository(LocalFile)
    private localFilesRepository: Repository<LocalFile>,
    private readonly configService: ConfigService,
  ) {}

  async saveLocalFileData(dto: LocalFileDto) {
    const baseUrl = this.configService.get<string>('uploads.baseUrl');
    let url = dto.path.replace(/\\/g, '/');
    const n = url.indexOf(baseUrl);
    url = url.substring(n);

    const newFile = await this.localFilesRepository.create({
      ...dto,
      url,
    });
    await this.localFilesRepository.save(newFile);
    return newFile;
  }

  async getFileById(fileId: number) {
    const file = await this.localFilesRepository.findOneBy({ id: fileId });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

  fileExists(filePath: string) {
    return fs.existsSync(filePath);
  }
}

export default LocalFilesService;
