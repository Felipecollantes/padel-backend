import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [],
  providers: [],
  imports: [AuthModule],
  exports: [AuthModule],
})
export class SharedModule {}
