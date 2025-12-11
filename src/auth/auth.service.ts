import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(name: string, email: string, password: string) {
    // check if email is in use
    const users = await this.usersService.findAll(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }
    // hash the users password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    const hashPassword = salt + '.' + hash.toString('hex');

    // create a new user and save it
    const user = await this.usersService.create(name, email, hashPassword);
    return user;
  }

  async login(email: string, password: string) {
    const [user] = await this.usersService.findAll(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 64)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    return user;
  }

  async whoAmI(userId: number) {
    return this.usersService.findOneBy(userId);
  }
}
