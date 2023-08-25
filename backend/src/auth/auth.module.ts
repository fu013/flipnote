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
import { Member } from 'src/entity/member.entity';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // 모듈에서 사용할 Entity 설정
      Member,
    ]),
    PassportModule, // 로그인 인증을 위한 Passport
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    {
      // 요청 제한 가드
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    LocalStrategy, // 로그인 유효성 검사
    JwtStrategy, // JWT 액세스 토큰 유효성 검사
    JwtRefreshStrategy, // JWT 리프래쉬 토큰 유효성 검사
    AuthService,
    MemberRepository,
  ],
})
export class AuthModule {}
