import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { User } from '../users/user.entity';
import { ApprovedItemDto } from './dto/approve-item.dto';
import { QueryItemDto } from './dto/query-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private itemsRepository: Repository<Item>,
  ) {}

  async getAllItems(queryItemDto: QueryItemDto) {
    const query = this.itemsRepository
      .createQueryBuilder()
      .select('*')
      .where('approved = :approved', { approved: true });

    if (queryItemDto.name) {
      query.andWhere('name LIKE :name', { name: `%${queryItemDto.name}%` });
    }

    if (queryItemDto.category) {
      query.andWhere('category LIKE :category', {
        category: `%${queryItemDto.category}%`,
      });
    }

    if (queryItemDto.location) {
      query.andWhere('location LIKE :location', {
        location: `%${queryItemDto.location}%`,
      });
    }

    return query.getRawMany();
  }

  create(body: CreateItemDto, user: User) {
    const newItem = this.itemsRepository.create(body);
    newItem.user = user;
    return this.itemsRepository.save(newItem);
  }

  async approveItem(id: number, body: ApprovedItemDto) {
    const item = await this.itemsRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    item.approved = body.approved;
    return this.itemsRepository.save(item);
    // return `This action approves item #${id}`;
  }
}
