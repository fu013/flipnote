import { Body, Controller, Post, Get, UseGuards, Request, Inject } from '@nestjs/common';
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
  // 캐릭터 관련 서비스 60분, 5000개의 요청으로 제한 (DB Create 기능이므로, 테러에 의한 DB 용량 과부하 방지)

  @Get('/getCharacter')
  @Throttle(5000, 3600) // 허용 요청 수와 제한 시간 설정
  @UseGuards(AuthGuard('jwt'))
  public async getCharacter(@Request() req) {
    return this.charService.getCharacterInfoByMemberId(req.user.mbId); // JWT AccessToken 검증된 아이디 === 로그인 아이디
  }

  @Post('/setCharacter')
  @Throttle(5000, 3600)
  @UseGuards(AuthGuard('jwt'))
  public async setCharacter(@Request() req, @Body('charName') charName: string) {
    this.charService.setCharacter(req.user.mbId, charName);
  }
}
