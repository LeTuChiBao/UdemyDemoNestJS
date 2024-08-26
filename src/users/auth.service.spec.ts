import {Test} from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './user.entity'
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { error } from 'console';

describe('AuthService Testing ', ()=> {

    let service: AuthService;
    let fakeUsersService: Partial<UsersService> 
    
    beforeEach(async() => {
        const users: User[] = [];
        fakeUsersService = {
            find: (email:string) => {
                const filteredUser = users.filter((user)=> user.email = email);
                return Promise.resolve(filteredUser)
            },
            create: (email: string, password:string )=> {
                const user = {
                    id: Math.floor(Math.random()* 99999),
                    email,
                    password
                }as User;

                users.push(user);
                return Promise.resolve(user);

            }
        }
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
    
            ]
        }).compile();
    
        service = module.get(AuthService);
    })
    it('can create an instance of auth service ', async ()=> {
        
        expect(service).toBeDefined();
    
    })

    it('creates a new user with a salted and hashed password', async ()=> {
        const user = await service.signup('test@test.com', 'testpassword');
        expect(user.password).not.toEqual('testpassword')
        const [salt, hash]= user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup('test@email.com', 'testpass');
        try {
          await service.signup('test@email.com', 'testpass');
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toBe('Email already in use');
        }
      });

      it('throws if signin is called with an unused email', async () => {
        await service.signup('test@email.com', 'testpass');
        try {
            await service.signIn('wrong@email.com', 'testpass');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException)
            expect(error.message).toBe('User not found')
        }
      });

      it('throws if an invalid password is provided', async () => {
        await service.signup('test@email.com', 'testpass');
        
        try {
            await service.signIn('test@email.com', 'wrongpass');
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
            expect(error.message).toBe('Password is wrong');
        }

      });

      it('returns a User if correct password', async()=> {
        await service.signup('test@email.com', 'correctpass');
        const user = await service.signIn('test@email.com', 'correctpass');
        expect(user).toBeDefined()
      })
})
