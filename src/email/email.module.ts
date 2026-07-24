import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { EmailProcessor } from './email.processor';
import { MailService } from './mail.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'email' })],
  providers: [EmailProcessor, MailService],
  exports: [MailService],
})
export class EmailModule {}
