
import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import { BaseModal } from '../ui/BaseModal';
import { MockApi } from '../../services/mockApi';
import { JobArea, JobLevel, JobType, Currency, RemoteType } from '../../types';
import { Plus, X, Loader2, DollarSign, Briefcase, MapPin } from 'lucide-react';

// --- Create / Edit Job ---
export const JobFormModal = () => {
  const { isOpen, closeModal, modalProps, openModal } = useModal();
  const { user } = useAuth();
  const isEdit = modalProps?.job != null;
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: modalProps?.job?.title || '',
    area: modalProps?.job?.area || 'Frontend' as JobArea,
    level: modalProps?.job?.level || 'MID' as JobLevel,
    type: modalProps?.job?.type || 'PJ' as JobType,
    currency: modalProps?.job?.currency || 'BRL' as Currency,
    salaryMin: modalProps?.job?.salaryMin || '',
    salaryMax: modalProps?.job?.salaryMax || '',
    location: modalProps?.job?.location || 'Remote',
    remoteType: modalProps?.job?.remoteType || 'GLOBAL' as RemoteType,
    description: modalProps?.job?.description || '',
    requirements: modalProps?.job?.requirements || [],
    benefits: modalProps?.job?.benefits || [],
    skills: modalProps?.job?.skills?.join(', ') || ''
  });

  // Helper Inputs State
  const [newReq, setNewReq] = useState('');
  const [newBen, setNewBen] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addItem = (field: 'requirements' | 'benefits', value: string, setter: (s: string) => void) => {
    if (!value.trim()) return;
    setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    setter('');
  };

  const removeItem = (field: 'requirements' | 'benefits', index: number) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const payload = {
            ...formData,
            salaryMin: Number(formData.salaryMin),
            salaryMax: Number(formData.salaryMax),
            skills: formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
            companyId: user?.id || 'c1',
            companyName: user?.name || 'Minha Empresa', // Fallback
            languages: [{ language: 'English', level: 'Advanced' }] // Default for mock
        };

        if (isEdit) {
            // Mock update logic would go here
            console.log("Updating", payload);
        } else {
            // @ts-ignore - Ignore type strictness for mock logic simplicity
            await MockApi.createJob(payload);
        }

        closeModal();
        openModal('FEEDBACK', { type: 'success', title: 'Sucesso!', message: isEdit ? 'Vaga atualizada.' : 'Sua vaga foi publicada e está ativa.' });
        
        // Force refresh of dashboard could be done via context or simple window reload in this mock architecture
        // window.location.reload(); 

    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={closeModal} title={isEdit ? 'Editar Vaga' : 'Publicar Nova Vaga'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
            <h3 className="text-sm uppercase font-bold text-onyx-muted border-b border-onyx-700 pb-2">Informações Principais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-onyx-muted mb-1">Título da Vaga</label>
                    <input 
                        name="title" 
                        required
                        value={formData.title} 
                        onChange={handleChange}
                        className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-onyx-accent placeholder-onyx-600" 
                        placeholder="Ex: Senior React Native Developer" 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-onyx-muted mb-1">Área</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onyx-muted"/>
                        <select name="area" value={formData.area} onChange={handleChange} className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 pl-10 text-white appearance-none">
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Fullstack">Fullstack</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Data_AI">Dados & IA</option>
                            <option value="Design">Design</option>
                            <option value="Product">Produto</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-onyx-muted mb-1">Nível</label>
                    <select name="level" value={formData.level} onChange={handleChange} className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 text-white">
                        <option value="INTERN">Estágio</option>
                        <option value="JUNIOR">Júnior</option>
                        <option value="MID">Pleno</option>
                        <option value="SENIOR">Sênior</option>
                        <option value="LEAD">Tech Lead</option>
                        <option value="C_LEVEL">C-Level</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Section 2: Contract & Location */}
        <div className="space-y-4">
             <h3 className="text-sm uppercase font-bold text-onyx-muted border-b border-onyx-700 pb-2">Contrato & Localização</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-onyx-muted mb-1">Tipo de Contrato</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 text-white">
                        <option value="PJ">PJ (B2B)</option>
                        <option value="CLT_BR">CLT Brasil</option>
                        <option value="CLT_INTL">Contrato Internacional</option>
                        <option value="FREELANCE">Freelance (Projeto)</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-onyx-muted mb-1">Modelo</label>
                    <select name="remoteType" value={formData.remoteType} onChange={handleChange} className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 text-white">
                        <option value="GLOBAL">100% Remoto (Global)</option>
                        <option value="LATAM">100% Remoto (Latam)</option>
                        <option value="BRAZIL_ONLY">100% Remoto (Brasil)</option>
                        <option value="HYBRID">Híbrido</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-onyx-muted mb-1">Localização (Cidade/País)</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onyx-muted"/>
                        <input name="location" value={formData.location} onChange={handleChange} className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 pl-10 text-white" />
                    </div>
                </div>
             </div>

             <div className="grid grid-cols-3 gap-4 bg-onyx-900/50 p-4 rounded-xl border border-onyx-700">
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-onyx-muted mb-1">Moeda</label>
                    <select name="currency" value={formData.currency} onChange={handleChange} className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 text-white">
                        <option value="BRL">R$ (Real)</option>
                        <option value="USD">USD (Dólar)</option>
                        <option value="EUR">EUR (Euro)</option>
                    </select>
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-onyx-muted mb-1">Mínimo</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-onyx-muted"/>
                        <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 pl-8 text-white" placeholder="5000" />
                    </div>
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-onyx-muted mb-1">Máximo</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-onyx-muted"/>
                        <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 pl-8 text-white" placeholder="8000" />
                    </div>
                </div>
             </div>
        </div>

        {/* Section 3: Details */}
        <div className="space-y-4">
            <h3 className="text-sm uppercase font-bold text-onyx-muted border-b border-onyx-700 pb-2">Detalhes da Vaga</h3>
            
            <div>
                <label className="block text-sm font-medium text-onyx-muted mb-1">Descrição Completa</label>
                <textarea 
                    name="description" 
                    rows={6} 
                    required
                    value={formData.description} 
                    onChange={handleChange}
                    className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-onyx-accent" 
                    placeholder="Descreva as responsabilidades, o projeto e a cultura da empresa..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-onyx-muted mb-1">Skills (separadas por vírgula)</label>
                <input 
                    name="skills" 
                    value={formData.skills} 
                    onChange={handleChange}
                    className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 text-white" 
                    placeholder="React, Node.js, AWS, TypeScript..." 
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Requirements List */}
                <div>
                    <label className="block text-sm font-medium text-onyx-muted mb-2">Requisitos</label>
                    <div className="flex gap-2 mb-2">
                        <input 
                            value={newReq} 
                            onChange={(e) => setNewReq(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('requirements', newReq, setNewReq))}
                            className="flex-1 bg-onyx-900 border border-onyx-700 rounded-lg p-2 text-sm text-white" 
                            placeholder="Ex: 3 anos de experiência..." 
                        />
                        <button type="button" onClick={() => addItem('requirements', newReq, setNewReq)} className="p-2 bg-onyx-700 hover:bg-onyx-600 rounded-lg text-white"><Plus className="w-4 h-4"/></button>
                    </div>
                    <ul className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                        {formData.requirements.map((req: string, i: number) => (
                            <li key={i} className="flex justify-between items-center bg-onyx-800 p-2 rounded text-sm text-onyx-300">
                                <span>{req}</span>
                                <button type="button" onClick={() => removeItem('requirements', i)} className="text-onyx-600 hover:text-red-400"><X className="w-3 h-3"/></button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Benefits List */}
                <div>
                    <label className="block text-sm font-medium text-onyx-muted mb-2">Benefícios</label>
                    <div className="flex gap-2 mb-2">
                        <input 
                            value={newBen} 
                            onChange={(e) => setNewBen(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('benefits', newBen, setNewBen))}
                            className="flex-1 bg-onyx-900 border border-onyx-700 rounded-lg p-2 text-sm text-white" 
                            placeholder="Ex: Plano de Saúde, Gympass..." 
                        />
                        <button type="button" onClick={() => addItem('benefits', newBen, setNewBen)} className="p-2 bg-onyx-700 hover:bg-onyx-600 rounded-lg text-white"><Plus className="w-4 h-4"/></button>
                    </div>
                    <ul className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                        {formData.benefits.map((ben: string, i: number) => (
                            <li key={i} className="flex justify-between items-center bg-onyx-800 p-2 rounded text-sm text-onyx-300">
                                <span>{ben}</span>
                                <button type="button" onClick={() => removeItem('benefits', i)} className="text-onyx-600 hover:text-red-400"><X className="w-3 h-3"/></button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-onyx-700">
          <button type="button" onClick={closeModal} className="px-6 py-2 text-onyx-muted hover:text-white transition-colors font-medium">Cancelar</button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-2 bg-onyx-accent hover:bg-onyx-accentHover text-white rounded-lg font-bold shadow-lg shadow-onyx-accent/20 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : isEdit ? 'Salvar Alterações' : 'Publicar Vaga'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

// --- Job Details (Quick View) ---
export const JobDetailsModal = () => {
  const { isOpen, closeModal, modalProps } = useModal();
  const { job } = modalProps || {};

  if (!job) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={closeModal} title="Detalhes da Vaga">
       <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img src={job.companyLogo} className="w-16 h-16 rounded-lg bg-onyx-900 object-cover" alt="logo" />
            <div>
              <h3 className="text-xl font-bold text-white">{job.title}</h3>
              <p className="text-onyx-muted">{job.companyName}</p>
            </div>
          </div>
          <p className="text-onyx-muted line-clamp-4 leading-relaxed">{job.description}</p>
          <div className="flex justify-end gap-3 pt-4">
             <button onClick={closeModal} className="px-4 py-2 text-onyx-muted hover:text-white">Fechar</button>
             <a href={`#/jobs/${job.id}`} onClick={closeModal} className="px-6 py-2 bg-onyx-accent text-white rounded-lg font-bold">Ver Completa</a>
          </div>
       </div>
    </BaseModal>
  );
}
