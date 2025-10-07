import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class CreateFavoriteMediaDto {
  
  @ApiProperty({ example: 'media-id-123' })
  @IsUUID()
  mediaId: string;
}
