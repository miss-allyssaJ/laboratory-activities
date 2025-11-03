import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherModule } from './weather/weather.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    // ✅ Safe cast for TypeScript
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    WeatherModule,
  ],
})
export class AppModule {}
