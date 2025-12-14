
import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import { BaseModal } from '../ui/BaseModal';
import { Upload, Bell, FileText, Download, CheckCircle, File, Loader2 } from 'lucide-react';
import { FileUpload } from '../ui/FileUpload';
import { MockApi } from '../../services/mockApi';

// --- Apply Modal ---
export const ApplyModal = () => {
  const { isOpen, closeModal, modalProps } = useModal();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [useStoredCV, setUseStoredCV] = useState(true);
  
  // New file state
  const [newFile, setNewFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async () => {
      setIsUploading(true);
      try {
          // If uploading new file, simulate upload first
          if (!useStoredCV && newFile) {
              await MockApi.uploadFile(newFile);
          }
          // Simulate API delay for application
          await new Promise(r => setTimeout(r, 1000));
          setStep(2);
      } catch (e) {
          console.error(e);
      } finally {
          setIsUploading(false);
      }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={closeModal} title={`Candidatar-se: ${modalProps?.jobTitle}`}>
      {step === 1 ? (
        <div className="space-y-6">
          
          {/* CV Selection Logic */}
          <div>
              <label className="block text-sm font-medium text-onyx-muted mb-3">Currículo</label>
              
              {user?.resume && useStoredCV ? (
                  <div className="space-y-3">
                    <div className="bg-onyx-900 border border-green-500/30 rounded-xl p-4 flex items-center justify-between animate-in fade-in">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded text-red-500">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm">{user.resume.filename}</p>
                                <p className="text-xs text-green-500 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Usar currículo do perfil</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setUseStoredCV(false)} className="text-xs text-onyx-muted hover:text-white underline">
                        Quero enviar um arquivo diferente para esta vaga
                    </button>
                  </div>
              ) : (
                  <div className="space-y-3 animate-in fade-in">
                     <FileUpload 
                        label="Upload de Currículo Específico"
                        accept=".pdf,.doc,.docx"
                        maxSizeMB={5}
                        onFileSelect={(file) => setNewFile(file)}
                        onRemove={() => setNewFile(null)}
                     />
                     {user?.resume && (
                        <button onClick={() => { setUseStoredCV(true); setNewFile(null); }} className="text-xs text-onyx-accent hover:underline block">
                            Voltar e usar meu currículo do perfil ({user.resume.filename})
                        </button>
                    )}
                  </div>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium text-onyx-muted mb-2">Carta de Apresentação (Opcional)</label>
            <textarea className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 text-white h-32 focus:ring-2 focus:ring-onyx-accent" placeholder="Conte porque você é ideal para essa vaga..."></textarea>
          </div>
          
          <button 
            onClick={handleSubmit} 
            disabled={isUploading || (!useStoredCV && !newFile)}
            className="w-full py-3 bg-onyx-accent text-white rounded-lg font-bold hover:bg-onyx-accentHover transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Enviar Candidatura'}
          </button>
        </div>
      ) : (
        <div className="text-center py-10 animate-in zoom-in-95">
          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Candidatura Enviada!</h3>
          <p className="text-onyx-muted mb-6">A empresa receberá seu perfil e entrará em contato.</p>
          <button onClick={closeModal} className="px-6 py-2 bg-onyx-700 text-white rounded-lg hover:bg-onyx-600 transition-colors">Fechar</button>
        </div>
      )}
    </BaseModal>
  );
};

// --- Alert Modal ---
export const CreateAlertModal = () => {
  const { isOpen, closeModal } = useModal();

  return (
    <BaseModal isOpen={isOpen} onClose={closeModal} title="Novo Alerta de Vagas" size="sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-onyx-muted mb-2">Nome do Alerta</label>
          <input type="text" className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 text-white" placeholder="Ex: React Remoto" />
        </div>
        <div>
          <label className="block text-sm font-medium text-onyx-muted mb-2">Área</label>
          <select className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 text-white">
            <option>Development</option>
            <option>Design</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-onyx-muted mb-2">Frequência</label>
          <div className="flex gap-4">
             <label className="flex items-center gap-2 text-white"><input type="radio" name="freq" defaultChecked /> Diário</label>
             <label className="flex items-center gap-2 text-white"><input type="radio" name="freq" /> Semanal</label>
          </div>
        </div>
        <button onClick={closeModal} className="w-full py-3 bg-onyx-accent text-white rounded-lg font-bold mt-4 flex items-center justify-center gap-2">
           <Bell className="w-4 h-4" /> Criar Alerta
        </button>
      </div>
    </BaseModal>
  );
};

// --- Proposal Template Modal ---
export const ProposalTemplateModal = () => {
    const { isOpen, closeModal } = useModal();
    
    return (
        <BaseModal isOpen={isOpen} onClose={closeModal} title="Gerador de Proposta" size="lg">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <button className="p-4 bg-onyx-900 border border-onyx-accent rounded-lg text-white font-medium">Freelance Básico</button>
                    <button className="p-4 bg-onyx-900 border border-onyx-700 rounded-lg text-onyx-muted hover:border-onyx-600">Cover Letter (EN)</button>
                </div>
                <div className="bg-onyx-900 p-4 rounded-lg border border-onyx-700 font-mono text-sm text-onyx-muted h-64 overflow-y-auto">
                    <p>Olá [Nome do Cliente],</p>
                    <br/>
                    <p>Vi sua vaga sobre [Nome do Projeto] e fiquei muito interessado. Tenho X anos de experiência com...</p>
                    <br/>
                    <p>Minha proposta inclui:</p>
                    <ul className="list-disc pl-4">
                        <li>Entregável 1</li>
                        <li>Entregável 2</li>
                    </ul>
                    <br/>
                    <p>Valor total: R$ [Valor]</p>
                </div>
                <div className="flex justify-end gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-onyx-700 text-white rounded-lg">
                        <FileText className="w-4 h-4" /> Copiar Texto
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-onyx-accent text-white rounded-lg">
                        <Download className="w-4 h-4" /> Exportar PDF
                    </button>
                </div>
            </div>
        </BaseModal>
    )
}
