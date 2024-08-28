import { DeepPartial, Entity } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let fakeAuthService: Partial<AuthService> 
  let fakeUserRepository : Partial<Repository<User>>;
  beforeEach(async () => {
    fakeAuthService = {
      hashPass: (password:string)=>{
        const result = 'abcxyd123131'
        return Promise.resolve(result)
      } 
    }
    const users: User [] = [];
    fakeUserRepository = {
  //  create: (user: Partial<User>) => {
  //       const newUser = {
  //         id: Math.floor(Math.random() * 99999),
  //         email: user.email,
  //         password: user.password,
  //       } as User;
  //       users.push(newUser);
  //       return newUser;
  //     },
      // find: (options?: FindManyOptions<User>) => {
      //     let email;
      //     if(options) {
      //       const{where} = options;
      //       {}

      //     }
      //     users
      // },
      // // findOne: ()=> {},
      // save: async (entity: DeepPartial<User> | DeepPartial<User>[]) => {
      //   const entitiesArray = Array.isArray(entity) ? entity : [entity];
      //   entitiesArray.forEach((ent) => {
      //     const newUser = {
      //       id: Math.floor(Math.random() * 99999),
      //       ...ent,
      //     } as User;
      //     users.push(newUser);
      //   });
      //   return Promise.resolve(entitiesArray.map((ent) => ent as User));
      // },
      // remove: ()=> {}
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,{
        provide: AuthService,
        useValue: fakeAuthService
      }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
});
