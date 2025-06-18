import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParsedContentDocument = ParsedContent & Document;

@Schema()
export class ParsedContent {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  fileType: 'document' | 'audio';

  @Prop({ required: true })
  text: string;

  @Prop({ default: Date.now })
  parsedAt: Date;
}

export const ParsedContentSchema = SchemaFactory.createForClass(ParsedContent);