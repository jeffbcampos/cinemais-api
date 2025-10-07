import { ApiProperty } from "@nestjs/swagger";

export class Media {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    releaseYear: number;

    @ApiProperty()
    genre: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
    
    @ApiProperty()
    deletedAt: Date | null;
}