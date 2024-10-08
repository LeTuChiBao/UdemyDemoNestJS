import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const testEmail = 'test@email.com'
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({email: testEmail, password:'123456'})
      .expect(201)
      .then((res)=> {
        const {id,email} = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(testEmail)
      })
  });

  it('signup as a new user then get the currently logged user', async()=> {
    const email = 'test@email.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({email, password: '123456'})
      .expect(201)

    const cookie = res.get('Set-Cookie');
    console.log(cookie);

    const {body} = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie',cookie)
      .expect(200)

    expect(body.id).toBeDefined()
    expect(body.email).toEqual(email)

  })
});
