import { IsUUID } from "class-validator";

export class FindMediaByIdDto {
    @IsUUID()
    id: string;
}