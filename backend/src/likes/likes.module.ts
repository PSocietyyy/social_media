import { Module } from "@nestjs/common";

import { LikesController } from "./likes.controller.js";
import { LikesService } from "./likes.service.js";

import { PrismaModule } from "../prisma/prisma.module.js";

@Module({
  imports: [PrismaModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}