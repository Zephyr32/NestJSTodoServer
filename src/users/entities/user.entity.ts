import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail, IsNotEmpty } from 'class-validator';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, required: true, unique: true })
  email: string;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true })
  password: string;
  @Prop({ type: Boolean, default: false })
  isActivated: boolean;
  @Prop({ type: String })
  activationLink: string;
}

export class UserDto {
  id: string;
  email: string;
  name: string;
  isActivated: boolean;

  constructor(model: UserDocument) {
    this.email = model.email;
    this.id = model._id;
    this.name = model.name;
    this.isActivated = model.isActivated;
  }
}
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;
}

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
export interface RegisterLoginReturn {
  accessToken: string;
  refreshToken: string;
}

export const SchemaUser = SchemaFactory.createForClass(User);

export const ModuleUserConnect = { name: User.name, schema: SchemaUser };
