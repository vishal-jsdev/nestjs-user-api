import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../constant/auth.constant';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: string;

  @IsBoolean()
  @IsOptional()
  isMarried?: boolean;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
