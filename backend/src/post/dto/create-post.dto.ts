import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export class CreateMediaDto {
  @IsUrl()
  url: string;

  @IsEnum(MediaType)
  type: MediaType;
}

export class CreatePostDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMediaDto)
  media?: CreateMediaDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];
}