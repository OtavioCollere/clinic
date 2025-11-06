
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma.service';
import { DatabaseModule } from '@faker-js/faker/.';

import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import supertest from 'supertest';
import { UserFactory } from 'test/factories/make-user';
import { beforeAll, describe, expect, it } from 'vitest';


describe('Authenticate  (E2E)', () => {
  let app : INestApplication
  let prisma : PrismaService
  let userFactory : UserFactory
  
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule, DatabaseModule],
        providers: [UserFactory],
      }).compile();

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    userFactory = moduleRef.get(UserFactory)

    await app.init()
  });

  it("[POST] /sessions", async () => {

    await userFactory.makePrismaUser({
      email : 'otavio@email.com',
      password : await hash('12345678910', 8),
    })
    
    const result = await supertest(app.getHttpServer())
    .post('/sessions')
    .send({
      email : 'otavio@email.com',
      password : '12345678910',
    })

    expect(result.status).toEqual(201);
    expect(result.body).toEqual({
      access_token : expect.any(String),
      refresh_token : expect.any(String)
    })
  })

});