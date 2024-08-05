import React, { useState } from 'react';
import './reports.css';

const Reports = () => {
  const [reportType, setReportType] = useState('csv');

  const downloadReport = (type) => {
    window.open(`http://localhost:3000/api/reports/generate?type=${type}`, '_blank');
  };

  return (
    <div className="reports-page">
      <h2>Generate Volunteer Reports</h2>
      <div className="report-buttons">
        <button onClick={() => downloadReport('csv')}>Download CSV</button>
        <button onClick={() => downloadReport('pdf')}>Download PDF</button>
      </div>
    </div>
  );
};

export default Reports;
