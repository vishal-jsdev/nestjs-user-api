import { Processor, WorkerHost } from '@nestjs/bullmq';
import { MailService } from './mail.service';
import { Job } from 'bullmq';
import { BadRequestException } from '@nestjs/common';
export interface ConfirmationEmailData {
  items: { price: number }[];
  email: string;
  id: number;
}
@Processor('email')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }
  async process(job: Job<ConfirmationEmailData>): Promise<void> {
    switch (job.name) {
      case 'send-confirmation-email': {
        try {
          const amount = job.data.items.reduce(
            (p: number, c: { price: number }) => {
              p = p + c.price;
              return p;
            },
            0,
          );
          await this.mailService.sendOrderConfirmation({
            email: job.data.email,
            orderId: job.data.id + '',
            amount: amount,
          });
        } catch (error) {
          throw new BadRequestException(
            error,
            'Exception is thrown while sending the email from email processing',
          );
        }
        break;
      }
    }
  }
}
