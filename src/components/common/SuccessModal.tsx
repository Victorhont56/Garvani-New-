import React from "react";
import Modal from "./Modal";
import { CheckCircle } from "lucide-react"; // Import a tick icon

interface SuccessModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onClose} // Use onClose as the submit handler
      title="Congratulations!"
      actionLabel="Close"
      body={
        <div className="flex flex-col items-center justify-center gap-4">
          <CheckCircle className="w-16 h-16 text-green-500" /> {/* Tick icon */}
          <p className="text-lg text-center">
            Your listing has been successfully created.
          </p>
        </div>
      }
    />
  );
};

export default SuccessModal;