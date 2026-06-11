import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

    users:{id:number, email: string, gender: string, isMarried: boolean}[]=
    [{id:1, email:'jeo@gmail.com',gender:'male',isMarried:false},
     {id:2, email:'john@gmail.com',gender:'male',isMarried:false}
    ]

    getAllUsers(){
        return this.users
    }

    createUser(user:any){
        this.users.push(user)
        return user;
    }

    updateUser(user:any){
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

    getUser(userId:number){
        return this.users.find(u=>u.id===userId)
    }

    removeUser(userId:number){
        const index = this.users.findIndex(user => user.id === userId);
        if (index > -1) {
            this.users.splice(index, 1);
        }
        return index
    }
}
