import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RMQModule, RMQService, RMQTestService } from 'nestjs-rmq';
import { AuthModule } from './auth.module';
import { UsersModule } from '../users/users.module';
import { INestApplication } from '@nestjs/common';
import { UsersRepository } from '../users/repositories/user.repository';
import { AccountLogin, AccountRegister } from '@org/contracts';
// eslint-disable-next-line @nx/enforce-module-boundaries

const authLogin = {
  email: 'a2@a.ru',
  password: 'password',
};

const authRegister = {
  ...authLogin,
  displayName: 'displayName',
};

describe('GET /api', () => {
  let app: INestApplication;
  let userRepository: UsersRepository;
  let rmqTestService: RMQTestService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['envs/.env.accounts'],
        }),
        //TODO при запуске тестов некорректно обрабатываюься переменные, надо разбираться
        MongooseModule.forRoot('mongodb://localhost:27017/nest_microservices_db'),
        RMQModule.forTest(
        {}),
        AuthModule,
        UsersModule,
      ]
    }).compile();
    app = module.createNestApplication();
    userRepository = app.get<UsersRepository>(UsersRepository);
    rmqTestService = app.get(RMQService);
    await app.init();
  })

  it('Register', async () => {
    const send = await rmqTestService.triggerRoute<
      AccountRegister.Request,
      AccountRegister.Response
    >(AccountRegister.topic, authRegister);

    expect(send.email).toEqual(expect.any(String));
    expect(send.email).toEqual(authRegister.email);
  });

  it('Login', async () => {
    const send = await rmqTestService.triggerRoute<
      AccountLogin.Request,
      AccountLogin.Response
    >(AccountLogin.topic, authLogin);
    expect(send.access_token).toEqual(expect.any(String));
  });

  afterAll(async () => {
    await userRepository.deleteUser(authLogin.email);
    await app.close();
  })

});
