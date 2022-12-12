import ParseMailTemplateDto from './dto/ParseMailTemplate.dto';

interface IMailTemplateProvider {
  parse(data: ParseMailTemplateDto): Promise<string>;
}

export default IMailTemplateProvider;
