import React from 'react';
import { formatDate } from '../utils/apiUtils';

const DateTest = () => {
  // Test cases với các format ngày khác nhau
  const testDates = [
    "2025-05-15",           // ISO format từ backend
    "2025-05-15T00:00:00",  // ISO datetime
    "2025-05-15T10:30:00Z", // ISO với timezone
    new Date("2025-05-15"), // Date object
    new Date(),             // Current date
    null,                   // Null value
    undefined,              // Undefined value
    "",                     // Empty string
    "invalid-date"          // Invalid date
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h3>Date Formatting Test</h3>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Input</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Type</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>formatDate() Result</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Native toLocaleDateString()</th>
          </tr>
        </thead>
        <tbody>
          {testDates.map((date, index) => {
            let nativeResult = "N/A";
            try {
              if (date) {
                const d = new Date(date);
                if (!isNaN(d.getTime())) {
                  nativeResult = d.toLocaleDateString('vi-VN');
                }
              }
            } catch (e) {
              nativeResult = "Error";
            }

            return (
              <tr key={index}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {date === null ? 'null' : date === undefined ? 'undefined' : String(date)}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {typeof date}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px', fontWeight: 'bold', color: 'blue' }}>
                  {formatDate(date)}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {nativeResult}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ddd' }}>
        <h4>Expected Backend Date Format:</h4>
        <p><strong>Review.createdAt:</strong> "yyyy-MM-dd" (e.g., "2025-05-15")</p>
        <p><strong>TrainingProgress.recordDate:</strong> "yyyy-MM-dd" (e.g., "2025-05-15")</p>
        <p><strong>Expected Display:</strong> "15/05/2025" (DD/MM/YYYY)</p>
      </div>
    </div>
  );
};

export default DateTest;
