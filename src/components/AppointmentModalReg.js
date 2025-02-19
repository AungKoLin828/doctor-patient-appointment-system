import React from "react";
import "./CustomModal.css"; // Import styles for the modal

const AppointmentModalReg = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="app-modal-content-reg">
        <button className="app-close-btn" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default AppointmentModalReg;
