import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleUserConnect } from './entities/user.entity';

@Module({
  providers: [UsersService],
  imports: [MongooseModule.forFeature([ModuleUserConnect])],
  exports: [UsersService],
})
export class UsersModule {}
