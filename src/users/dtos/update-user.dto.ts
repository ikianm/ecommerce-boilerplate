import { IsEmail, IsString, MinLength, MaxLength, IsStrongPassword, IsOptional, IsEnum } from "class-validator";
import { UserRole } from "../../common/enums/userRole.enum";

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