import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';

@Module({
  providers: [CrawlerService],
  controllers: [CrawlerController]
})
export class CrawlerModule {}
