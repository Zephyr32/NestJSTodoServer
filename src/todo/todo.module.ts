import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleConnect } from './entities/todo.entity';

@Module({
  imports: [MongooseModule.forFeature([ModuleConnect])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
