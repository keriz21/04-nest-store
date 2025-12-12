import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Get,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsService } from './items.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { itemDto } from './dto/item.dto';
import { ApprovedItemDto } from './dto/approve-item.dto';
import { AuthGuard } from '../guards/auth-guard';
import { AdminGuard } from '../guards/admin.guards';
import { QueryItemDto } from './dto/query-item.dto';
// import { AuthGuard } from '../guards/auth-guard';

@Controller('items')
// @UseGuards(AuthGuard)
export class ItemsController {
  constructor(private itemService: ItemsService) {}

  @Get()
  getAllItems(@Query() query: QueryItemDto) {
    return this.itemService.getAllItems(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(itemDto)
  createItem(@Body() body: CreateItemDto, @CurrentUser() user: User) {
    // logic to create an item
    return this.itemService.create(body, user);
  }

  @Patch('/:id/')
  @UseGuards(AdminGuard)
  approveItem(@Param('id') id: string, @Body() body: ApprovedItemDto) {
    // return this.itemService.approveItem(Number(id));
    return this.itemService.approveItem(parseInt(id), body);
  }
}
