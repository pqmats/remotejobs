import React from 'react';
import { useModal } from '../../context/ModalContext';
import { BaseModal } from '../ui/BaseModal';

export const ModerateJobModal = () => {
  const { isOpen, closeModal } = useModal();

  return (
    <BaseModal isOpen={isOpen} onClose={closeModal} title="Moderar Vaga" size="md">
        <div className="space-y-4">
            <p className="text-onyx-muted">Selecione uma ação para esta vaga.</p>
            <textarea className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 text-white h-24" placeholder="Motivo da ação (enviado ao criador)..."></textarea>
            <div className="flex gap-3 justify-end">
                <button onClick={closeModal} className="px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg border border-green-500/20">Aprovar Vaga</button>
                <button onClick={closeModal} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg border border-red-500/20">Reprovar/Remover</button>
            </div>
        </div>
    </BaseModal>
  );
};