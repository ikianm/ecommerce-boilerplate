import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(2)
    @MaxLength(20)
    name: string;

    @IsStrongPassword()
    password: string;

}