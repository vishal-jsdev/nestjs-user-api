import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString({ message: 'First Name should be a string value' })
  @IsNotEmpty()
  @MinLength(3, {
    message: 'First Name should have a minimum of 3 characters.',
  })
  @ApiProperty({
    description: 'First Name of the user',
    example: 'Joe',
  })
  firstName: string;

  @IsString({ message: 'Last Name should be a string value' })
  @IsNotEmpty()
  @MinLength(3, { message: 'Last Name should have a minimum of 3 characters.' })
  @ApiProperty({
    description: 'Last Name of the user',
    example: 'Doe',
  })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email ID of the user',
    example: 'joedoe@gmail.com',
  })
  email!: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The gender of the user',
    example: 'Male',
  })
  gender?: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Status of the married',
    example: true,
  })
  isMarried!: boolean;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    description: 'The password of the user',
    example: 'testing28',
  })
  password: string;
}
