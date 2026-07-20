import { InjectQueue } from '@nestjs/bullmq';
import { Body, Controller, Post } from '@nestjs/common';
import { Queue } from 'bullmq';

@Controller('audio')
export class AudioController {
  constructor(@InjectQueue('audio') private readonly audioQueue: Queue) {}

  @Post('transcode')
  async transcode(@Body() body: { fileId: string }) {
    // Adds job instantly and clears the main thread API response
    await this.audioQueue.add('transcode-job', {
      id: body.fileId,
    });
    return { success: true, message: 'Job enqueued successfully' };
  }
}
