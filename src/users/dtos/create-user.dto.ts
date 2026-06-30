import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'First Name should be a string value' })
  @IsNotEmpty()
  @MinLength(3, {
    message: 'First Name should have a minimum of 3 characters.',
  })
  firstName: string;

  @IsString({ message: 'Last Name should be a string value' })
  @IsNotEmpty()
  @MinLength(3, { message: 'Last Name should have a minimum of 3 characters.' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsBoolean()
  isMarried!: boolean;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
