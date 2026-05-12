import {
  Controller,
  Post,
  Delete,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator/current-user.decorator.js';
import { FollowsService } from './follows.service.js';

@Controller('follows')
@UseGuards(JwtAuthGuard)
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':id')
  follow(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.followsService.followUser(
      user.sub,
      +id,
    );
  }

  @Delete(':id')
  unfollow(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.followsService.unfollowUser(
      user.sub,
      +id,
    );
  }

  @Get('followers/:id')
  getFollowers(@Param('id') id: string) {
    return this.followsService.getFollowers(+id);
  }

  @Get('following/:id')
  getFollowing(@Param('id') id: string) {
    return this.followsService.getFollowing(+id);
  }
}