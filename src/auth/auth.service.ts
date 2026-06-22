import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { HashingProvider } from './provider/hashing.provider';
import type { ConfigType } from '@nestjs/config';
import authConfig from './config/auth.config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    
    constructor(@Inject(forwardRef(()=>UsersService))
        private readonly userService:UsersService,
    private readonly hashingProvider: HashingProvider,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService
){}
    async signup(signupDto: SignupDto) {
        let user = await this.userService.signup(signupDto)
        return user
    }

    public async login(loginDto: LoginDto) {
        console.log(this.authConfiguration)
        let user = await this.userService.findUserByEmail(loginDto.email)

        let isEqual :boolean = false

        isEqual = await this.hashingProvider.comparePassword(loginDto.password,user.password)
        if(!isEqual){
            throw new UnauthorizedException('Incorrect password')
        }

        const token = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email
        },{
            secret: this.authConfiguration.secret,
            expiresIn: this.authConfiguration.expiresIn,
            audience: this.authConfiguration.audience,
            issuer: this.authConfiguration.issuer
        })
        return {token}
    }
}
