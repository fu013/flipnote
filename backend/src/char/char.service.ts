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

  public async setCharacter(mbId: string, chName: string) {
    try {
      const image = await this.crawlerService.getCharacterProfileImg(chName);
      const murung = await this.crawlerService.getCharacterMurung(chName);
      const level = await this.crawlerService.getCharacterLevel(chName);
      await this.charRepository.setCharacter(mbId, chName, image[0], level[0], murung[0]);
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

  public async delCharacter(mbId: string, chName: string) {
    try {
      await this.charRepository.delCharacter(mbId, chName);
      return Object.assign({
        status: 201,
        statusText: 'Deleted',
        message: "캐릭터 프리셋 삭제",
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
