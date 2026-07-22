import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOrderConfirmation(orderData: {
    email: string;
    orderId: string;
    amount: number;
  }) {
    await this.mailerService.sendMail({
      to: orderData.email,
      subject: `Order Confirmation - #${orderData.orderId}`,
      context: {
        orderId: orderData.orderId,
        amount: orderData.amount,
      },
      html: `<h1> Thank you for your order </h1><br> Order detail: <br/>
      order ID: ${orderData.orderId} <br/>
      order Amount: ${orderData.amount}`,
    });
    console.log(
      `[SIMULATION] Confirmation email sent for order ${orderData.orderId}`,
    );
  }
}
