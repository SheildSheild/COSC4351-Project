import React, { useState } from 'react';
import './reports.css';

const Reports = () => {
  const [reportType, setReportType] = useState('volunteer');

  const downloadReport = (type) => {
    window.open(`http://localhost:3000/api/reports/generate?type=${type}&reportType=${reportType}`, '_blank');
  };

  return (
    <div className="reports-page">
      <h2>Generate Reports</h2>
      <div className="report-type-selector">
        <label>
          <input
            type="radio"
            name="reportType"
            value="volunteer"
            checked={reportType === 'volunteer'}
            onChange={() => setReportType('volunteer')}
          />
          Volunteer Report
        </label>
        <label>
          <input
            type="radio"
            name="reportType"
            value="event"
            checked={reportType === 'event'}
            onChange={() => setReportType('event')}
          />
          Event Report
        </label>
      </div>
      <div className="report-buttons">
        <button onClick={() => downloadReport('csv')}>Download CSV</button>
        <button onClick={() => downloadReport('pdf')}>Download PDF</button>
      </div>
    </div>
  );
};

export default Reports;
