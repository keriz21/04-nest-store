import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post()
  createUser(@Body() body: CreateUserDto) {
    // return body;
    return this.userService.create(body.name, body.email, body.password);
  }

  @Serialize(UserDto)
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
}
