import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class WeatherService {
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  async getWeather(city: string) {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;

      // ✅ Debugging: show API key and city
      console.log('🔍 Fetching weather for:', city);
      console.log('🔑 Using API key:', apiKey);

      const response = await axios.get(this.baseUrl, {
        params: {
          q: city,
          appid: apiKey,
          units: 'metric',
        },
      });

      const data = response.data;

      // ✅ Ensure valid data is returned
      if (!data || !data.name || !data.main || !data.weather) {
        throw new Error('Incomplete data received from API');
      }

      // ✅ Return simplified weather result
      return {
        city: data.name,
        temperature: data.main.temp,
        condition: data.weather[0].description,
      };
    } catch (error) {
      console.error('❌ Error fetching weather:', error.response?.data || error.message);

      // ✅ Handle common cases
      if (error.response && error.response.status === 404) {
        throw new Error('City not found.');
      }

      throw new Error('Unable to fetch weather data from API.');
    }
  }
}
