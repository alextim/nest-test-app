/**
 * catches any unique constraint violation exceptions during database create/update operations
 * 
 * https://stackoverflow.com/questions/48851140/how-to-handle-typeorm-entity-field-unique-validation-error-in-nestjs
 *
 * https://stackoverflow.com/a/73548291
 *
 */
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

type ExceptionType = { detail: string; table: string };

@Catch(QueryFailedError)
export class QueryErrorFilter extends BaseExceptionFilter<
  HttpException | ExceptionType
> {
  public catch(exception: ExceptionType, host: ArgumentsHost): any {
    const { detail } = exception || {};

    if (
      !detail ||
      typeof detail !== 'string' ||
      // deepcode ignore AttrAccessOnNull: <False positive>
      !detail.includes('already exists')
    ) {
      return super.catch(exception, host);
    }

    const messageStart = exception.table.split('_').join(' ') + ' with';

    /**
     * this regex transform the message `(phone)=(123)` to a more intuitive `with phone: "123"` one,
     * the regex is long to prevent mistakes if the value itself is ()=(), for example, (phone)=(()=())
     */
    const extractMessageRegex =
      /\((.*?)(?:(?:\)=\()(?!.*(\))(?!.*\))=\()(.*?)\)(?!.*\)))(?!.*(?:\)=\()(?!.*\)=\()((.*?)\))(?!.*\)))/;
    /** prevent Regex DoS, doesn't treat messages longer than 200 characters */
    const exceptionDetail =
      exception.detail.length <= 200
        ? exception.detail.replace(extractMessageRegex, 'with $1: "$3"')
        : exception.detail;

    super.catch(
      new BadRequestException(exceptionDetail.replace('Key', messageStart)),
      host,
    );
  }
}
