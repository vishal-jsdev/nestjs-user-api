import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from 'src/users/dtos/user-response.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AllowAnonymous } from './decorators/allow-anonymous.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}
    
    @AllowAnonymous()
    @Post('register')
    public async signup(@Body() signupDto: SignupDto){
        let user =  await this.authService.signup(signupDto)
        return plainToInstance(UserResponseDto, user);
    }

    @AllowAnonymous()
    @Post('login')
    public async login(@Body() loginDto: LoginDto){
        let loginResponse = await this.authService.login(loginDto)
        return plainToInstance(LoginResponseDto,loginResponse)
    }
}
