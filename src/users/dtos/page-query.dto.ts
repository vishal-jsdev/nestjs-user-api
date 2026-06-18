import { Type } from "class-transformer";
import { isNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";

export class PageQueryDto{
    @IsOptional()
    @IsPositive()
    limit:number
    
    @IsOptional()
    @IsPositive()
    page:number
}