import { User } from "generated/prisma";


export  type RegisterDTO = Omit<User ,'id'| 'createdAt' >;

export type UserResponseDTO = 
{
    token: string;
    user: Omit<User, 'password'>;

}

export type LoginDTO = {
    email: string;
    password: string;
}