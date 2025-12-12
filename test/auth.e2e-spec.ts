import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { setupApp } from '../src/setup-app';

describe('Auth Controller (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  it('hadnles register POST', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'kambing@admin.com',
        password: 'mypassword',
      })
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body.id).toBeDefined();
        expect(body.email).toBe('kambing@admin.com');
        expect(body.name).toBe('Test User');
      });
  });

  it('handles loggin after register', async () => {
    const email = 'kambingJantan@admin.com';

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: email,
        password: 'mypassword',
      })
      .expect(201);

    const cookie = response.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toBe(email);
  });
});
