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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/constant/auth.constant';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Roles(Role.User, Role.Admin)
  @ApiOperation({
    summary: 'Get paginated list of users',
  })
  @ApiOkResponse({ type: [UserResponseDto], description: 'List of users' })
  getAllUsers(@Query() pageQueryDto: PageQueryDto): UserResponseDto[] {
    const users = this.userService.getAllUsers(pageQueryDto);
    return plainToInstance(UserResponseDto, users);
  }

  @Post()
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Add a new user' })
  @ApiOkResponse({
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  createUser(@Body() user: CreateUserDto): UserResponseDto {
    const userData = this.userService.createUser(user);
    return plainToInstance(UserResponseDto, userData);
  }

  @Patch(':id')
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Update an user' })
  @ApiOkResponse({
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): UserResponseDto {
    const userData = this.userService.updateUser(user, id);
    return plainToInstance(UserResponseDto, userData);
  }

  @Get(':id')
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Get an user' })
  @ApiOkResponse({
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User fetched successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User is not found',
  })
  getUser(@Param('id', ParseIntPipe) id: number): UserResponseDto {
    const user = this.userService.getUser(id);
    return plainToInstance(UserResponseDto, user);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Remove an user' })
  @ApiOkResponse({
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User removed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User is not found',
  })
  removeUser(@Param('id', ParseIntPipe) id: number) {
    const user = this.userService.removeUser(id);
    return plainToInstance(UserResponseDto, user);
  }
}
