// routes/reportRoutes.js
import express from 'express';
import connectToDatabase from '../mongoConnect.js';
import { generateCSVReport, generatePDFReport } from '../controllers/reportsController.js';

const router = express.Router();

// Generate report
router.get('/generate', async (req, res) => {
  const { type } = req.query; // 'csv' or 'pdf'

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const eventsCollection = db.collection('events');

    const users = await usersCollection.find().toArray();
    const events = await eventsCollection.find().toArray();

    if (type === 'csv') {
      const csvReport = generateCSVReport(users, events);
      res.setHeader('Content-Disposition', 'attachment; filename=report.csv');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(csvReport);
    } else if (type === 'pdf') {
      const pdfReport = generatePDFReport(users, events);
      const fileName = 'report.pdf';
      pdfReport.pipe(res);
      pdfReport.end();
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.set('Content-Type', 'application/pdf');
    } else {
      res.status(400).json({ message: 'Invalid report type' });
    }
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
});

export default router;
