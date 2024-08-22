import React, { useState } from 'react';
import AlertManagerForm from './AlertManagerForm';
import AlertManagerList from './AlertManagerList';
import './AlertManager.css';

const AlertManager = () => {
  const [refresh, setRefresh] = useState(false);

  const handleAlertCreated = () => {
    setRefresh(prev => !prev); // Toggle refresh to trigger list update
  };

  return (
    <div className="alert-manager">
      <div className="alert-manager-form">
        <AlertManagerForm onAlertCreated={handleAlertCreated} />
      </div>
      <div className="alert-manager-list">
        <AlertManagerList key={refresh} />
      </div>
    </div>
  );
};

export default AlertManager;
