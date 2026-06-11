import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @Get()
    getAllUsers(){
        return this.userService.getAllUsers()
    }

    @Post()
    createUser(@Body()user:CreateUserDto){
        return this.userService.createUser(user)
    }

    @Patch()
    updateUser(@Body() user:UpdateUserDto){
        return this.userService.updateUser(user)
    }

    @Get(':id')
    getUser(@Param('id', ParseIntPipe)id:number){
        return this.userService.getUser(id)
    }

    @Delete(':id')
    removeUser(@Param('id', ParseIntPipe)id:number){
        return this.userService.removeUser(id)
    }
}
