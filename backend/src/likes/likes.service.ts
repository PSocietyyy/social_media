import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class LikesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async likePost(userId: number, postId: number) {
    // cek post ada
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    // cek sudah like belum
    const existingLike =
      await this.prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

    if (existingLike) {
      throw new BadRequestException(
        "Post already liked",
      );
    }

    // create like
    await this.prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    return {
      message: "Post liked",
    };
  }

  async unlikePost(userId: number, postId: number) {
    const existingLike =
      await this.prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

    if (!existingLike) {
      throw new BadRequestException(
        "Post not liked",
      );
    }

    await this.prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return {
      message: "Post unliked",
    };
  }
}