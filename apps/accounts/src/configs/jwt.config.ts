import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const getJWTConfig = (): JwtModuleAsyncOptions => {
  return {
    inject: [ConfigService],
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
      //TODO при запуске тестов некорректно обрабатываюься переменные, надо разбираться
      const secret = configService.get('JWT_SECRET') || 'secret';
      return {
        global: true,
        secret,
        signOptions: { expiresIn: '60m' },
      };
    },

  };
};
