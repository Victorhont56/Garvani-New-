
import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "./Button";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: React.ReactNode;
  body?: React.ReactElement ;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  actionLabel,
  footer,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose, disabled]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [onSubmit, disabled]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [secondaryAction, disabled]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[500000] outline-none focus:outline-none bg-neutral-800/70">
        <div className="relative w-[90%] md:w-[80%] lg:w-[50%] xl:w-[40%] my-6 mx-auto max-h-[90vh] h-auto">
          {/*content*/}
          <div className={`translate duration-300
              ${showModal ? "translate-y-0" : "translate-y-full"}
              ${showModal ? "opacity-100" : "opacity-0"}
            `}>
            <div className="
              translate
              border-0 
              rounded-2xl 
              shadow-lg 
              relative 
              flex 
              flex-col 
              w-full 
              bg-gradient-to-b from-[#fbd5ea] to-[#affab0]
              outline-none 
              focus:outline-none
              max-h-[90vh]
              overflow-y-auto
            ">
              {/*header*/}
              <div className="
                flex 
                items-center 
                p-4
                rounded-t
                justify-center
                relative
                border-b-[1px]
                border-neutral-200
                sticky
                top-0
                bg-[#fbd5ea] 
                z-10
              ">
                <button
                  className="
                    p-1
                    border-0 
                    hover:opacity-70
                    transition
                    absolute
                    left-4
                  "
                  onClick={handleClose}
                >
                  <IoMdClose size={18} />
                </button>
                <div className="text-lg font-semibold">{title}</div>
              </div>
              
              {/*body*/}
              <div className="relative p-6 flex-auto overflow-y-auto">
                <div className="bg-white rounded-xl shadow-md p-6">
                  {body}
                </div>
              </div>
              
              {/*footer*/}
              <div className="flex flex-col gap-4 px-6 py-2 sticky bottom-0 bg-[#affab0] border-t-[1px] border-neutral-200">
                <div className="flex flex-row items-center gap-4 w-full">
                  {secondaryAction && secondaryActionLabel && (
                    <div className="w-full md:w-1/2">
                      <Button
                        disabled={disabled}
                        label={secondaryActionLabel}
                        onClick={handleSecondaryAction}
                        outline
                      />
                    </div>
                  )}
                  <div className={`w-full ${secondaryAction && secondaryActionLabel ? 'md:w-1/2' : 'w-full'}`}>
                    <Button
                      disabled={disabled}
                      label={actionLabel}
                      onClick={handleSubmit}
                    />
                  </div>
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;