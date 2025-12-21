import React, { CSSProperties, ReactNode } from "react";

interface ModalProps {
  open: boolean;
  overlayStyles?: CSSProperties;
  contentStyles?: CSSProperties;
  children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  open,
  overlayStyles,
  contentStyles,
  children,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center h-screen w-screen backdrop-blur-xs bg-gray-900/70"
      style={overlayStyles}
    >
      <div
        className="relative max-h-[90%] max-w-[90%] flex overflow-auto rounded-2xl shadow-lg bg-white"
        style={contentStyles}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
