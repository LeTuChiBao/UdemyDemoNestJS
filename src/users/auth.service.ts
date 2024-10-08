import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService))  private usersService :UsersService){}

    async signup(email : string , password: string){
        //See if email is in use
        const users = await this.usersService.find(email);
        if(users.length) throw new BadRequestException('Email already in use');
        
        const result = await this.hashPass(password);
        // Create a new user and save it
        const user = await this.usersService.create(email,result)

        //Return the user
        return user
    }

    async hashPass(password:string) {
     //Hash the users password
        //-- Generate a salt
        const salt = randomBytes(8).toString('hex');

        // Hash the salt and the password together
        const hash = (await scrypt(password,salt,32)) as Buffer

        // Jion the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');

        return result;
        
    }

    async signIn(email:string , password:string ){
        const [user] = await this.usersService.find(email);
        if(!user) throw new NotFoundException('User not found');
        const [salt,storeHash] = user.password.split('.');

        console.log('Data Split =>',salt,storeHash)

        const hash = (await scrypt(password,salt,32)) as Buffer

        if(storeHash !== hash.toString('hex')){
            throw new BadRequestException('Password is wrong')
        }
        return user

    }
}