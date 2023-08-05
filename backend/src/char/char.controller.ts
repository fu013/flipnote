import { Body, Controller, Post, UseGuards, Request, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CharService } from './char.service';

@Controller('char')
export class CharController {
  constructor(
    private readonly charService: CharService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) { }

  @Post('/setCharacter')
  @Throttle(10, 600) // 10분, 10개의 요청으로 제한 (DB Create 기능이므로, 테러에 의한 DB 용량 과부하 방지)
  @UseGuards(AuthGuard('jwt'))
  public async setCharacter(@Request() req, @Body('charName') charName: string) {
    this.charService.setCharacter(req.user.mbId, charName); // JWT AccessToken 검증된 아이디 === 로그인 아이디
  }
}
