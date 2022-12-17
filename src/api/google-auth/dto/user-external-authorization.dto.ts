export class UserExternalAuthorizationDto {
  providerId: string;
  providerName: string;

  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}
