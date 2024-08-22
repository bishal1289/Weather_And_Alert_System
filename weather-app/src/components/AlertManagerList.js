import React, { useState, useEffect } from 'react';
import './AlertManager.css'; // Import the CSS file

const AlertManagerList = () => {
  const [alerts, setAlerts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 4;

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/alert/');
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []);

  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = alerts.slice(indexOfFirstAlert, indexOfLastAlert);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="alert-manager-list">
      <h2 className="text-center mb-4 text-black fw-bold">Alert List</h2>
      <div className="row">
        {currentAlerts.map((alert) => (
          <div key={alert._id} className="col-md-6 mb-4">
            <div className="alert-card">
              <h5 className="card-title">{alert.city}</h5>
              <p className="card-text"><strong>Condition:</strong> {alert.condition}</p>
              {alert.condition === 'Weather Condition' ? (
                <p className="card-text"><strong>Message:</strong> {alert.message}</p>
              ) : (
                <p className="card-text"><strong>Threshold:</strong> {alert.threshold}</p>
              )}
              <p className="card-text"><strong>Email:</strong> {alert.email}</p>
              <p className="card-text"><strong>Created At:</strong> {new Date(alert.triggeredAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination text-center mt-4">
        {Array.from({ length: Math.ceil(alerts.length / alertsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            className={`btn btn-secondary ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AlertManagerList;
