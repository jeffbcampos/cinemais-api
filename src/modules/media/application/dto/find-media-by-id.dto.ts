import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class FindMediaByIdDto {
    @IsUUID()
    @ApiProperty({ example: 'a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14' })
    id: string;
}