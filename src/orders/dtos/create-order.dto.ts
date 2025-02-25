import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class CreateOrderDto {

    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(80)
    address?: string;

}