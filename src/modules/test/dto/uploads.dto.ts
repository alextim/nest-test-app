import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Min, MinLength } from "class-validator";
import { ApiFile } from "../../../decorators/api-file";

export class SingleFileFormDataDTO {
  @ApiProperty()
  @Min(3)
  @Type(() => Number)
  id: number;

  @ApiProperty()
  description: string;

  @ApiFile()
  image: Express.Multer.File;
}

export class MultipleFilesFormDataDTO {
  @ApiProperty()
  @MinLength(3)
  id: string;

  @ApiProperty()
  description: string;

  @ApiFile({ isArray: true })
  images: Express.Multer.File[];
}