import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

enum SortOrderEnum {
    ASC = 'ASC',
    DESC = 'DESC'
}

export class ProductQueryDto {

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit: number = 20;


    @IsOptional()
    @IsString()
    filter: string;

    @IsOptional()
    @IsString()
    sortOrder: SortOrderEnum = SortOrderEnum.DESC;
    
}