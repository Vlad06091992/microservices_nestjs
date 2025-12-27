import { ConfigModule, ConfigService } from '@nestjs/config';
import { IRMQServiceAsyncOptions } from 'nestjs-rmq';

export const getRMQConfig = (): IRMQServiceAsyncOptions => {
  return {
    useFactory: (configService: ConfigService) => {
      return {
        messagesTimeout:150000,
        heartbeatIntervalInSeconds:150,
        exchangeName: configService.get('AMQP_EXCHANGE') ?? '',
        connections: [
          {
            login: configService.get('AMQP_USER') ?? '',
            host: configService.get('AMQP_HOST') ?? '',
            password: configService.get('AMQP_PASSWORD') ?? '',
          },
        ],
        queueName: configService.get('AMQP_QUEUE_NAME') ?? '',
        prefetchCount: 32,
        serviceName: 'accounts',
      };
    },
    inject: [ConfigService],
    imports: [ConfigModule],
  };
};
