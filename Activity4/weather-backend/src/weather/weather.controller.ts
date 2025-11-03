import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Weather') // ✅ This adds "Weather" section in Swagger
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiOperation({ summary: 'Get weather by city name' })
  @ApiQuery({ name: 'city', required: true, description: 'City name to search weather for' })
  @ApiResponse({ status: 200, description: 'Returns temperature and condition' })
  async getWeather(@Query('city') city: string) {
    return this.weatherService.getWeather(city);
  }
}
