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
  async process(job: Job): Promise<any> {
    switch (job.name) {
      case 'send-confirmation-email': {
        try {
          // eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          const amount = job.data.items.reduce(
            (p: number, c: { price: number }) => {
              p = p + c.price;
              return p;
            },
            0,
          );
          await this.mailService.sendOrderConfirmation({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            email: job.data.email,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            orderId: job.data.id + '',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
