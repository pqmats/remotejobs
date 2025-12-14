import React from 'react';
import { useModal } from '../../context/ModalContext';
import { BaseModal } from '../ui/BaseModal';
import { Check, CreditCard, ShieldCheck } from 'lucide-react';

export const PlanPaymentModal = () => {
  const { isOpen, closeModal } = useModal();

  return (
    <BaseModal isOpen={isOpen} onClose={closeModal} title="Upgrade para Pro" size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
           <h3 className="text-lg font-bold text-white mb-4">Plano Pro</h3>
           <ul className="space-y-3 mb-6">
             {['Vagas ilimitadas', 'Destaque por 7 dias', 'Acesso ao Banco de Talentos', 'Suporte Prioritário'].map(f => (
               <li key={f} className="flex items-center gap-2 text-onyx-muted"><Check className="w-4 h-4 text-green-500" /> {f}</li>
             ))}
           </ul>
           <div className="text-3xl font-bold text-white mb-1">R$ 299<span className="text-sm font-normal text-onyx-muted">/mês</span></div>
        </div>
        <div className="bg-onyx-900 p-6 rounded-xl border border-onyx-700">
           <h4 className="font-semibold text-white mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Pagamento Seguro</h4>
           <div className="space-y-3">
             <input placeholder="Número do Cartão" className="w-full bg-onyx-800 border border-onyx-700 rounded p-3 text-white" />
             <div className="grid grid-cols-2 gap-3">
                <input placeholder="MM/AA" className="w-full bg-onyx-800 border border-onyx-700 rounded p-3 text-white" />
                <input placeholder="CVC" className="w-full bg-onyx-800 border border-onyx-700 rounded p-3 text-white" />
             </div>
             <button onClick={closeModal} className="w-full py-3 bg-onyx-accent text-white rounded-lg font-bold mt-2">Assinar Agora</button>
           </div>
        </div>
      </div>
    </BaseModal>
  );
};

export const VerificationModal = () => {
    const { isOpen, closeModal } = useModal();

    return (
        <BaseModal isOpen={isOpen} onClose={closeModal} title="Solicitar Verificação" size="md">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <p className="text-onyx-muted">Para garantir a segurança da plataforma, precisamos verificar os dados da sua empresa (CNPJ e Contrato Social).</p>
                
                <div className="border-2 border-dashed border-onyx-700 rounded-xl p-6 hover:border-onyx-500 cursor-pointer">
                    <p className="text-sm text-onyx-muted">Upload de Documentos (PDF)</p>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={closeModal} className="px-4 py-2 text-onyx-muted">Cancelar</button>
                    <button onClick={closeModal} className="px-6 py-2 bg-onyx-accent text-white rounded-lg">Enviar Solicitação</button>
                </div>
            </div>
        </BaseModal>
    )
}