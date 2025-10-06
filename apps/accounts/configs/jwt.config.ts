import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const getJWTConfig = (): JwtModuleAsyncOptions => {
  return {
    useFactory: (configService: ConfigService) => {
      const secret = configService.get('JWT_SECRET');
      return {
        global: true,
        secret,
        signOptions: { expiresIn: '60s' },
      };
    },
    inject: [ConfigService],
    imports: [ConfigModule],
  };
};
