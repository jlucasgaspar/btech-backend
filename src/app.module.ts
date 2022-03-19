import { JoiPipeModule } from 'nestjs-joi';
import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    UsersModule,
    JoiPipeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
