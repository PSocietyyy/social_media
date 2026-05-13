import { PartialType } from '@nestjs/mapped-types';
import { CreateLikeDto } from './create-like.dto.js';

export class UpdateLikeDto extends PartialType(CreateLikeDto) {}
