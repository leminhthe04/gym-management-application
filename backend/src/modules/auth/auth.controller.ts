import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import express from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { CurrentAdmin } from 'src/common/decorators/current-admin.decorator';
import type { Admin } from '@prisma/client';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('signup')
  async signUp(@Body() body: any) {
    return await this.authService.signUp(body);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() body: any, 
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax', // Localhost nên để lax
      maxAge: Number(this.config.get('REFRESH_TOKEN_TTL')),
    });

    return { accessToken };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: express.Request) {
    const refreshToken = req.cookies['refreshToken'];
    return await this.authService.refreshToken(refreshToken);
  }

  @Post('signout')
  @HttpCode(HttpStatus.NO_CONTENT) // 204
  async signOut(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    await this.authService.signOut(refreshToken);

    res.clearCookie('refreshToken');
    return;
  }

  @UseGuards(AuthGuard('jwt')) // Kích hoạt Strategy
  @Get('me')
  async authMe(@CurrentAdmin() admin: Admin) {
    // console.log(admin.username);
    return admin;
  }

  @UseGuards(AuthGuard('jwt')) // Kích hoạt Strategy
  @Get('test')
  async test() {
    return { message: "Testing..." };
  }

  
}
