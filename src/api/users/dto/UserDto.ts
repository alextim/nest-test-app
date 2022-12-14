import { User } from "../entities/user.entity";

export type UserDto = Pick<User, 'id' | 'username' | 'email' | 'roles' | 'firstName' | 'lastName'>;