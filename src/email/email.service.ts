import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InviteEmailDto } from './dto/invite-email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async welcomeEmail(data) {
    const { email, name } = data;

    const subject = `Welcome to Company: ${name}`;
    const registrationLink = `http://localhost:3000/registration?invitation-token=${2}`;
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './welcome',
      text: 'test',
      context: {
        registrationLink,
      },
    });
  }

  async inviteCompanyEmail(inviteEmailDto: InviteEmailDto) {

    const subject = `Welcome to Company: ${inviteEmailDto.companyName}`;
    const registrationLink = `http://localhost:3000/registration?invitation-token=${inviteEmailDto.token}`;
    await this.mailerService.sendMail({
      to: inviteEmailDto.email,
      subject,
      template: './welcome',
      text: 'test',
      context: {
        registrationLink,
      },
    });
  }
}
