import { Module } from '@nestjs/common';
import { CrawlerService } from 'src/crawler/crawler.service';
import { CharRepository } from 'src/repository/char.repository';
import { CharController } from './char.controller';
import { CharService } from './char.service';

@Module({
  controllers: [CharController],
  providers: [CharService, CharRepository, CrawlerService]
})
export class CharModule { }
