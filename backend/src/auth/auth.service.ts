/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Request,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { MemberRepository } from '../repository/member.repository';
import * as Bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  HOST,
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_SECRET,
} from 'src/config/config';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Member } from 'src/entity/member.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  /* JWT 토큰 인증이 완료되면, 로그인 멤버정보 반환 */
  public async getMemberByTokenId(mbId: string) {
    const member = await this.memberRepository.findOne({
      where: { mbId: mbId },
    });
    return member;
  }

  // 최종 로그인 기능: 리프래쉬 토큰 DB저장 및 쿠키(Http)로 응답, 액세스 토큰 발급
  public async login(@Request() req, @Res({ passthrough: true }) res) {
    try {
      const aTokenObj = this.makeAccessToken(req.user);
      const rTokenObj = this.makeRefreshToken(req.user);
      await res.cookie('Refresh', rTokenObj.refreshToken, {
        httpOnly: rTokenObj.httpOnly,
        domain: rTokenObj.domain,
        maxAge: rTokenObj.maxAge,
      });
      await res.cookie('isAccess', '1', {
        domain: rTokenObj.domain,
        maxAge: rTokenObj.maxAge,
      });
      await this.setRefreshTokenDB(rTokenObj.refreshToken, req.user.mbId);
      return Object.assign({
        status: 201,
        statusText: '액세스 토큰이 발급되었습니다.',
        data: {
          token: aTokenObj.accessToken,
        },
      });
    } catch (e) {
      this.logger.debug(e);
      throw e;
    }
  }

  // 로그인 요청 시 토큰 발급전, DB에서 아이디, 비밀번호 일치하는지 유효성 검사
  public async validateMember(mbId: string, mbPw: string) {
    try {
      const member: Member = await this.memberRepository.findOne({
        where: {
          mbId: mbId,
        },
      });
      if (!member) {
        // 아이디가 존재하지 않으면, 회원가입 후 로그인
        const saltOrRounds = 10;
        const new_mbPw = await Bcrypt.hash(mbPw, saltOrRounds);
        const newMember = new Member();
        newMember.mbId = mbId;
        newMember.mbPw = new_mbPw;
        newMember.cntLoginDate = new Date();
        await this.memberRepository.save(newMember);
        return newMember;
      } else {
        const passwordCheck = await Bcrypt.compare(mbPw, member.mbPw);
        if (!passwordCheck) {
          throw new BadRequestException({
            message: '비밀번호가 일치하지 않습니다.',
          });
        } else {
          member.cntLoginDate = new Date();
          await this.memberRepository.save(member);
          const { mbPw, ...result } = member;
          return result;
        }
      }
    } catch (e) {
      this.logger.debug(e);
      throw e;
    }
  }

  // 액세스 토큰 생성
  public makeAccessToken(member: Member) {
    try {
      const payload = { mbId: member.mbId };
      const token = this.jwtService.sign(payload, {
        secret: JWT_ACCESS_TOKEN_SECRET,
        expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME + 's',
      });
      return Object.assign({
        accessToken: token,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  // 리프레쉬 토큰 생성
  private makeRefreshToken(member: any) {
    try {
      const payload = { mbId: member.mbId };
      const token = this.jwtService.sign(payload, {
        secret: JWT_REFRESH_TOKEN_SECRET,
        expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_TIME + 's',
      });
      return Object.assign({
        refreshToken: token,
        domain: HOST,
        httpOnly: true,
        maxAge: Number(JWT_REFRESH_TOKEN_EXPIRATION_TIME) * 1000,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  // 리프래쉬 토큰 DB에 등록
  private async setRefreshTokenDB(refreshToken: string, mbId: string) {
    try {
      const member = await this.memberRepository.findOne({
        where: { mbId: mbId },
      });
      if (!member) {
        throw new UnauthorizedException({
          message: '존재하지 않는 아이디입니다.',
        });
      } else {
        const saltOrRounds = 10;
        member.loginRefreshToken = await Bcrypt.hash(
          refreshToken,
          saltOrRounds,
        );
        await this.memberRepository.save(member);
      }
    } catch (e) {
      this.logger.debug(e);
      throw e;
    }
  }

  // 로그아웃 :: Refresh 토큰 DB 및 헤더 만료시키기
  public async logout(mbId: string, @Res() res) {
    try {
      await this.setNullRefreshToken(mbId);
      await res.cookie('Refresh', '', {
        httpOnly: false,
        maxAge: '0',
      });
      await res.cookie('isAccess', '', {
        maxAge: '0',
      });
      return res.send({
        message: 'logout',
      });
    } catch (e) {
      this.logger.debug(e);
      throw new InternalServerErrorException();
    }
  }

  // 리프래쉬 토큰 유효성 검사 후, 성공시 JWT strategy에 유저 정보 리턴
  public async getUserIfRefreshTokenMatches(rToken: string, mbId: string) {
    try {
      const member = await this.memberRepository.findOne({
        where: { mbId: mbId },
      });
      if (!member) {
        throw new UnauthorizedException({
          message: '존재하지 않는 아이디입니다.',
        });
      } else {
        if (rToken && member.loginRefreshToken) {
          const isRefreshTokenMatching = await Bcrypt.compare(
            rToken,
            member.loginRefreshToken,
          );
          if (isRefreshTokenMatching) {
            return member;
          } else {
            throw new UnauthorizedException(
              '유효하지 않은 리프래쉬 토큰입니다.',
            );
          }
        } else {
          throw new InternalServerErrorException('토큰값이 누락되었습니다.');
        }
      }
    } catch (e) {
      this.logger.debug(e);
      throw e;
    }
  }

  // 리프래쉬 토큰 Null 설정, 로그아웃 처리
  public async setNullRefreshToken(mbId: string) {
    try {
      const member = await this.memberRepository.findOne({
        where: { mbId: mbId },
      });
      if (!member) {
        throw new UnauthorizedException({
          message: '존재하지 않는 아이디입니다.',
        });
      } else {
        member.loginRefreshToken = null;
        return await this.memberRepository.save(member);
      }
    } catch (e) {
      this.logger.debug(e);
      throw e;
    }
  }
}
