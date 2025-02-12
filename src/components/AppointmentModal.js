import React from "react";
import "./CustomModal.css"; // Import styles for the modal

const AppointmentModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="app-modal-content">
        <button className="app-close-btn" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default AppointmentModal;
