// tests/reportsRoutes.test.js
import request from 'supertest';
import express from 'express';
import reportsRouter from '../routes/reportsRoutes';
import { generateCSVReport, generatePDFReport, generateEventCSVReport, generateEventPDFReport } from '../controllers/reportsController';

// Mock the database connection and data
jest.mock('../mongoConnect', () => jest.fn().mockResolvedValue({
  collection: (name) => ({
    find: () => ({
      toArray: async () => {
        if (name === 'users') {
          return [
            {
              fullName: 'John Doe',
              email: 'john@example.com',
              acceptedEvents: [{ eventId: 1 }]
            }
          ];
        }
        if (name === 'events') {
          return [
            {
              id: 1,
              name: 'Event 1',
              date: '2023-01-01',
              location: 'Location 1',
              description: 'Description 1'
            }
          ];
        }
        return [];
      }
    })
  })
}));

const app = express();
app.use('/api/reports', reportsRouter);

describe('GET /api/reports/generate', () => {
  it('should generate volunteer CSV report', async () => {
    await request(app)
      .get('/api/reports/generate?type=csv&reportType=volunteer')
      .expect('Content-Disposition', 'attachment; filename=volunteer_report.csv')
      .expect('Content-Type', 'text/csv; charset=utf-8')
      .expect(200);
  });

  it('should generate volunteer PDF report', async () => {
    await request(app)
      .get('/api/reports/generate?type=pdf&reportType=volunteer')
      .expect('Content-Disposition', 'attachment; filename=volunteer_report.pdf')
      .expect('Content-Type', 'application/pdf')
      .expect(200);
  });

  it('should generate event CSV report', async () => {
    await request(app)
      .get('/api/reports/generate?type=csv&reportType=event')
      .expect('Content-Disposition', 'attachment; filename=event_report.csv')
      .expect('Content-Type', 'text/csv; charset=utf-8')
      .expect(200);
  });

  it('should generate event PDF report', async () => {
    await request(app)
      .get('/api/reports/generate?type=pdf&reportType=event')
      .expect('Content-Disposition', 'attachment; filename=event_report.pdf')
      .expect('Content-Type', 'application/pdf')
      .expect(200);
  });

  it('should return 400 for invalid report type', async () => {
    await request(app)
      .get('/api/reports/generate?type=invalid&reportType=volunteer')
      .expect(400)
      .expect('Content-Type', /json/)
      .expect({ message: 'Invalid report type' });
  });

  it('should handle server errors', async () => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {}); // Mock console.error
    jest.mock('../mongoConnect', () => jest.fn().mockRejectedValue(new Error('Database connection error')));

    await request(app)
      .get('/api/reports/generate?type=csv&reportType=volunteer')
      .expect(500)
      .expect('Content-Type', /json/)
      .expect({ message: 'Error generating report' });

    jest.restoreAllMocks(); // Restore original implementation of console.error
  });
});
