import SendMailDto from '../dto/SendMail.dto';

export class FakeMailService {
  private messages: SendMailDto[] = [];

  public async sendEmail(message: SendMailDto): Promise<void> {
    this.messages.push(message);
  }
}
