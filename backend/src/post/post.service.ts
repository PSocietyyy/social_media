import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';

const feedPostInclude = {
  media: true,

  hashtags: {
    include: {
      hashtag: true,
    },
  },

  author: {
    select: {
      id: true,
      name: true,
      username: true,
      avatar: true,
      isVerified: true,
    },
  },

  comments: {
    take: 2,

    orderBy: {
      createdAt: 'desc' as const,
    },

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
    select: {
      likes: true,
      comments: true,
    },
  },
};

const detailPostInclude = {
  media: true,

  hashtags: {
    include: {
      hashtag: true,
    },
  },

  author: {
    select: {
      id: true,
      name: true,
      username: true,
      avatar: true,
      isVerified: true,
    },
  },

  comments: {
    take: 20,

    orderBy: {
      createdAt: 'desc' as const,
    },

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
    select: {
      likes: true,
      comments: true,
    },
  },
};

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    authorId: number,
    createPostDto: CreatePostDto,
  ) {
    const { content, media, hashtags } =
      createPostDto;

    if (!content && (!media || media.length === 0)) {
      throw new BadRequestException(
        'Post must have content or media',
      );
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
                    where: {
                      name: tag.toLowerCase(),
                    },

                    create: {
                      name: tag.toLowerCase(),
                    },
                  },
                },
              })),
            }
          : undefined,
      },

      include: detailPostInclude,
    });
  }

  async findAll(cursor?: number, limit = 10) {
    const posts = await this.prisma.post.findMany({
      take: limit,

      ...(cursor && {
        skip: 1,

        cursor: {
          id: cursor,
        },
      }),

      where: {
        isDeleted: false,
        isShadowBanned: false,
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: feedPostInclude,
    });

    const nextCursor =
      posts.length === limit
        ? posts[posts.length - 1].id
        : null;

    return {
      data: posts,

      meta: {
        nextCursor,
        hasMore: posts.length === limit,
      },
    };
  }

  // FYP FEED
  async findForYou(
    userId: number,
    cursor?: number,
    limit = 10,
  ) {
    const posts = await this.prisma.post.findMany({
      take: limit,

      ...(cursor && {
        skip: 1,

        cursor: {
          id: cursor,
        },
      }),

      where: {
        isDeleted: false,
        isShadowBanned: false,
      },

      orderBy: [
        {
          finalScore: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],

      include: feedPostInclude,
    });

    const nextCursor =
      posts.length === limit
        ? posts[posts.length - 1].id
        : null;

    return {
      data: posts,

      meta: {
        nextCursor,
        hasMore: posts.length === limit,
      },
    };
  }

  // FOLLOWING FEED
  async findFollowing(
    userId: number,
    cursor?: number,
    limit = 10,
  ) {
    const following =
      await this.prisma.follow.findMany({
        where: {
          followerId: userId,
        },

        select: {
          followingId: true,
        },
      });

    const followingIds = following.map(
      (f) => f.followingId,
    );

    const posts = await this.prisma.post.findMany({
      take: limit,

      ...(cursor && {
        skip: 1,

        cursor: {
          id: cursor,
        },
      }),

      where: {
        authorId: {
          in: followingIds,
        },

        isDeleted: false,
        isShadowBanned: false,
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: feedPostInclude,
    });

    const nextCursor =
      posts.length === limit
        ? posts[posts.length - 1].id
        : null;

    return {
      data: posts,

      meta: {
        nextCursor,
        hasMore: posts.length === limit,
      },
    };
  }

  // TRENDING FEED
  async findTrending(
    cursor?: number,
    limit = 10,
  ) {
    const last24Hours = new Date(
      Date.now() - 24 * 60 * 60 * 1000,
    );

    const posts = await this.prisma.post.findMany({
      take: limit,

      ...(cursor && {
        skip: 1,

        cursor: {
          id: cursor,
        },
      }),

      where: {
        createdAt: {
          gte: last24Hours,
        },

        isDeleted: false,
        isShadowBanned: false,
      },

      orderBy: [
        {
          viewCount: 'desc',
        },
        {
          likeCount: 'desc',
        },
      ],

      include: feedPostInclude,
    });

    const nextCursor =
      posts.length === limit
        ? posts[posts.length - 1].id
        : null;

    return {
      data: posts,

      meta: {
        nextCursor,
        hasMore: posts.length === limit,
      },
    };
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },

      include: detailPostInclude,
    });

    if (!post) {
      throw new NotFoundException(
        `Post #${id} not found`,
      );
    }

    await this.prisma.post.update({
      where: { id },

      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return post;
  }

  async update(
    id: number,
    authorId: number,
    updatePostDto: UpdatePostDto,
  ) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(
        `Post #${id} not found`,
      );
    }

    if (post.authorId !== authorId) {
      throw new BadRequestException(
        'You can only update your own post',
      );
    }

    const { content, media, hashtags } =
      updatePostDto;

    return this.prisma.post.update({
      where: { id },

      data: {
        content,

        ...(media !== undefined && {
          media: {
            deleteMany: {},

            create: media.map((m) => ({
              url: m.url,
              type: m.type,
            })),
          },
        }),

        ...(hashtags !== undefined && {
          hashtags: {
            deleteMany: {},

            create: hashtags.map((tag) => ({
              hashtag: {
                connectOrCreate: {
                  where: {
                    name: tag.toLowerCase(),
                  },

                  create: {
                    name: tag.toLowerCase(),
                  },
                },
              },
            })),
          },
        }),
      },

      include: detailPostInclude,
    });
  }

  async remove(id: number, authorId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(
        `Post #${id} not found`,
      );
    }

    if (post.authorId !== authorId) {
      throw new BadRequestException(
        'You can only delete your own post',
      );
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return {
      message: `Post #${id} deleted successfully`,
    };
  }
}

