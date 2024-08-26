import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-use.dto';
@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>){}

    async create(email : string , password: string){
        const checkExitEmail = await this.userRepository.findOneBy({email})
        if(checkExitEmail) throw new BadRequestException('Email user is exist')
        const user = await this.userRepository.create({email,password})
        return await this.userRepository.save(user)
    }
    async findOne(id:number){
        if(!id) return null;
        return await this.userRepository.findOneBy({id})  
    }

    async find(email:string){
        return await this.userRepository.find({where: {email}})
    }

    async findAll(){
        return await this.userRepository.find()
    }

    async update(id : number, attrs: Partial<User>){
        const user = await this.findOne(id)
        if(!user) throw new NotFoundException('User not found')
        return this.userRepository.save(user) 
    }

    async remove(id:number){
        const user = await this.findOne(id)
        if(!user) throw new NotFoundException('User not found')
        return this.userRepository.remove(user)

    }
}
