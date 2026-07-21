import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from './mail.service';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'transcode-job':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, no-case-declarations
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          orderId: job.data.id,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          amount: amount,
        });

        break;
    }
  }
}
