import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty()
    email!: string;
    
    @IsString()
    @IsOptional()
    gender?:string;

    @IsBoolean()
    isMarried!: boolean;

}