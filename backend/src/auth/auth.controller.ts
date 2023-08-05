import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Request,
  Res,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) { }

  // 토큰 인증 확인
  @Get('/jwt')
  @UseGuards(AuthGuard('jwt'))
  authProfile(@Request() req) {
    return req.user;
  }

  // 로그인 요청
  @Post('/login')
  @UseGuards(AuthGuard('local'))
  public async login(@Request() req, @Res({ passthrough: true }) res) {
    return await this.AuthService.login(req, res);
  }

  // 로그아웃 요청
  @Post('/logout')
  public async logout(@Body('mbId') mbId: string, @Res() res) {
    return await this.AuthService.logout(mbId, res);
  }

  // 액세스 토큰 갱신 요청
  @Post('/refresh')
  @UseGuards(AuthGuard('jwtRefresh'))
  public refresh(@Req() req, @Res({ passthrough: true }) res) {
    try {
      return Object.assign({
        statusCode: 201,
        success: true,
        message: '리프래쉬 토큰 인증 성공, 액세스 토큰 반환',
        token: this.AuthService.makeAccessToken(req.user).accessToken,
      });
    } catch (error) {
      this.AuthService.logout(req.user.mbId, res);
      console.log(error);
    }
  }
}
