import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterAuthDto } from './dto/register-auth.dto.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async findAllUsers() {
    return this.prisma.user.findMany();
  }

  async login(data: LoginAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) throw new UnauthorizedException('Email tidak ditemukan');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Password salah');

    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    // Pakai secret berbeda untuk refresh token → lebih aman
    const refreshToken = this.jwtService.sign(payload, {
      secret: 'refreshSecretKey',
      expiresIn: '7d',
    });

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refresh(token: string) {
    // Cek token ada di DB
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!stored) throw new UnauthorizedException('Refresh token tidak valid');
    if (stored.expiresAt < new Date()) {
      // Hapus token expired dari DB
      await this.prisma.refreshToken.delete({ where: { token } });
      throw new UnauthorizedException('Refresh token sudah expired');
    }

    // Verifikasi JWT-nya
    let payload: any;
    try {
      payload = this.jwtService.verify(token, { secret: 'refreshSecretKey' });
    } catch {
      throw new UnauthorizedException('Refresh token tidak valid');
    }

    const newPayload = { sub: payload.sub, email: payload.email, role: payload.role };
    const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });

    // hapus token lama, buat token baru
    const newRefreshToken = this.jwtService.sign(newPayload, {
      secret: 'refreshSecretKey',
      expiresIn: '7d',
    });

    await this.prisma.refreshToken.delete({ where: { token } });
    await this.prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: payload.sub,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { access_token: newAccessToken, refresh_token: newRefreshToken };
  }

  async logout(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!stored) throw new UnauthorizedException('Refresh token tidak valid');

    await this.prisma.refreshToken.delete({ where: { token } });

    return { message: 'Logout berhasil' };
  }

  async register(data: RegisterAuthDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { username: data.username }] },
    });

    if (existingUser) throw new BadRequestException('Email atau username sudah digunakan');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        password: hashedPassword,
      },
    });

    const { password, ...result } = user;
    return result;
  }
}