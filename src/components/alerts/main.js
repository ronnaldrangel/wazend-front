import React from "react";
import ErrorAlert from './ErrorAlert';

const Alerts = ({ message }) => {
  const handleReload = () => {
    window.location.reload();
  };

  if (!message) return null;

  return (
    <ErrorAlert message={message} onReload={handleReload} />
  );
};

export default Alerts;
