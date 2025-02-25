import { IsEmail, IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(2)
    @MaxLength(20)
    name: string;

    @IsString()
    @MinLength(8)
    @MaxLength(25)
    password: string;

    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(80)
    address?: string;

}