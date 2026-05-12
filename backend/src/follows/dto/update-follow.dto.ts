import { PartialType } from '@nestjs/mapped-types';
import { CreateFollowDto } from './create-follow.dto.js';
export class UpdateFollowDto extends PartialType(CreateFollowDto) {}
