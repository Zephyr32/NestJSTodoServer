import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
const password = 'incode2015';
const connectionString = `mongodb+srv://Bohdan_incode:${password}@bohdancluster.ub7oj.mongodb.net/todo?retryWrites=true&w=majority`;

@Module({
  imports: [TodoModule, MongooseModule.forRoot(connectionString)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
