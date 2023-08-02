import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_REFRESH_TOKEN_SECRET } from 'src/config/config';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AuthService } from '../auth.service';

// 리프래쉬 토큰 유효성 검사 전략(http cookie에서 추출된 토큰 값)
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwtRefresh',
) {
  constructor(
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          console.log(request?.cookies);
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }
  async validate(req, payload: any) {

    try {
      const refreshToken = req.cookies?.Refresh;
      console.log(refreshToken);
      return this.authService.getUserIfRefreshTokenMatches(
        refreshToken,
        payload.mb_id,
      );
    } catch (e) {
      this.logger.debug(e);
      throw new BadRequestException({
        message: '유효하지 않은 토큰입니다.',
      });
    }
  }
}
