import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dtos/user-response.dto';
import { PageQueryDto } from './dtos/page-query.dto';
import { AuthorizeGuard } from 'src/auth/guards/authorize.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/constant/auth.constant';

@Controller('users')
// @UseGuards(AuthorizeGuard)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Roles(Role.User, Role.Admin)
  getAllUsers(@Query() pageQueryDto: PageQueryDto): UserResponseDto[] {
    const users = this.userService.getAllUsers(pageQueryDto);
    return plainToInstance(UserResponseDto, users);
  }

  @Post()
  @Roles(Role.User, Role.Admin)
  createUser(@Body() user: CreateUserDto): UserResponseDto {
    const userData = this.userService.createUser(user);
    return plainToInstance(UserResponseDto, userData);
  }

  @Patch(':id')
  @Roles(Role.User, Role.Admin)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): UserResponseDto {
    const userData = this.userService.updateUser(user, id);
    return plainToInstance(UserResponseDto, userData);
  }

  @Get(':id')
  @Roles(Role.User, Role.Admin)
  getUser(@Param('id', ParseIntPipe) id: number): UserResponseDto {
    const user = this.userService.getUser(id);
    return plainToInstance(UserResponseDto, user);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  removeUser(@Param('id', ParseIntPipe) id: number) {
    const user = this.userService.removeUser(id);
    return plainToInstance(UserResponseDto, user);
  }
}
