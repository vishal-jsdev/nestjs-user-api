import { IsBoolean, IsEmail, IsNumber, isNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

    @IsEmail()
    email!: string;
    
    @IsString()
    @IsOptional()
    gender?:string;

    @IsBoolean()
    isMarried!: boolean;

}