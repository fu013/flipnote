import { Controller, Injectable, Get, Query } from '@nestjs/common';
import { CrawlerService } from './crawler.service';


@Injectable()
@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) { }

  /*   // 캐릭터 이미지 등록
    @Get('/profileImg')
    getNaverNews(@Query('username') username: string): Promise<any> {
      return this.crawlerService.getMapleProfileImg(username);
    } */
}
