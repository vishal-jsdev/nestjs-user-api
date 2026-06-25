import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { HashingProvider } from './provider/hashing.provider';
import type { ConfigType } from '@nestjs/config';
import authConfig from './config/auth.config';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from 'src/users/dtos/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly hashingProvider: HashingProvider,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService,
  ) {}
  async signup(signupDto: SignupDto): Promise<UserResponseDto> {
    const user = await this.userService.signup(signupDto);
    return user;
  }

  public async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.findUserByEmail(loginDto.email);

    const isEqual = await this.hashingProvider.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const { token, refreshToken } = await this.generateToken(user);
    user.refreshToken = refreshToken;
    await this.userService.updatedUser(user);
    return { token, refreshToken };
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.authConfiguration.secret,
        expiresIn: expiresIn,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      },
    );
  }

  private async generateToken(user: User) {
    const accessToken = await this.signToken(
      user.id,
      this.authConfiguration.expiresIn,
      { email: user.email, roles: user.role },
    );

    const refreshToken = await this.signToken(
      user.id,
      this.authConfiguration.refreshTokenExpiresIn,
      { roles: user.role },
    );
    return {
      token: accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.authConfiguration.secret,
          audience: this.authConfiguration.audience,
          issuer: this.authConfiguration.issuer,
        },
      );

      const user = await this.userService.findUserById(sub);
      return await this.generateToken(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
