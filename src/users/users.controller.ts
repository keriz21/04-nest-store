import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth-guard';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}

  //   @Get('/pet/:pet')
  //   setPet(@Param('pet') pet: string, @Session() session: any) {
  //     session.pet = pet;
  //   }

  //   @Get('/pet')
  //   getPet(@Session() session: any) {
  //     return session.pet;
  //   }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    // return body;
    return this.userService.create(body.name, body.email, body.password);
  }

  @Get()
  Find(@Query('email') email: string) {
    return this.userService.findAll(email);
  }

  @Get('/:id')
  FindUserById(@Param('id') id: string) {
    return this.userService.findOneBy(Number(id));
  }

  @Put('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(Number(id), body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(Number(id));
  }

  @Get('/auth/current-user')
  @UseGuards(AuthGuard)
  currentUser(@CurrentUser() user: User) {
    return user;
  }
}
