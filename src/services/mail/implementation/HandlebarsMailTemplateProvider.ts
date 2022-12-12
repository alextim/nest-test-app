import fs from 'node:fs/promises';
import handlebars from 'handlebars';

import IParseMailTemplateDTO from '../dto/ParseMailTemplate.dto';
import IMailTemplateProvider from '../IMailTemplateProvider';

export default class HandlebarsMailTemplateProvider
  implements IMailTemplateProvider
{
  public async parse({
    file,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.readFile(file, { encoding: 'utf-8' });

    const parseTemplate = handlebars.compile(templateFileContent);
    return parseTemplate(variables);
  }
}
