import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import fs from 'node:fs';
import path from 'node:path';

import { LocalFileDto } from './dto/local-file.dto';
import LocalFile from './entities/local-file.entity';
import { downloadFromUrl } from './download-from-url';
import { getRandomFilename } from './get-random-filename';

@Injectable()
class LocalFilesService {
  constructor(
    @InjectRepository(LocalFile)
    private localFilesRepository: Repository<LocalFile>,
    private readonly configService: ConfigService,
  ) {}

  private getUrlFromFilepath(filepath: string) {
    const baseUrl = this.configService.get<string>('uploads.baseUrl');
    const url = filepath.replace(/\\/g, '/');
    const n = url.indexOf(baseUrl);
    return url.substring(n);
  }

  async saveLocalFileData(dto: LocalFileDto) {
    const url = this.getUrlFromFilepath(dto.path);

    const newFile = await this.localFilesRepository.create({
      ...dto,
      url,
    });
    await this.localFilesRepository.save(newFile);
    return newFile;
  }

  async download(downloadUrl: string, name: string, dir: string) {
    const { filepath, mimetype } = await downloadFromUrl(
      downloadUrl,
      path.join(
        this.configService.get<string>('uploads.dir'),
        dir,
        getRandomFilename(name),
      ),
    );

    const url = this.getUrlFromFilepath(filepath);
    const filename = path.basename(filepath);

    const newFile = await this.localFilesRepository.create({
      filename,
      path: filepath,
      mimetype,
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
