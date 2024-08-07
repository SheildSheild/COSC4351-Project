// controllers/reportController.js
import json2csv from 'json2csv';
import PDFDocument from 'pdfkit';
import { parse } from 'json2csv';

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


export const generateEventCSVReport = (events, users) => {
  const csvFields = ['eventId', 'eventName', 'eventDate', 'location', 'description', 'participants'];
  const csvData = [];

  events.forEach(event => {
    const participants = users
      .filter(user => user.acceptedEvents.some(e => e.eventId === event.id))
      .map(user => user.fullName)
      .join(', ');

    csvData.push({
      eventId: event.id,
      eventName: event.name,
      eventDate: event.date,
      location: event.location,
      description: event.description,
      participants: participants || 'None',
    });
  });

  return parse(csvData, { fields: csvFields });
};

// Function to generate PDF report for events
export const generateEventPDFReport = (events, users) => {
  const doc = new PDFDocument();

  events.forEach(event => {
    doc.fontSize(14).text(`Event Name: ${event.name}`);
    doc.fontSize(12).text(`Date: ${event.date}`);
    doc.fontSize(12).text(`Location: ${event.location}`);
    doc.fontSize(12).text(`Description: ${event.description}`);
    doc.fontSize(12).text(`Participants:`);

    users.forEach(user => {
      if (user.acceptedEvents.some(e => e.eventId === event.id)) {
        doc.fontSize(10).text(` - ${user.fullName}`);
      }
    });

    doc.addPage();
  });

  return doc;
};
