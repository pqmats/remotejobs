import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Job } from '../types';
import { MockApi } from '../services/mockApi';
import { ArrowLeft, MapPin, DollarSign, Clock, Share2, Bookmark, Lock } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';

export const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { openModal } = useModal();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      MockApi.getJobById(id).then(data => {
        setJob(data || null);
        setIsLoading(false);
      });
    }
  }, [id]);

  const handleApply = () => {
    if (!isAuthenticated) {
      // Option 1: Redirect to login
      navigate('/login');
      // Option 2: Could show a toast/modal, but redirect is standard.
      return;
    }
    if (job) {
      openModal('APPLY_JOB', { jobTitle: job.title });
    }
  };

  if (isLoading) return <div className="p-10 text-center text-onyx-muted">Carregando vaga...</div>;
  if (!job) return <div className="p-10 text-center text-red-500">Vaga não encontrada.</div>;

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: job.currency });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/jobs" className="inline-flex items-center text-onyx-muted hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para vagas
      </Link>

      <div className="bg-onyx-800 rounded-2xl border border-onyx-700 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-onyx-700">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex gap-6">
              <img src={job.companyLogo} alt={job.companyName} className="w-20 h-20 rounded-xl bg-onyx-900 object-cover border border-onyx-600" />
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{job.title}</h1>
                <div className="text-lg text-onyx-muted mb-4">{job.companyName}</div>
                
                <div className="flex flex-wrap gap-4 text-sm">
                   <div className="flex items-center gap-1.5 text-onyx-muted bg-onyx-900 px-3 py-1 rounded-md">
                      <MapPin className="w-4 h-4" /> {job.location}
                   </div>
                   <div className="flex items-center gap-1.5 text-green-400 bg-green-400/10 px-3 py-1 rounded-md font-medium border border-green-400/20">
                      <DollarSign className="w-4 h-4" /> {formatter.format(job.salaryMin)} - {formatter.format(job.salaryMax)}
                   </div>
                   <div className="flex items-center gap-1.5 text-onyx-muted bg-onyx-900 px-3 py-1 rounded-md">
                      <Clock className="w-4 h-4" /> {job.type.replace('_', ' ')}
                   </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-onyx-muted hover:text-white bg-onyx-700/50 hover:bg-onyx-700 rounded-lg transition-colors" title="Salvar">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 text-onyx-muted hover:text-white bg-onyx-700/50 hover:bg-onyx-700 rounded-lg transition-colors" title="Compartilhar">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-10">
            <section>
              <h3 className="text-xl font-semibold text-white mb-4">Sobre a Vaga</h3>
              <p className="text-onyx-muted leading-relaxed whitespace-pre-line text-base">{job.description}</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">Requisitos</h3>
              <ul className="space-y-3 text-onyx-muted">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                     <span className="w-1.5 h-1.5 rounded-full bg-onyx-accent mt-2 flex-shrink-0"></span>
                     <span className="flex-1">{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="space-y-6">
             <div className="bg-onyx-900 rounded-xl p-6 border border-onyx-700">
               <h4 className="font-semibold text-white mb-4">Benefícios</h4>
               <ul className="space-y-3">
                 {job.benefits.map((benefit, i) => (
                   <li key={i} className="flex items-start gap-2 text-sm text-onyx-muted">
                     <span className="text-green-500 mt-0.5">✓</span> {benefit}
                   </li>
                 ))}
               </ul>
             </div>

             <div className="bg-onyx-900 rounded-xl p-6 border border-onyx-700">
               <h4 className="font-semibold text-white mb-4">Tech Stack</h4>
               <div className="flex flex-wrap gap-2">
                 {job.skills.map(skill => (
                   <span key={skill} className="text-xs font-medium text-onyx-muted bg-onyx-800 border border-onyx-700 px-3 py-1.5 rounded-md">
                     {skill}
                   </span>
                 ))}
               </div>
             </div>

             <button 
                onClick={handleApply}
                className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                  isAuthenticated 
                  ? 'bg-onyx-accent hover:bg-onyx-accentHover text-white shadow-onyx-accent/20' 
                  : 'bg-onyx-700 hover:bg-onyx-600 text-onyx-muted hover:text-white'
                }`}
             >
               {isAuthenticated ? (
                 'Candidatar-se Agora'
               ) : (
                 <>
                   <Lock className="w-4 h-4" /> Faça Login para Aplicar
                 </>
               )}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};