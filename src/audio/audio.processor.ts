import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('audio')
export class AudioProcessor extends WorkerHost {
  process(job: Job<any, any, string>): any {
    switch (job.name) {
      case 'transcode-job':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(`Processing file: ${job.data.id}`);
        break;
    }
  }
}
