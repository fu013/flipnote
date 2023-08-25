import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWT_ACCESS_TOKEN_SECRET } from 'src/config/config';
import { AuthService } from '../auth.service';

// jWt-strategy를 사용할때, passport는 JWT Sign을 json으로 디코드한다. 그리고 여기서 validate()를 call한다.
// 이전에 서명한 사용자가 유효한지 검증한다. 이 다음 validate()의 return으로 정보들이 들어있는 객체를 Request.user객체에 리턴한다.
// 검증은 passport에서 하고, jwt 서명은 authservice에서 한다.
// payload에는 token에 주입한 mbId, mb_nick값이 json 형식으로 디코드 되어있다.
// express jwt.verify의 기능과 비슷한 역할을 간단하게 어노테이션을 통하여 실행시켜준다.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_ACCESS_TOKEN_SECRET,
    });
  }
  async validate(payload: any) {
    return await this.authService.validateUser(payload.mbId);
  }
}
