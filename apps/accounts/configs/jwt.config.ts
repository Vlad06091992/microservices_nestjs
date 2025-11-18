import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const getJWTConfig = (): JwtModuleAsyncOptions => {
  return {
    inject: [ConfigService],
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
      const secret = configService.get('JWT_SECRET');
      return {
        global: true,
        secret,
        signOptions: { expiresIn: '60m' },
      };
    },

  };
};
