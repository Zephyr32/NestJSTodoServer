import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaType } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop({ type: SchemaType.Types.ObjectId, ref: 'User' })
  user: string;
  @Prop({ type: String, required: true })
  refreshToken: string;
}
export const REFRESH_TOKEN = 'refreshToken';
export const SchemaToken = SchemaFactory.createForClass(Token);

export const ModuleTokenConnect = { name: Token.name, schema: SchemaToken };

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
