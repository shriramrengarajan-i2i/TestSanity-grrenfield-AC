import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Chat (e2e, no auth header or cookie)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/chat succeeds without any Authorization header or session cookie', () => {
    return request(app.getHttpServer())
      .post('/api/chat')
      .send({ message: 'What is a microgreen?' })
      .expect(201)
      .expect(({ body }) => {
        expect(typeof body.reply).toBe('string');
        expect(body.reply.length).toBeGreaterThan(0);
      });
  });

  it('never returns 401 or 403 for an anonymous visitor', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/chat')
      .send({ message: 'hello' });
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });
});
