import SendMailDto from './dto/SendMail.dto';

interface IMailProvider {
  sendEmail(data: SendMailDto): Promise<void>;
}

export default IMailProvider;
