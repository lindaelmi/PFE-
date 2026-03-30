import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🚀 LILIBooking Backend API is running!';
  }

  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
  }

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