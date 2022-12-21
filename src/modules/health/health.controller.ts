import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  // HttpHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private diskHealthIndicator: DiskHealthIndicator,
    private health: HealthCheckService,
    // private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // the used disk storage should not exceed the 50% of the available space
      () =>
        this.diskHealthIndicator.checkStorage('disk_health', {
          thresholdPercent: 0.5,
          path: '/',
        }),
      /*
      () =>
        this.http.pingCheck(
          'any',
          'https://{any}',
        ), 
      () =>
        this.http.responseCheck(
          'any_response',
          'https://{any}',
          (res) => res.status === 200,
        ),
        */
      // the process should not use more than 150MB memory
      async () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // The process should not have more than 150MB RSS memory allocated
      async () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      async () => this.db.pingCheck('database'),
    ]);
  }
}
