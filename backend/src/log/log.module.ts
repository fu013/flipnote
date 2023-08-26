import { Module } from '@nestjs/common';
import { LogGateway } from './log.gateway';
import { AuthService } from 'src/auth/auth.service'; // AuthService를 import
import { MemberRepository } from 'src/repository/member.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/entity/member.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // 모듈에서 사용할 Entity 설정
      Member,
    ]),
    JwtModule.register({}),
  ],
  providers: [
    LogGateway, // JWT 리프래쉬 토큰 유효성 검사
    AuthService,
    MemberRepository,
  ],
})
export class LogModule { }
