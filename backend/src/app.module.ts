import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { PostModule } from './post/post.module.js';
import { FollowsModule } from './follows/follows.module.js';
import { CommentModule } from './comment/comment.module.js';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, PostModule, FollowsModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
