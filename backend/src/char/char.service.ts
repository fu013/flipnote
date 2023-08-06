import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CrawlerService } from 'src/crawler/crawler.service';
import { CharRepository } from 'src/repository/char.repository';

@Injectable()
export class CharService {
  constructor(
    private readonly charRepository: CharRepository,
    private readonly crawlerService: CrawlerService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }
  public async getCharacterInfoByMemberId(mbId: string) {
    return this.charRepository.getCharacterInfoByMemberId(mbId);
  }
  public async setCharacter(mbId: string, charName: string) {
    try {
      const image = await this.crawlerService.getCharacterProfileImg(charName);
      const murung = await this.crawlerService.getCharacterMurung(charName);
      const level = await this.crawlerService.getCharacterLevel(charName);
      await this.charRepository.setCharacter(mbId, charName, image[0], level[0], murung[0]);
      return Object.assign({
        status: 201,
        statusText: 'Created',
        message: "캐릭터 프리셋 추가",
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }

  }
}
