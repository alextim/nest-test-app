import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import fs from 'node:fs';

import { LocalFileDto } from './dto/local-file.dto';
import LocalFile from './entities/local-file.entity';

@Injectable()
class LocalFilesService {
  constructor(
    @InjectRepository(LocalFile)
    private localFilesRepository: Repository<LocalFile>,
  ) {}

  async saveLocalFileData(fileData: LocalFileDto) {
    const newFile = await this.localFilesRepository.create(fileData);
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
