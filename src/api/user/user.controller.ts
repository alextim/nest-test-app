import { Controller } from '@nestjs/common';

import { Crud, CrudController } from '@nestjsx/crud';

import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Crud({
  model: {
    type: User,
  },
  query: {
    exclude: ['password'],
  },
})
@Controller('users')
export class UserController implements CrudController<User> {
  constructor(public readonly service: UserService) {}
}
