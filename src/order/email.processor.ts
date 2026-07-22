import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from './mail.service';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }
  async process(job: {
    name: string;
    data: { items: { price: number }[]; email: string; id: number };
  }): Promise<any> {
    switch (job.name) {
      case 'send-confirmation-email':
        // eslint-disable-next-line no-case-declarations
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

        break;
    }
  }
}
