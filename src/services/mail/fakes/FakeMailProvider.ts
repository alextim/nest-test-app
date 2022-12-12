import IMailProvider from '../IMailProvider';
import SendMailDto from '../dto/SendMail.dto';

export default class FakeMailProvider implements IMailProvider {
  private messages: SendMailDto[] = [];

  public async sendEmail(message: SendMailDto): Promise<void> {
    this.messages.push(message);
  }
}
