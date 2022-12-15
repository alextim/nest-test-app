import { UserDto } from './dto/UserDto';
import { User } from './entities/user.entity';

export class Mapper {
  static toDto(user: User) {
    const dto: UserDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: [...user.roles],
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return dto;
  }
}
