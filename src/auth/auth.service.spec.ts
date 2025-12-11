import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    fakeUsersService = {
      findAll: () => Promise.resolve([]),
      create: (name: string, email: string, password: string) => {
        return Promise.resolve({ id: 1, name, email, password } as User);
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
    fakeUsersService.findAll = () => {
      return Promise.resolve([
        {
          id: 1,
          name: 'Test User',
          email: 'bedak@ikan.com',
          password: 'mypassword',
        } as User,
      ]);
    };

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
    fakeUsersService.findAll = () => {
      return Promise.resolve([
        {
          id: 1,
          name: 'Test User',
          email: 'bedak@ikan.com',
          password: 'mypassword',
        } as User,
      ]);
    };

    await expect(
      service.login('bedak@ikan.com', 'wrongpassword'),
    ).rejects.toThrow('bad password');
  });

  it('should login successfully with correct credentials', async () => {
    fakeUsersService.findAll = () => {
      return Promise.resolve([
        {
          id: 1,
          name: 'Test User',
          email: 'bedak@ikan.com',
          password:
            'b5666071a5e06a0d.b578a7f32d42af4bf7e6e6f4e0eac171cea569476acb980b31df63dc343097982692ba2203d4ce9d0ca57acdcbc2f14a03f2362cf8f0c21595db1e2ca6bb0919',
        } as User,
      ]);
    };

    const user = await service.login('bedak@ikan.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
