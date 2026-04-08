import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorId: number, createPostDto: CreatePostDto) {
    const { content, media, hashtags } = createPostDto;

    if (!content && (!media || media.length === 0)) {
      throw new BadRequestException('Post must have content or media');
    }

    return this.prisma.post.create({
      data: {
        content,
        authorId,
        media: media?.length
          ? {
              create: media.map((m) => ({
                url: m.url,
                type: m.type,
              })),
            }
          : undefined,
        hashtags: hashtags?.length
          ? {
              create: hashtags.map((tag) => ({
                hashtag: {
                  connectOrCreate: {
                    where: { name: tag.toLowerCase() },
                    create: { name: tag.toLowerCase() },
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        media: true,
        hashtags: {
          include: { hashtag: true },
        },
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          media: true,
          hashtags: { include: { hashtag: true } },
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: { likes: true, comments: true },
          },
        },
      }),
      this.prisma.post.count(),
    ]);

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        media: true,
        hashtags: { include: { hashtag: true } },
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
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
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    return post;
  }

  async update(id: number, authorId: number, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    if (post.authorId !== authorId) {
      throw new BadRequestException('You can only update your own post');
    }

    const { content, media, hashtags } = updatePostDto;

    return this.prisma.post.update({
      where: { id },
      data: {
        content,
        // replace media jika dikirim
        ...(media !== undefined && {
          media: {
            deleteMany: {},
            create: media.map((m) => ({ url: m.url, type: m.type })),
          },
        }),
        // replace hashtags jika dikirim
        ...(hashtags !== undefined && {
          hashtags: {
            deleteMany: {},
            create: hashtags.map((tag) => ({
              hashtag: {
                connectOrCreate: {
                  where: { name: tag.toLowerCase() },
                  create: { name: tag.toLowerCase() },
                },
              },
            })),
          },
        }),
      },
      include: {
        media: true,
        hashtags: { include: { hashtag: true } },
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });
  }

  async remove(id: number, authorId: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    if (post.authorId !== authorId) {
      throw new BadRequestException('You can only delete your own post');
    }

    await this.prisma.post.delete({ where: { id } });

    return { message: `Post #${id} deleted successfully` };
  }
}