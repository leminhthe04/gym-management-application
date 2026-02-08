import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { 
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      // Lấy token từ Header: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('ACCESS_TOKEN_SECRET')!,
    });
  }

  // Hàm này chạy sau khi token đã verify thành công
  // Kết quả return sẽ được NestJS tự động gán vào: request.user
  async validate(payload: any) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: payload.id },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    } 

    const { hashedPassword, ...adminWithoutPassword } = admin;

    return adminWithoutPassword;
  }
}
