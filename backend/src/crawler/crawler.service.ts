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
  // 크롤링 대상 사이트들의 URL
  private maplegg_user_URL = "https://maple.gg/u";

  public async getCharacterProfileImg(username: string) {
    try {
      const url = `${this.maplegg_user_URL}/${username}`;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const crawList = $('.character-avatar-row');
      const crawData = crawList.map((index, element) => {
        const result = $(element).find('img').attr('src');
        return result;
      }).get();
      console.log("JSON_IMG: " + JSON.stringify(crawData));
      return crawData;
    } catch (error) {
      this.logger.error('Error occurred:', error);
      throw new Error('An error occurred while Crawling [getCharacterProfileImg]');
    }
  }
  public async getCharacterMurung(username: string) {
    try {
      const url = `${this.maplegg_user_URL}/${username}`;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const crawList = $('.user-summary-box-content');
      const crawData = crawList.map((index, element) => {
        const result = $(element).find('.user-summary-floor').text();
        return result.substring(0, 2).trim();
      }).get();
      return crawData;
    } catch (error) {
      this.logger.error('Error occurred:', error);
      throw new Error('An error occurred while Crawling [getCharacterMurung]');
    }
  }
  public async getCharacterLevel(username: string) {
    try {
      const url = `${this.maplegg_user_URL}/${username}`;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const crawList = $('.user-summary-list');
      const crawData = crawList.map((index, element) => {
        const result = $(element).find('.user-summary-item').eq(0).text();
        return result;
      }).get();
      return crawData;
    } catch (error) {
      this.logger.error('Error occurred:', error);
      throw new Error('An error occurred while Crawling [getCharacterMurung]');
    }
  }
}
