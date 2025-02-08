import { IsNumber, IsPositive, IsString, MaxLength, MinLength } from "class-validator";


export class CreateProductDto {

    @IsString()
    @MinLength(3)
    @MaxLength(30)
    name: string;

    @IsString()
    @MinLength(3)
    @MaxLength(200)
    description: string;

    @IsString()
    price: string;

    @IsString()
    stockQuantity: string;


}