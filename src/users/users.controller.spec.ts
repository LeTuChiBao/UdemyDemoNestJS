import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService : Partial<AuthService>;


  beforeEach(async () => {
    fakeUsersService= {
      findOne: (id:number)=> {
        return  Promise.resolve({id, email: 'test@email.com', password: 'testpass'} as User)
      },
      find: (email:string)=> {
        return Promise.resolve([{id:1, email, password: 'testpass'} as User])
      },
      // remove: (id: number)=> {},
      // update: ()=> {}
    };
    fakeAuthService= {
      // signup: ()=> {},
      signIn: (email:string, password:string)=> {
        return Promise.resolve({id:1, email, password}as User);
      }
     }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService

        },{
          provide: UsersService,
          useValue: fakeUsersService

        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUser return a list of user with the given email', async () => {
      const testEmail =  'test@email.com';
      const users = await controller.findEmail(testEmail);
      expect(users.length).toEqual(1);
      expect(users[0].email).toEqual(testEmail)
  });

  it('findUser returns a single user with the given id', async()=> {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user.id).toBe(1)
  });
  it('findUser throws an error if user with given id is not found', async()=> {
    fakeUsersService.findOne= ()=> null;
    try {
      await controller.findUser('1')
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.message).toBe('User not found')
    }
  });
  it('signIn updates session object and returns user', async()=> {
    const session = {userId: null}
    const user = await controller.signIn({email: 'test@gmail.com', password: 'testpasssword'},
      session
    );
    console.log(user)
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1)
  })
});
