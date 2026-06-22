import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { PageQueryDto } from './dtos/page-query.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {

    users: { id: number, email: string, gender: string, isMarried: boolean }[] =
        [{ id: 1, email: 'jeo@gmail.com', gender: 'male', isMarried: false },
        { id: 2, email: 'john@gmail.com', gender: 'male', isMarried: false }
        ]

    getAllUsers(pageQueryDto: PageQueryDto): UserResponseDto[] {
        const skip = (pageQueryDto.page - 1) * pageQueryDto.limit;
        return this.users.slice(skip, skip + pageQueryDto.limit)
    }

    createUser(user: CreateUserDto): UserResponseDto {
        const newUser = {
            id: this.users.length + 1,
            email: user.email,
            gender: user.gender ?? 'unspecified',
            isMarried: user.isMarried ?? false,
        };
        this.users.push(newUser)
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
        const userData = this.users.find((u) => u.id === id)
        if (!userData) {
            throw new NotFoundException('User is not found')
        }
        return userData;
    }

    getUser(userId: number): UserResponseDto {
        const user = this.users.find(u => u.id === userId)
        if (!user) {
            throw new NotFoundException('User is not found!')
        }
        return user
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
