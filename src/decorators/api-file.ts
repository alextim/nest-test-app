// https://github.com/nestjs/swagger/issues/167
import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";

export const ApiFile = (options?: ApiPropertyOptions): PropertyDecorator => (
  target: Object,
  propertyKey: string | symbol,
) => {
  if (options?.isArray) {
    ApiProperty({
      type: 'array',
      items: {
        type: 'file',
        properties: {
          [propertyKey]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey);
  } else {
    ApiProperty({
      type: 'file',
      properties: {
        [propertyKey]: {
          type: 'string',
          format: 'binary',
        },
      },
    })(target, propertyKey);
  }
};

