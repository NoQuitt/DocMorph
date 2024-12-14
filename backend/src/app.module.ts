import { Module } from '@nestjs/common';
import { ProcessModule } from './process/process.module';
import { DownloadModule } from './download/download.module';

@Module({
  imports: [ProcessModule, DownloadModule],
})
export class AppModule {}
