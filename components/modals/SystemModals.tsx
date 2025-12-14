import React from 'react';
import { useModal } from '../../context/ModalContext';
import { BaseModal } from '../ui/BaseModal';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export const ConfirmationModal = () => {
  const { isOpen, closeModal, modalProps } = useModal();
  const { title, description, onConfirm, confirmText = 'Confirmar', isDestructive } = modalProps;

  return (
    <BaseModal isOpen={isOpen} onClose={closeModal} title={title} size="sm">
      <div className="space-y-4">
        {isDestructive && (
            <div className="flex justify-center mb-2">
                <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                    <AlertTriangle className="w-8 h-8" />
                </div>
            </div>
        )}
        <p className="text-onyx-muted text-center">{description}</p>
        <div className="flex gap-3 justify-center mt-6">
          <button onClick={closeModal} className="px-4 py-2 bg-onyx-700 text-white rounded-lg hover:bg-onyx-600">Cancelar</button>
          <button 
            onClick={() => { onConfirm(); closeModal(); }} 
            className={`px-6 py-2 rounded-lg text-white ${isDestructive ? 'bg-red-500 hover:bg-red-600' : 'bg-onyx-accent hover:bg-onyx-accentHover'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export const FeedbackModal = () => {
    const { isOpen, closeModal, modalProps } = useModal();
    const { type, title, message } = modalProps;

    return (
        <BaseModal isOpen={isOpen} onClose={closeModal} title="" size="sm">
            <div className="text-center py-4">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {type === 'success' ? <CheckCircle className="w-6 h-6"/> : <AlertTriangle className="w-6 h-6"/>}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-onyx-muted">{message}</p>
                <button onClick={closeModal} className="mt-6 px-6 py-2 bg-onyx-800 border border-onyx-700 hover:bg-onyx-700 text-white rounded-lg">
                    Fechar
                </button>
            </div>
        </BaseModal>
    )
}