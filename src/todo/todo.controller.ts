import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { FilterType } from './entities/todo.entity';
import { AuthGuard } from '../auth/auth.guard';
import { ViewAuthFilter } from '../pipes/catch';

@UseGuards(AuthGuard)

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  // @UseFilters(ViewAuthFilter)
  findAll() {
    try {
      return this.todoService.findAll();
    } catch (e) {
      console.log(e);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete('group/:filter')
  removeAllOrChecked(@Param('filter') filter: FilterType, @Query() query: any) {
    return this.todoService.removeToFilter(filter);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(id);
  }
}
