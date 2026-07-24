import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  private readonly logger = new Logger('MailService');

  async sendOrderConfirmation(orderData: {
    email: string;
    orderId: string;
    amount: number;
  }) {
    try {
      await this.mailerService.sendMail({
        to: orderData.email,
        subject: `Order Confirmation - #${orderData.orderId}`,
        html: `<h1> Thank you for your order </h1><br> Order detail: <br/>
      Order ID: ${orderData.orderId} <br/>
      Order Amount: ${orderData.amount}`,
      });
      this.logger.log(
        `[SIMULATION] Confirmation email sent for order ${orderData.orderId}`,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Exception is thrown while sending the email',
      );
    }
  }
}
