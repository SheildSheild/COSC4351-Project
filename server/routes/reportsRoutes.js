// routes/reportRoutes.js
import express from 'express';
import connectToDatabase from '../mongoConnect.js';
import {
  generateCSVReport,
  generatePDFReport,
  generateEventCSVReport,
  generateEventPDFReport
} from '/Users/mahiralam/COSC4353-Project-6/server/controllers/reportsController.js';

const router = express.Router();

// Generate volunteer report
router.get('/generate', async (req, res) => {
  const { type } = req.query; // 'csv' or 'pdf'
  const reportType = req.query.reportType || 'volunteer'; // 'volunteer' or 'event'

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const eventsCollection = db.collection('events');

    const users = await usersCollection.find().toArray();
    const events = await eventsCollection.find().toArray();

    if (reportType === 'volunteer') {
      // Volunteer report logic
      if (type === 'csv') {
        const csvReport = generateCSVReport(users, events);
        res.setHeader('Content-Disposition', 'attachment; filename=volunteer_report.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvReport);
      } else if (type === 'pdf') {
        const pdfReport = generatePDFReport(users, events);
        res.setHeader('Content-Disposition', 'attachment; filename=volunteer_report.pdf');
        res.set('Content-Type', 'application/pdf');
        pdfReport.pipe(res);
        pdfReport.end();
      } else {
        res.status(400).json({ message: 'Invalid report type' });
      }
    } else if (reportType === 'event') {
      // Event report logic
      if (type === 'csv') {
        const csvReport = generateEventCSVReport(events, users);
        res.setHeader('Content-Disposition', 'attachment; filename=event_report.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvReport);
      } else if (type === 'pdf') {
        const pdfReport = generateEventPDFReport(events, users);
        res.setHeader('Content-Disposition', 'attachment; filename=event_report.pdf');
        res.set('Content-Type', 'application/pdf');
        pdfReport.pipe(res);
        pdfReport.end();
      } else {
        res.status(400).json({ message: 'Invalid report type' });
      }
    } else {
      res.status(400).json({ message: 'Invalid report type' });
    }
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
});

export default router;
