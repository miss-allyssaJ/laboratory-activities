import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// ✅ Schema decorator = defines a MongoDB collection structure
@Schema({ timestamps: true }) // automatically adds createdAt & updatedAt
export class Weather extends Document {
  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  condition: string;
}

// ✅ Generate a Schema from the class
export const WeatherSchema = SchemaFactory.createForClass(Weather);
