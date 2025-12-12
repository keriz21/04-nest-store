/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Exclude } from 'class-transformer';
import { Item } from '../items/item.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  // AfterInsert,
  // AfterRemove,
  // AfterUpdate,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Item, (item) => item.user)
  items: Item[];

  // @AfterInsert()
  // logInsert() {
  //   console.log('Inserted User with id:', this.id);
  // }

  // @AfterUpdate()
  // logUpdate() {
  //   console.log('Updaded User with id:', this.id);
  // }

  // @AfterRemove()
  // logRemove() {
  //   console.log('Removed User with id:', this.id);
  // }
}
