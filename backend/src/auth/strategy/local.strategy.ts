import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import _ from 'lodash';

/* 로그인 유효성 검사 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    // !주의! 변수명을 username 과 password 등과 같이 정해진 규칙에 맞게 네이밍 하지 않는다면, 에러가 발생한다.
    super({
      usernameField: 'mb_id',
      passwordField: 'mb_pw',
      passReqToCallback: false,
    });
  }
  // 아이디, 비밀번호에 대한 유효성 검사
  async validate(mb_id: string, mb_pw: string): Promise<any> {
    try {
      return await this.authService.validateMember(mb_id, mb_pw);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
