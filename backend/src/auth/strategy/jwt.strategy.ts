import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JWT_ACCESS_TOKEN_SECRET } from 'src/config/config';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { MemberRepository } from 'src/repository/member.repository';

// 액세스 토큰 유효성 검사 전략(auth header에서 추출된 값)
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly memberRepository: MemberRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Request로부터 JWT토큰을 추출한다. 표준은 Request의 헤더인 Authorization header에서 bearer token을 사용하는것이다.
      ignoreExpiration: false,
      secretOrKey: JWT_ACCESS_TOKEN_SECRET,
    });
  }
  // jWt-strategy를 사용할때, passport는 JWT Sign을 json으로 디코드한다. 그리고 여기서 validate()를 call한다.
  // 이전에 서명한 사용자가 유효한지 검증한다. 이 다음 validate()의 return으로 정보들이 들어있는 객체를 Request.user객체에 리턴한다.
  // 검증은 passport에서 하고, jwt 서명은 authservice에서 한다.
  // payload에는 token에 주입한 mbId, mb_nick값이 json 형식으로 디코드 되어있다.
  // express jwt.verify의 기능과 비슷한 역할을 간단하게 어노테이션을 통하여 실행시켜준다.
  async validate(payload: any) {
    try {
      return await this.memberRepository.findOne({
        where: { mbId: payload.mbId },
      });
    } catch (e) {
      this.logger.debug(e);
      throw new BadRequestException({
        message: '유효하지 않은 토큰입니다.',
      });
    }
  }
}
