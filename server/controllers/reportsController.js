// controllers/reportController.js
import json2csv from 'json2csv';
import PDFDocument from 'pdfkit';

// Function to generate CSV report
export const generateCSVReport = (users, events) => {
  const csvFields = ['fullName', 'email', 'eventId', 'eventName', 'eventDate'];
  const csvData = [];

  users.forEach(user => {
    user.acceptedEvents.forEach(event => {
      const eventDetails = events.find(e => e.id === event.eventId);
      if (eventDetails) {
        csvData.push({
          fullName: user.fullName,
          email: user.email,
          eventId: eventDetails.id,
          eventName: eventDetails.name,
          eventDate: eventDetails.date,
        });
      }
    });
  });

  return json2csv.parse(csvData, { fields: csvFields });
};

// Function to generate PDF report
export const generatePDFReport = (users, events) => {
  const doc = new PDFDocument();

  users.forEach(user => {
    doc.fontSize(14).text(`Name: ${user.fullName}`);
    doc.fontSize(12).text(`Email: ${user.email}`);
    doc.fontSize(12).text(`Accepted Events:`);

    user.acceptedEvents.forEach(event => {
      const eventDetails = events.find(e => e.id === event.eventId);
      if (eventDetails) {
        doc.fontSize(10).text(` - ${eventDetails.name} on ${eventDetails.date}`);
      }
    });

    doc.addPage();
  });

  return doc;
};
