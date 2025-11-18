import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const getMongoConfig = (): MongooseModuleAsyncOptions => {
  return {
    useFactory: (configService: ConfigService) => {
      const uri = `${configService.get('MONGO_URI')}/${configService.get('DB_NAME')}`;
      console.log('uri',uri);
      return ({
      uri: uri,
    });},
    inject:[ConfigService],
    imports:[ConfigModule],
  }
};
