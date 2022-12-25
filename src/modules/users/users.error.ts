import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('User not found');
  }
}

export class AvatarNotFoundException extends NotFoundException {
  constructor() {
    super('No avatar found');
  }
}
