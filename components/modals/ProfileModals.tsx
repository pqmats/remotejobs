
import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import { BaseModal } from '../ui/BaseModal';
import { Linkedin, Github, Globe } from 'lucide-react';
import { FileUpload } from '../ui/FileUpload';
import { MockApi } from '../../services/mockApi';

export const EditProfileModal = () => {
  const { isOpen, closeModal, openModal } = useModal();
  const { user, updateUser } = useAuth();
  
  // Local state initialized with user data
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
    skills: user?.skills?.join(', ') || '',
    linkedin: user?.links?.linkedin || '',
    github: user?.links?.github || '',
    portfolio: user?.links?.portfolio || ''
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
        let finalAvatarUrl = formData.avatarUrl;

        // Handle Avatar Upload if a new file was selected
        if (avatarFile) {
            finalAvatarUrl = await MockApi.uploadFile(avatarFile);
        }

        // Update User via Context to trigger re-renders everywhere
        updateUser({
          name: formData.name,
          bio: formData.bio,
          avatarUrl: finalAvatarUrl,
          skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
          links: {
            linkedin: formData.linkedin,
            github: formData.github,
            portfolio: formData.portfolio
          }
        });
        
        closeModal();
        openModal('FEEDBACK', { 
            type: 'success', 
            title: 'Perfil Atualizado', 
            message: 'Suas informações foram salvas com sucesso.' 
        });

    } catch (error) {
        console.error("Erro ao salvar perfil", error);
        openModal('FEEDBACK', { 
            type: 'error', 
            title: 'Erro', 
            message: 'Não foi possível salvar as alterações.' 
        });
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={closeModal} title="Editar Perfil" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Avatar Section - Using FileUpload */}
        <div className="flex justify-center pb-6 border-b border-onyx-700">
            <FileUpload 
                label="Foto de Perfil"
                accept="image/png, image/jpeg, image/webp"
                maxSizeMB={5}
                variant="avatar"
                currentFileUrl={formData.avatarUrl}
                onFileSelect={(file) => setAvatarFile(file)}
                onRemove={() => {
                    setAvatarFile(null);
                    setFormData(prev => ({...prev, avatarUrl: ''}));
                }}
                isLoading={isUploading}
            />
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-onyx-muted mb-2">Nome Completo</label>
            <input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-onyx-accent" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-onyx-muted mb-2">Bio / Resumo Profissional</label>
            <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-onyx-accent" 
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-onyx-muted mb-2">Skills (separadas por vírgula)</label>
             <input 
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-onyx-accent"
                placeholder="React, TypeScript, Node.js..."
             />
          </div>
        </div>

        {/* Social Links */}
        <div className="pt-4 border-t border-onyx-700">
           <h3 className="text-white font-medium mb-4">Links & Redes Sociais</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                 <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onyx-muted" />
                 <input 
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full bg-onyx-900 border border-onyx-700 rounded-lg py-3 pl-10 pr-3 text-white text-sm focus:ring-2 focus:ring-onyx-accent"
                    placeholder="LinkedIn URL"
                 />
              </div>
              <div className="relative">
                 <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onyx-muted" />
                 <input 
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    className="w-full bg-onyx-900 border border-onyx-700 rounded-lg py-3 pl-10 pr-3 text-white text-sm focus:ring-2 focus:ring-onyx-accent"
                    placeholder="GitHub URL"
                 />
              </div>
              <div className="relative">
                 <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onyx-muted" />
                 <input 
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    className="w-full bg-onyx-900 border border-onyx-700 rounded-lg py-3 pl-10 pr-3 text-white text-sm focus:ring-2 focus:ring-onyx-accent"
                    placeholder="Portfólio URL"
                 />
              </div>
           </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <button type="button" onClick={closeModal} className="px-4 py-2 text-onyx-muted hover:text-white transition-colors">Cancelar</button>
          <button 
            type="submit" 
            disabled={isUploading}
            className="px-6 py-2 bg-onyx-accent hover:bg-onyx-accentHover text-white rounded-lg font-medium shadow-lg shadow-onyx-accent/20 flex items-center gap-2"
          >
            {isUploading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};
