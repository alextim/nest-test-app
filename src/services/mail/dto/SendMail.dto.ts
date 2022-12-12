import ParseMailTemplateDto from './ParseMailTemplate.dto';

type MailContact = {
  name: string;
  email: string;
};

type SendMailDto = {
  to: MailContact;
  from?: MailContact;
  subject: string;
  templateData: ParseMailTemplateDto;
};

export default SendMailDto;
