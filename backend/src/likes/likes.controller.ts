import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";

import { LikesService } from "./likes.service.js";

@Controller("likes")
export class LikesController {
  constructor(
    private readonly likesService: LikesService,
  ) {}

  @UseGuards(AuthGuard("jwt"))
  @Post(":postId")
  async likePost(
    @Req() req,
    @Param("postId", ParseIntPipe)
    postId: number,
  ) {
    return this.likesService.likePost(
      req.user.id,
      postId,
    );
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":postId")
  async unlikePost(
    @Req() req,
    @Param("postId", ParseIntPipe)
    postId: number,
  ) {
    return this.likesService.unlikePost(
      req.user.id,
      postId,
    );
  }
}