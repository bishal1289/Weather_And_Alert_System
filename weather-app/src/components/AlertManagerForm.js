import React, { useState } from 'react';
import './AlertManager.css'; // Import the CSS file

const AlertManagerForm = ({ onAlertCreated }) => {
  const [city, setCity] = useState('');
  const [condition, setCondition] = useState('');
  const [threshold, setThreshold] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleConditionChange = (e) => {
    const selectedCondition = e.target.value;
    setCondition(selectedCondition);
    if (selectedCondition === 'Weather Condition') {
      setMessage(''); // Reset message when selecting weather condition
      setThreshold('0'); // Set default threshold for weather condition
    } else {
      setMessage(''); // Reset message for other conditions
    }
  };

  const createAlert = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/alert/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city,
          condition,
          threshold: condition === 'Weather Condition' ? '0' : threshold,
          message,
          email,
        }),
      });
      const data = await response.json();
      alert(data.message);
      // Notify parent component about the new alert
      if (onAlertCreated) onAlertCreated();
      // Clear fields after submission
      setCity('');
      setCondition('');
      setThreshold('');
      setMessage('');
      setEmail('');
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  return (
    <div className="alert-manager-form mt-5">
      <h2 className="text-center mb-4 text-black fw-bold">Create Alert</h2>
      <p className="text-center mb-4">
        When an alert is triggered, an email will be sent and the alert will be removed.
      </p>
      <div className="form-container d-flex justify-content-center">
        <div className="form-group mb-4">
          <label htmlFor="city" className="form-label">Select City</label>
          <select
            id="city"
            className="form-control"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Select City</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>
        </div>

        <div className="form-group mb-4">
          <label htmlFor="condition" className="form-label">Select Condition</label>
          <select
            id="condition"
            className="form-control"
            value={condition}
            onChange={handleConditionChange}
          >
            <option value="">Select Condition</option>
            <option value="Temperature">Temperature</option>
            <option value="Humidity">Humidity</option>
            <option value="Wind Speed">Wind Speed</option>
            <option value="Weather Condition">Weather Condition</option>
          </select>
        </div>

        {condition === 'Weather Condition' && (
          <div className="form-group mb-4">
            <label htmlFor="message" className="form-label">Weather Condition Message</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter weather condition (e.g., Mist, Haze, Clear, Rain)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        )}

        <div className="form-group mb-4">
          <label htmlFor="threshold" className="form-label">Threshold</label>
          <input
            type="number"
            id="threshold"
            className="form-control"
            placeholder="Threshold"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            disabled={condition === 'Weather Condition'} // Disable threshold for weather condition
          />
        </div>

        <div className="form-group mb-4">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={createAlert}>
          Create Alert
        </button>
      </div>
    </div>
  );
};

export default AlertManagerForm;
