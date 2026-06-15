import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { CreateResponseUserDto } from './dtos/create-response-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @Get()
    getAllUsers(){
        const users =  this.userService.getAllUsers()
        return plainToInstance(CreateResponseUserDto, users)
    }

    @Post()
    createUser(@Body()user:CreateUserDto){
        const userData = this.userService.createUser(user)
        return plainToInstance(CreateResponseUserDto,userData);
    }

    @Patch()
    updateUser(@Body() user:UpdateUserDto){
        const userData =  this.userService.updateUser(user)
        return plainToInstance(CreateResponseUserDto, userData)
    }

    @Get(':id')
    getUser(@Param('id', ParseIntPipe)id:number){
        const user =  this.userService.getUser(id)
        return plainToInstance(CreateResponseUserDto, user)
    }

    @Delete(':id')
    removeUser(@Param('id', ParseIntPipe)id:number){
        const user = this.userService.removeUser(id);
        return plainToInstance(CreateResponseUserDto, user);
    }
}
