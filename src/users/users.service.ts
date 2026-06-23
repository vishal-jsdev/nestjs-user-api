import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { PageQueryDto } from './dtos/page-query.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/provider/hashing.provider';
import { LoginDto } from 'src/auth/dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    private readonly configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: signupDto.email,
    });
    if (existingUser) {
      throw new BadRequestException('email is already exists!');
    }
    const user = this.userRepository.create({
      ...signupDto,
      password: await this.hashingProvider.hashPassword(signupDto.password),
    });
    const userData = await this.userRepository.save(user);
    return userData;
  }

  async findUserByEmail(email: string): Promise<User> {
    let user;
    try {
      user = await this.userRepository.findOneBy({ email });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'User with given email could not be found!',
      });
    }
    if (!user) {
      throw new UnauthorizedException('User does not exist!');
    }

    return user as User;
  }

  users: { id: number; email: string; gender: string; isMarried: boolean }[] = [
    { id: 1, email: 'jeo@gmail.com', gender: 'male', isMarried: false },
    { id: 2, email: 'john@gmail.com', gender: 'male', isMarried: false },
  ];

  getAllUsers(pageQueryDto: PageQueryDto): UserResponseDto[] {
    const evnvironment = this.configService.get('ENV_MODE');
    console.log(evnvironment);
    const skip = (pageQueryDto.page - 1) * pageQueryDto.limit;
    return this.users.slice(skip, skip + pageQueryDto.limit);
  }

  createUser(user: CreateUserDto): UserResponseDto {
    const newUser = {
      id: this.users.length + 1,
      email: user.email,
      gender: user.gender ?? 'unspecified',
      isMarried: user.isMarried ?? false,
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(user: UpdateUserDto, id: number): UserResponseDto {
    const userToUpdate = this.users.find((u) => u.id === id);
    if (!userToUpdate) {
      throw new Error(`User with ID ${id} not found`);
    }
    if (user.email) {
      userToUpdate.email = user.email;
    }
    if (user.gender) {
      userToUpdate.gender = user.gender;
    }
    if (user.isMarried) {
      userToUpdate.isMarried = user.isMarried;
    }
    const userData = this.users.find((u) => u.id === id);
    if (!userData) {
      throw new NotFoundException('User is not found');
    }
    return userData;
  }

  getUser(userId: number): UserResponseDto {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      throw new NotFoundException('User is not found!');
    }
    return user;
  }

  removeUser(userId: number): UserResponseDto {
    const index = this.users.findIndex((user) => user.id === userId);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const [deletedUser] = this.users.splice(index, 1);
    return deletedUser;
  }

  private getNextId(): number {
    return this.users.length > 0
      ? Math.max(...this.users.map((user) => user.id)) + 1
      : 1;
  }
}
