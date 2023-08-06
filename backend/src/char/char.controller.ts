import { Body, Controller, Post, Get, UseGuards, Request, Inject, Delete, Query } from '@nestjs/common';
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
  // 캐릭터 관련 특정 서비스(생성, 업데이트 같은 트래픽 유발 기능 관련) 60분, 5000개의 요청으로 제한 (DB Create 기능이므로, 테러에 의한 DB 용량 과부하 방지)

  @Get('/getCharacter')
  @Throttle(100, 10)
  @UseGuards(AuthGuard('jwt'))
  public async getCharacter(@Request() req) {
    return this.charService.getCharacterInfoByMemberId(req.user.mbId); // JWT AccessToken 검증된 아이디 === 로그인 아이디
  }

  @Post('/setCharacter')
  @Throttle(5000, 3600)
  @UseGuards(AuthGuard('jwt'))
  public async setCharacter(@Request() req, @Body('charName') charName: string) {
    return this.charService.setCharacter(req.user.mbId, charName);
  }

  @Delete('/delCharacter')
  @Throttle(5000, 3600)
  @UseGuards(AuthGuard('jwt'))
  public async delCharacter(@Request() req, @Query('charName') charName: string) {
    return this.charService.delCharacter(req.user.mbId, charName);
  }
}
