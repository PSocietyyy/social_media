import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        role: true,

        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });
  }

  async findMe(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },

      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        role: true,
        createdAt: true,

        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },

        posts: {
          orderBy: {
            createdAt: 'desc',
          },

          include: {
            media: true,

            hashtags: {
              include: {
                hashtag: true,
              },
            },

            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },

            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    return user;
  }

  async findOne(id: number, currentUserId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },

      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        avatar: true,
        createdAt: true,

        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },

        posts: {
          orderBy: {
            createdAt: 'desc',
          },

          include: {
            media: true,

            hashtags: {
              include: {
                hashtag: true,
              },
            },

            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },

            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const isFollowing = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: id,
        },
      },
    });

    return {
      ...user,
      isFollowing: !!isFollowing,
    };
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },

      data: dto,

      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        role: true,
      },
    });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: 'User berhasil dihapus',
    };
  }
}