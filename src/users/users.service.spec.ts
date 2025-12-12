/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let fakeUsersRepository: any;
  beforeEach(async () => {
    fakeUsersRepository = {
      create: jest.fn((dto) => dto),
      save: jest.fn((user) => Promise.resolve({ id: 1, ...user })),
      find: jest.fn(() => Promise.resolve([])),
      findOneBy: jest.fn(() => Promise.resolve(null)),
      remove: jest.fn((user) => Promise.resolve(user)),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: fakeUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = await service.create(
      'Test User',
      'asep@email.com',
      'mypassword',
    );

    // expect(fakeUsersRepository.create).toHaveBeenCalledWith();
    expect(fakeUsersRepository.create).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'asep@email.com',
      password: 'mypassword',
    });
    expect(fakeUsersRepository.save).toHaveBeenCalled();
    expect(user).toEqual({
      id: 1,
      name: 'Test User',
      email: 'asep@email.com',
      password: 'mypassword',
    });
  });
});
