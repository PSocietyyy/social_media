import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CommentService } from './comment.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { User } from '../auth/decorators/user.decorator.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Controller()
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('posts/:postId/comments')
  create(
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: JwtPayload,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.create(postId, user.sub, dto);
  }

  @Get('posts/:postId/comments')
  findAll(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentService.findAll(postId);
  }

  @Patch('comments/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @User() user: JwtPayload,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.update(id, user.sub, dto);
  }

  @Delete('comments/:id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: JwtPayload,
  ) {
    return this.commentService.remove(id, user.sub);
  }
}