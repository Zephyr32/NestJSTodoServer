import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterType, Todo, TodoDocument } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>,
  ) {}
  create(createTodoDto: CreateTodoDto): Promise<Todo> {
    console.log('daata', createTodoDto);
    const createdTodo = new this.todoModel(createTodoDto);
    return createdTodo.save();
  }

  findAll() {
    return this.todoModel.find().exec();
  }

  findOne(id: string) {
    return this.todoModel.findById(id).exec();
  }

  update(id: string, updateTodoDto: UpdateTodoDto) {
    return this.todoModel.findByIdAndUpdate(id, updateTodoDto).exec();
  }

  remove(id: string) {
    return this.todoModel.findByIdAndRemove(id).exec();
  }
  removeToFilter(filter: FilterType) {
    return this.todoModel.remove({ checked: 'true' }).exec();
  }
}
