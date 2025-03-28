// components/StatusModal.tsx
import { IoCheckmarkCircle, IoAlertCircle } from "react-icons/io5";
import Modal from "./Modal";
import { ReactElement, useEffect } from "react";

interface StatusModalProps {
  isOpen?: boolean;
  onClose: () => void;
  isSuccess?: boolean;
  title?: string;
  body?: ReactElement;
  autoCloseDelay?: number; // Optional prop to customize the auto-close delay
}

const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  isSuccess = true,
  title,
  body,
  autoCloseDelay = 3000,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isOpen) {
      timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, onClose, autoCloseDelay]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="text-black flex items-center gap-2">
          {isSuccess ? (
            <IoCheckmarkCircle className="text-green-500" size={24} />
          ) : (
            <IoAlertCircle className="text-red-500" size={24} />
          )}
          <span className="text-black">{title}</span>
        </div>
      }
      body={body || (
        <div className="text-black text-center py-4">
          {isSuccess ? (
            <span className="text-black">{body}</span>
          ) : (
            <p>Something went Wrong.</p>
          )}
        </div>
      )}
      actionLabel="Continue"
      onSubmit={onClose}
    />
  );
};
export default StatusModal;