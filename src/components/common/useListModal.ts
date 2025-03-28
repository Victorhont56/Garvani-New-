import { create } from "zustand";

interface ListModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useListModal = create<ListModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useListModal;