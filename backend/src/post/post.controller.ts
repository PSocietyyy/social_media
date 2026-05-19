import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { PostService } from './post.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { User } from '../auth/decorators/user.decorator.js';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@User() user: JwtPayload, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(user.sub, createPostDto);
  }

  // LATEST FEED
  @Get()
  findAll(
    @Query('cursor') cursor?: string,

    @Query('limit', new ParseIntPipe({ optional: true }))
    limit = 10,
  ) {
    return this.postService.findAll(cursor ? Number(cursor) : undefined, limit);
  }

  // FYP FEED
  @Get('fyp')
  findForYou(
    @User() user: JwtPayload,

    @Query('cursor') cursor?: string,

    @Query('limit', new ParseIntPipe({ optional: true }))
    limit = 10,
  ) {
    return this.postService.findForYou(
      user.sub,
      cursor ? Number(cursor) : undefined,
      limit,
    );
  }

  // FOLLOWING FEED
  @Get('following')
  findFollowing(
    @User() user: JwtPayload,

    @Query('cursor') cursor?: string,

    @Query('limit', new ParseIntPipe({ optional: true }))
    limit = 10,
  ) {
    return this.postService.findFollowing(
      user.sub,
      cursor ? Number(cursor) : undefined,
      limit,
    );
  }

  // TRENDING FEED
  @Get('trending')
  findTrending(
    @Query('cursor') cursor?: string,

    @Query('limit', new ParseIntPipe({ optional: true }))
    limit = 10,
  ) {
    return this.postService.findTrending(
      cursor ? Number(cursor) : undefined,
      limit,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @User() user: JwtPayload,

    @Body()
    updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, user.sub, updatePostDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe)
    id: number,

    @User() user: JwtPayload,
  ) {
    return this.postService.remove(id, user.sub);
  }
}
