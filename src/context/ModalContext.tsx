// In a new file like src/context/ModalContext.tsx
import { createContext, useContext, useState } from 'react';

type ModalContextType = {
  isListModalOpen: boolean;
  openListModal: () => void;
  closeListModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  const openListModal = () => setIsListModalOpen(true);
  const closeListModal = () => setIsListModalOpen(false);

  return (
    <ModalContext.Provider value={{ isListModalOpen, openListModal, closeListModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}