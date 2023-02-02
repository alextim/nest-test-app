import type {
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator } from 'class-validator';

const acceptMimeTypes = ['image/avif', 'image/jpeg', 'image/png', 'image/webp'];

export function IsImageFile(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: MimeTypeValidator,
    });
  };
}

class MimeTypeValidator implements ValidatorConstraintInterface {
  validate(mimeType: string) {
    const fileType = acceptMimeTypes.find((type) => type === mimeType);
    return !fileType;
  }

  defaultMessage() {
    return `$property not valid mime. Accepts ${acceptMimeTypes
      .map((m) => m.split('/')[1])
      .join(', ')}`;
  }
}
