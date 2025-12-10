import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(name: string, email: string, password: string) {
    const user = this.userRepository.create({
      name,
      email,
      password,
    });

    return this.userRepository.save(user);
  }

  findAll(email: string) {
    return this.userRepository.find({
      where: {
        email,
      },
    });
  }

  async findOneBy(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOneBy(id);
    Object.assign(user, attrs);
    return this.userRepository.save(user);
    // return this.userRepository.update(id, attrs);
  }

  async remove(id: number) {
    const user = await this.findOneBy(id);

    return this.userRepository.remove(user);
  }
}
