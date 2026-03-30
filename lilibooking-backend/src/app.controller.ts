import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return '🚀 LILIBooking Backend API is running!';
  }

  @Get('api/health')
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
  }

  @Get('api/test')
  getTestData(): any {
    return {
      message: 'Bienvenue sur LILIBooking API',
      version: '1.0.0',
      endpoints: {
        hotels: '/api/hotels',
        health: '/api/health',
        test: '/api/test'
      }
    };
  }
}