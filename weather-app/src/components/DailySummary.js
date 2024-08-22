import React, { useState } from 'react';
import './DailySummary.css'; // Ensure your CSS file is imported

const DailySummary = () => {
  const [date, setDate] = useState('');
  const [summaries, setSummaries] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); // New state for error message

  const fetchDailySummary = async () => {
    if (date) {
      try {
        const response = await fetch(`http://localhost:3001/api/weather/report/${date}`);
        const data = await response.json();
        if (data.length === 0) {
          setErrorMessage('No data found for the selected date. Please choose another date.');
          setSummaries([]);
        } else {
          setSummaries(data);
          setErrorMessage(''); // Clear the error message if data is found
        }
      } catch (error) {
        console.error('Error fetching daily summary:', error);
        setErrorMessage('An error occurred while fetching data. Please try again later.');
        setSummaries([]);
      }
    }
  };

  return (
    <div className="daily-summary-container mt-5">
      <h2 className="text-center mb-4">Daily Summary</h2>
      <div className="input-container mb-3 text-center">
        <input
          type="date"
          className="form-control mb-3 date-input"
          onChange={(e) => setDate(e.target.value)}
        />
        <button className="btn btn-primary" onClick={fetchDailySummary}>
          Get Summary
        </button>
      </div>
      {errorMessage && (
        <div className="alert alert-warning text-center" role="alert">
          {errorMessage}
        </div>
      )}
      {summaries.length > 0 && (
        <table className="table table-striped table-bordered mt-4">
          <thead>
            <tr>
              <th>City</th>
              <th>Avg Temp</th>
              <th>Max Temp</th>
              <th>Min Temp</th>
              <th>Avg Pressure</th>
              <th>Avg Humidity</th>
              <th>Dominant Condition</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map((summary, index) => (
              <tr key={index}>
                <td>{summary.city}</td>
                <td>{summary.avgTemp}°C</td>
                <td>{summary.maxTemp}°C</td>
                <td>{summary.minTemp}°C</td>
                <td>{summary.avgPress} hPa</td>
                <td>{summary.avgHumidity}%</td>
                <td>{summary.dominantCondition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DailySummary;
