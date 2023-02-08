import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@rewiko/crud';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';

// @ApiCookieAuth()
// @UseGuards(SelfGuard)
@Crud({
  model: {
    type: Post,
  },
  dto: {
    create: CreatePostDto,
    update: UpdatePostDto,
    replace: CreatePostDto,
  },
  query: {
    join: {
      user: { eager: true, allow: ['id', 'email'] },
      customer: { eager: true, allow: ['id', 'firstName', 'lastName'] },
    },
  },
  routes: {
    deleteOneBase: {
      returnDeleted: true,
    },
  },
})
@Controller('posts')
export class PostsController implements CrudController<Post> {
  constructor(public readonly service: PostsService) {}
}
