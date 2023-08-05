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
  public async setCharacter(mbId: string, charName: string) {
    const image = await this.crawlerService.getCharacterProfileImg(charName);
    const murung = await this.crawlerService.getCharacterMurung(charName);
    const level = await this.crawlerService.getCharacterLevel(charName);
    this.charRepository.setCharacter(mbId, charName, image[0], level[0], murung[0]);
  }
}
