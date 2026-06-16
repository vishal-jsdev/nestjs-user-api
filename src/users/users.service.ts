import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {

    users:{id:number, email: string, gender: string, isMarried: boolean}[]=
    [{id:1, email:'jeo@gmail.com',gender:'male',isMarried:false},
     {id:2, email:'john@gmail.com',gender:'male',isMarried:false}
    ]

    getAllUsers():UserResponseDto[]|undefined{
        return this.users
    }

    createUser(user:any){
        const newUser = {
            id: this.users.length + 1,
            email: user.email,
            gender: user.gender ?? 'unspecified',
            isMarried: user.isMarried ?? false,
        };
        this.users.push(newUser)
        return newUser;
    }

    updateUser(user:UpdateUserDto):UserResponseDto | undefined{
        this.users.filter(u=>u.id===user.id).forEach(u=>{
            if(user.email){
                u.email=user.email;
            }
            if(user.gender){
                u.gender = user.gender;
            }
            if(user.isMarried){
                u.isMarried = user.isMarried
            }
        })
        return this.users.find(u=>u.id===user.id)
    }

    getUser(userId:number): UserResponseDto | undefined{
        return this.users.find(u=>u.id===userId)
    }

    removeUser(userId:number): UserResponseDto | undefined{
        const index = this.users.findIndex((user) => user.id === userId);
        const deletedUser = this.users[index];
        if (index > -1) {
            this.users.splice(index, 1);
        }
        return deletedUser;
    }
}
