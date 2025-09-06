import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
    @IsNotEmpty()
    title: string;

    @IsOptional() @IsString()
    body?: string;
}
