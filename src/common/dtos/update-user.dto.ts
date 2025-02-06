import { IsEmail, IsString, MinLength, MaxLength, IsStrongPassword, IsOptional } from "class-validator";

export class UpdateUserDto {

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    name?: string;

    @IsOptional()
    @IsStrongPassword()
    password?: string;

    @IsOptional()
    @IsString()
    refreshToken?: string | null;
    
}