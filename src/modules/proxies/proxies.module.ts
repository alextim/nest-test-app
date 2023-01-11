import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProxiesService } from './proxies.service';
import { ProxiesController } from './proxies.controller';
import { Proxy } from './entities/proxy.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Proxy])],
  controllers: [ProxiesController],
  providers: [ProxiesService],
  exports: [ProxiesService],
})
export class ProxiesModule {}
