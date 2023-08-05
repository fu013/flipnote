import { Inject, Injectable, Query } from '@nestjs/common';
import axios from 'axios';
import cheerio from 'cheerio';

import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class CrawlerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }
  private async getCharacterProfileImg(@Query('username') username: string) {
    try {
      const url = `https://maple.gg/u/${username}`;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const crawList = $('.character-avatar-row');
      const crawData = crawList.map((index, element) => {
        const img = $(element).find('img').attr('src');
        return { img };
      }).get();
      return crawData;
    } catch (error) {
      this.logger.error('Error occurred:', error);
      throw new Error('An error occurred while fetching news data');
    }
  }
}
