import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@rewiko/crud-typeorm';

import { Post } from './entities/post.entity';

@Injectable()
export class PostsService extends TypeOrmCrudService<Post> {
  constructor(@InjectRepository(Post) postRepo) {
    super(postRepo);
  }
}
