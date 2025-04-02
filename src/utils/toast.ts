// utils/toast.ts
import toast from 'react-hot-toast';

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: 'top-center',
    duration: 3000,
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: 'top-center',
    duration: 4000,
  });
};
