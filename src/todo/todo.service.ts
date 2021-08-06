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
    console.log('create', createTodoDto);
    const createdTodo = new this.todoModel(createTodoDto);
    return createdTodo.save();
  }

  findAll() {
    console.log('findAll');
    return this.todoModel.find().exec();
  }

  findOne(id: string) {
    console.log('findOne');
    return this.todoModel.findById(id).exec();
  }

  update(id: string, updateTodoDto: UpdateTodoDto) {
    console.log('update');
    return this.todoModel.findByIdAndUpdate(id, updateTodoDto).exec();
  }

  remove(id: string) {
    console.log('remove');
    return this.todoModel.findByIdAndRemove(id).exec();
  }
  removeToFilter(filter: FilterType) {
    console.log('filter', filter);
    switch (filter) {
      case FilterType.ALL:
        return this.todoModel.remove().exec();
      case FilterType.DONE:
        return this.todoModel.remove({ checked: 'true' }).exec();
      default:
        break;
    }
  }
}
