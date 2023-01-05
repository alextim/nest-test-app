import { UserDto } from './dto/UserDto';
import { User } from './entities/user.entity';

export class UserMapper {
  static toDto(user: User) {
    const dto: UserDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: [...user.roles],
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar ? {...user.avatar} : undefined,
    };
    return dto;
  }
}
