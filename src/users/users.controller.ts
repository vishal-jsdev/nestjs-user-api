import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dtos/user-response.dto';
import { PageQueryDto } from './dtos/page-query.dto';
import { AuthorizeGuard } from 'src/auth/guards/authorize.guard';

@Controller('users')
 @UseGuards(AuthorizeGuard)
export class UsersController {
    constructor(private readonly userService: UsersService){}

   
    @Get()
    getAllUsers(@Query()pageQueryDto:PageQueryDto): UserResponseDto[]{
        const users =  this.userService.getAllUsers(pageQueryDto)
        return plainToInstance(UserResponseDto, users)
    }

    @Post()
    createUser(@Body()user:CreateUserDto): UserResponseDto{
        const userData = this.userService.createUser(user)
        return plainToInstance(UserResponseDto,userData);
    }

    @Patch(":id")
    updateUser(
            @Param('id', ParseIntPipe) id:number,
        @Body() user:UpdateUserDto): UserResponseDto {
        const userData =  this.userService.updateUser(user, id)
        return plainToInstance(UserResponseDto, userData)
    }

    @Get(':id')
    getUser(@Param('id', ParseIntPipe)id:number): UserResponseDto{
        const user =  this.userService.getUser(id)
        return plainToInstance(UserResponseDto, user)
    }

    @Delete(':id')
    removeUser(@Param('id', ParseIntPipe)id:number){
        const user = this.userService.removeUser(id);
        return plainToInstance(UserResponseDto, user);
    }
}
