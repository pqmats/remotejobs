import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ModalType = 
  // Jobs
  | 'CREATE_JOB' | 'EDIT_JOB' | 'DELETE_JOB' | 'JOB_DETAILS'
  // Candidate
  | 'APPLY_JOB' | 'CREATE_ALERT' | 'PROPOSAL_TEMPLATE' | 'FREELANCE_CALC_MODAL'
  // Company
  | 'PLAN_PAYMENT' | 'FEATURE_JOB' | 'VERIFY_COMPANY'
  // Admin
  | 'MODERATE_JOB' | 'MODERATE_USER' | 'MANAGE_VERIFICATION'
  // User
  | 'EDIT_PROFILE'
  // System
  | 'CONFIRMATION' | 'FEEDBACK';

interface ModalContextType {
  isOpen: boolean;
  modalType: ModalType | null;
  modalProps: any;
  openModal: (type: ModalType, props?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [modalProps, setModalProps] = useState<any>({});

  const openModal = (type: ModalType, props: any = {}) => {
    setModalType(type);
    setModalProps(props);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Delay clearing type to allow animation to finish
    setTimeout(() => {
      setModalType(null);
      setModalProps({});
    }, 300);
  };

  return (
    <ModalContext.Provider value={{ isOpen, modalType, modalProps, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
};