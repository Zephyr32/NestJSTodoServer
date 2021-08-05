import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {
  @Prop({ type: String, required: true })
  text: string;
  @Prop({ type: Boolean, required: true })
  checked: boolean;
}

export enum FilterType {
  All = 'all',
  Checked = 'checked',
}

export const SchemaTodo = SchemaFactory.createForClass(Todo);

export const ModuleConnect = { name: Todo.name, schema: SchemaTodo };
