import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MemberRepository } from '../repository/member.repository';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshStrategy } from './strategy/jwtRefresh.strategy';
import Member from 'src/entity/member.entity';

@Module({ // import해주면 Service나 Controller 단에서 MemberRepository를 생성자의 파라미터로 받아 사용가능
    imports: [ // Member Entity를 조작하기 위해 만들어둔 래퍼지토리를 서비스에 주입하기 위하여, 임포트에 작성하여 서비스쪽으로 injection함
        TypeOrmModule.forFeature([ // 데이터베이스 모델 라이브러리
            Member,
        ]),
        PassportModule, // 로그인인증모듈
        JwtModule.register({}), // JWT 토큰모듈
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy, // 로그인유효성전략
        JwtStrategy, // 액세스토큰인증전략
        JwtRefreshStrategy, // 리프레쉬토큰인증전략
        MemberRepository,
    ],
})
export class AuthModule { }
