import { Request } from 'express';
import { UserDto } from '../../users/dto/UserDto';

interface RequestWithUser extends Request {
  user: UserDto;
}

export default RequestWithUser;
