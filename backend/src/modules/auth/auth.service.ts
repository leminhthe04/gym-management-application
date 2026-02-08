import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUp(data: { username: string; password: string }): Promise<any> {
    const exists = await this.prisma.admin.findUnique({
      where: { username: data.username },
    });

    if (exists) throw new BadRequestException('Username existed');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await this.prisma.admin.create({
      data: { username: data.username, hashedPassword: hashedPassword },
    });

    return { message: 'Register successfully' };
  }

  async signIn(data: { username: string; password: string }) {
    const admin = await this.prisma.admin.findUnique({
      where: { username: data.username },
    });
    if (!admin) throw new UnauthorizedException('Username does not exist');

    const passwordMatch = await bcrypt.compare(
      data.password,
      admin.hashedPassword,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const accessToken = await this.signTokens(admin.id);

    const refreshToken = this.createRefreshToken();
    const refreshTokenExpiresAt = new Date(
      Date.now() + Number(this.config.get('REFRESH_TOKEN_TTL')),
    );

    // console.log(refreshToken);

    await this.prisma.session.create({
      data: {
        token: refreshToken,
        expiresAt: refreshTokenExpiresAt,
        adminId: admin.id,
      },
    });

    return { accessToken, refreshToken };
  }

  async signTokens(userId: number) {
    const payload = { id: userId };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.config.get('ACCESS_TOKEN_TTL'),
    });

    return accessToken;
  }

  createRefreshToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken)
      throw new UnauthorizedException('No refresh token provided');
    const session = await this.prisma.session.findUnique({
      where: { token: refreshToken },
      include: { admin: true }, // Join with Admin table to get more info
    });

    if (!session) throw new ForbiddenException('Invalid refresh token');

    // Check hết hạn
    if (new Date() > session.expiresAt) {
      throw new ForbiddenException('Refresh token has expired');
    }

    // Tạo Access Token mới
    const newAccessToken = await this.signTokens(
      session.adminId
    );

    return { accessToken: newAccessToken };
  }

  async signOut(refreshToken: string) {
    if (!refreshToken) return;
    try {
      await this.prisma.session.delete({
        where: { token: refreshToken },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return; // no session to delete, it's ok
      }
      // other error
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async cleanupExpiredSessions() {
    this.logger.debug('Scanning and deleting expired sessions...');

    const result = await this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    this.logger.debug(`Deleted ${result.count} expired sessions.`);
  }
}
