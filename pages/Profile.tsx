
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Github, Linkedin, Globe, MapPin, Mail, Settings, Edit3, ChevronDown, ChevronUp, Briefcase, FileText, Download, Trash2, Calendar } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { FileUpload } from '../components/ui/FileUpload';
import { MockApi } from '../services/mockApi';

const ProfileSection = ({ title, children, defaultOpen = true }: { title: string, children?: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-onyx-800 rounded-2xl border border-onyx-700 overflow-hidden mb-8 shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-8 hover:bg-onyx-700/30 transition-colors text-left"
      >
        <h3 className="font-bold text-white text-xl">{title}</h3>
        {isOpen ? <ChevronUp className="w-6 h-6 text-onyx-muted" /> : <ChevronDown className="w-6 h-6 text-onyx-muted" />}
      </button>
      {isOpen && (
        <div className="px-8 pb-8 animate-in slide-in-from-top-2">
            {children}
        </div>
      )}
    </div>
  );
};

export const Profile = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { openModal } = useModal();
  const [isUploadingCV, setIsUploadingCV] = useState(false);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  const handleCVUpload = async (file: File) => {
      setIsUploadingCV(true);
      try {
          const url = await MockApi.uploadFile(file);
          
          updateUser({
              resume: {
                  url: url,
                  filename: file.name,
                  uploadedAt: new Date().toISOString(),
                  size: file.size
              }
          });
          
          openModal('FEEDBACK', { type: 'success', title: 'Currículo Enviado', message: 'Seu currículo foi salvo e está pronto para uso.' });

      } catch (e: any) {
          openModal('FEEDBACK', { type: 'error', title: 'Erro', message: e.message || 'Falha no upload.' });
      } finally {
          setIsUploadingCV(false);
      }
  };

  const handleCVDelete = () => {
      openModal('CONFIRMATION', {
          title: 'Excluir Currículo',
          description: 'Tem certeza? Você precisará enviar um novo arquivo para se candidatar.',
          isDestructive: true,
          onConfirm: () => {
             updateUser({ resume: undefined });
          }
      });
  };

  const formatBytes = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Profile Card */}
      <div className="bg-onyx-800 rounded-3xl border border-onyx-700 p-0 mb-12 relative overflow-hidden shadow-2xl">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-onyx-900 to-onyx-800 relative">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
             <div className="absolute inset-0 bg-gradient-to-r from-onyx-accent/20 to-purple-600/20"></div>
             <button 
                 onClick={() => openModal('EDIT_PROFILE')}
                 className="absolute top-6 right-6 bg-black/30 hover:bg-black/50 backdrop-blur text-white p-2.5 rounded-xl border border-white/10 transition-colors"
                 title="Editar Capa"
             >
                  <Settings className="w-5 h-5" />
             </button>
        </div>
        
        <div className="px-10 pb-10">
            <div className="relative flex flex-col md:flex-row items-end -mt-20 gap-8">
                <div className="relative">
                    <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    className="w-40 h-40 rounded-3xl border-4 border-onyx-800 bg-onyx-900 object-cover shadow-2xl" 
                    />
                    <div className="absolute bottom-1 right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-onyx-800" title="Online"></div>
                </div>
                
                <div className="flex-1 min-w-0 pt-4 md:pt-0 text-center md:text-left">
                    <h1 className="text-4xl font-bold text-white mb-2 truncate">{user.name}</h1>
                    <p className="text-xl text-onyx-accent font-medium mb-4">
                        {user.role === 'CANDIDATE' ? 'Desenvolvedor Full-Stack Senior' : 'Recrutador Técnico'}
                    </p>
                    
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-sm text-onyx-muted">
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4"/> São Paulo, SP (Remoto)</span>
                        <span className="flex items-center gap-2"><Mail className="w-4 h-4"/> {user.email}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full md:w-auto">
                    <button 
                    onClick={() => openModal('EDIT_PROFILE')}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-onyx-accent hover:bg-onyx-accentHover text-white rounded-xl font-bold transition-colors shadow-lg shadow-onyx-accent/20 whitespace-nowrap"
                    >
                    <Edit3 className="w-4 h-4" /> Editar Perfil
                    </button>
                    <div className="flex gap-3 justify-center">
                        {user.links?.github && (
                            <a href={user.links.github} target="_blank" rel="noreferrer" className="p-3 bg-onyx-900 border border-onyx-700 rounded-xl hover:text-white text-onyx-muted hover:border-onyx-600 transition-all"><Github className="w-5 h-5" /></a>
                        )}
                        {user.links?.linkedin && (
                            <a href={user.links.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-onyx-900 border border-onyx-700 rounded-xl hover:text-white text-onyx-muted hover:border-onyx-600 transition-all"><Linkedin className="w-5 h-5" /></a>
                        )}
                        {user.links?.portfolio && (
                            <a href={user.links.portfolio} target="_blank" rel="noreferrer" className="p-3 bg-onyx-900 border border-onyx-700 rounded-xl hover:text-white text-onyx-muted hover:border-onyx-600 transition-all"><Globe className="w-5 h-5" /></a>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column (Info) */}
        <div className="lg:col-span-8 space-y-4">
            
            {/* New Resume Section */}
            {user.role === 'CANDIDATE' && (
                <ProfileSection title="Documentos & Currículo">
                    {user.resume ? (
                        <div className="bg-onyx-900 border border-onyx-700 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 shrink-0">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">{user.resume.filename}</h4>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-onyx-muted mt-1">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> {new Date(user.resume.uploadedAt).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{formatBytes(user.resume.size)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <a 
                                    href={user.resume.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-onyx-800 border border-onyx-700 hover:bg-onyx-700 text-white rounded-lg transition-colors"
                                >
                                    <Download className="w-4 h-4" /> Download
                                </a>
                                <button 
                                    onClick={handleCVDelete}
                                    className="p-2.5 text-onyx-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                    title="Excluir Currículo"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                         <div className="bg-onyx-900/50 rounded-xl">
                             <FileUpload 
                                label="Upload de Currículo (CV)"
                                accept=".pdf"
                                maxSizeMB={10}
                                onFileSelect={handleCVUpload}
                                isLoading={isUploadingCV}
                             />
                         </div>
                    )}
                </ProfileSection>
            )}

            <ProfileSection title="Sobre Mim">
                <div className="prose prose-invert max-w-none text-onyx-muted leading-relaxed text-lg max-h-80 overflow-y-auto custom-scrollbar pr-4">
                    {user.bio ? user.bio.split('\n').map((line, i) => <p key={i} className="mb-4">{line}</p>) : <p className="italic opacity-50">Nenhuma biografia adicionada.</p>}
                </div>
            </ProfileSection>

            <ProfileSection title="Experiência Profissional">
                 <div className="space-y-8">
                    {/* Mock Experience Items */}
                    <div className="flex gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/10 shadow-inner flex-shrink-0">
                            <Briefcase className="w-7 h-7" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-xl">Senior Frontend Engineer</h4>
                            <p className="text-onyx-accent font-medium text-lg">TechFlow Inc • Remoto</p>
                            <p className="text-sm text-onyx-muted mb-3 mt-1">Jan 2022 - Presente</p>
                            <p className="text-base text-onyx-muted/80 leading-relaxed">Liderança técnica do time de frontend, migração para Next.js 14 e implementação de Design System. Responsável pela arquitetura e code review.</p>
                        </div>
                    </div>
                 </div>
            </ProfileSection>
        </div>

        {/* Right Column (Sidebar Info) */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-onyx-800 rounded-3xl border border-onyx-700 p-8 sticky top-24 shadow-xl">
              <h3 className="font-bold text-white mb-6 text-lg">Skills & Tecnologias</h3>
              <div className="flex flex-wrap gap-2.5 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                {user.skills && user.skills.length > 0 ? (
                    user.skills.map(skill => (
                    <span key={skill} className="px-4 py-2 rounded-xl bg-onyx-900 border border-onyx-700 text-sm font-medium text-onyx-muted hover:text-white hover:border-onyx-600 transition-colors cursor-default">
                        {skill}
                    </span>
                    ))
                ) : (
                    <p className="text-sm text-onyx-muted italic">Nenhuma skill adicionada.</p>
                )}
              </div>
              
              <div className="mt-10 pt-8 border-t border-onyx-700">
                  <h3 className="font-bold text-white mb-6 text-lg">Idiomas</h3>
                  <div className="space-y-4">
                      <div className="flex justify-between items-center text-base">
                          <span className="text-white">Português</span>
                          <span className="text-onyx-muted bg-onyx-900 px-3 py-1 rounded-lg text-xs font-semibold tracking-wide">NATIVO</span>
                      </div>
                      <div className="flex justify-between items-center text-base">
                          <span className="text-white">Inglês</span>
                          <span className="text-onyx-accent bg-onyx-accent/10 px-3 py-1 rounded-lg text-xs font-semibold tracking-wide border border-onyx-accent/20">FLUENTE</span>
                      </div>
                  </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
