import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      findAll: (email: string) => {
        const user = users.filter((user) => user.email === email);
        return Promise.resolve(user);
      },
      create: (name: string, email: string, password: string) => {
        // return Promise.resolve({ id: 1, name, email, password } as User);
        const user = {
          id: Math.floor(Math.random() * 9999),
          name,
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user with hashed password', async () => {
    const user = await service.register(
      'Test User',
      'bedak@ikan.com',
      'mypassword',
    );

    expect(user.name).toBe('Test User');
    expect(user.password).not.toEqual('mypassword');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should fail to register a user with an existing email', async () => {
    await service.register('Test User', 'bedak@ikan.com', 'mypassword');

    await expect(
      service.register('Test User', 'bedak@ikan.com', 'mypassword'),
    ).rejects.toThrow('email in use');
  });

  it('should fail to login with non-existing email', async () => {
    await expect(service.login('bedak@ikan.com', 'mypassword')).rejects.toThrow(
      'user not found',
    );
  });

  it('should fail to login with incorrect password', async () => {
    await service.register('Test User', 'bedak@ikan.com', 'mypassword');

    await expect(
      service.login('bedak@ikan.com', 'wrongpassword'),
    ).rejects.toThrow('bad password');
  });

  it('should login successfully with correct credentials', async () => {
    await service.register('Test User', 'bedak@ikan.com', 'mypassword');

    const user = await service.login('bedak@ikan.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
