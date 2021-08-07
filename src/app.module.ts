import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
const password = 'incode2015';
const connectionString = `mongodb+srv://Bohdan_incode:${password}@bohdancluster.ub7oj.mongodb.net/todo?retryWrites=true&w=majority`;

@Module({
  imports: [
    TodoModule,
    MongooseModule.forRoot(connectionString),
    AuthModule,
    UsersModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
