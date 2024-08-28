import { BadRequestException, 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Patch, 
    Post, 
    Session, 
    UseInterceptors,
    UseGuards,
    Query, 
    NotFoundException} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-use.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-use.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './decorator/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';


@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ){}

    // @Get('/whoami')
    // whoAmI(@Session() session:any){
    //     return this.usersService.findOne(session.userId);
    // }


    @UseGuards(AuthGuard)
    @Get('/whoami')
    whoAmI(@CurrentUser() user:User){
        return user
    }

    @Post('/signout')
    signOut(@Session() session:any){
        session.userId = null
    }

    @Post('/signup')
    async createUser(@Body() body:CreateUserDto, @Session() session: any){
        const user = await this.authService.signup(body.email, body.password)
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signIn(@Body() body:CreateUserDto, @Session() session:any){
        const user = await this.authService.signIn(body.email, body.password)
        session.userId = user.id;
        return user;
    }

    @Get('/:id')
    async findUser(@Param('id') id: string){
        const user = await this.usersService.findOne(Number(id))
        if(!user) throw new NotFoundException('User not found')
        return user;
    }

    @Get()
    async findEmail(@Query('email') email: string){
        if(!email) throw new BadRequestException('Query is wrong field')
        return await this.usersService.find(email)
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body : UpdateUserDto){
        return this.usersService.update(Number(id),body)
    }

    @Delete('/:id')
    deleteUser(@Param('id') id:string){
        return this.usersService.remove(Number(id))
    }
}
