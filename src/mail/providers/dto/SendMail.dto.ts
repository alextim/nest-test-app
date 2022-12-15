type MailContact = {
  name: string;
  email: string;
};

type SendMailDto = {
  to: MailContact;
  from?: MailContact;
  subject: string;
  template: {
    filename: string;
    params: Record<string, string | number>;
  };
};

export default SendMailDto;
