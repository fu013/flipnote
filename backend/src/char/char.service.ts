import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'concurrently';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CrawlerService } from 'src/crawler/crawler.service';
import { CharRepository } from 'src/repository/char.repository';

@Injectable()
export class CharService {
  constructor(
    private readonly charRepository: CharRepository,
    private readonly crawlerService: CrawlerService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) { }
  public async setCharacter(mbId: string, charName: string) {
    const profileImage = await this.crawlerService.getCharacterProfileImg(charName);
  }
}
