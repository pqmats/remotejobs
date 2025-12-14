import React, { useEffect, useState } from 'react';
import { CompanyStats, Job } from '../../types';
import { MockApi } from '../../services/mockApi';
import { Eye, Users, FileText, CheckCircle, MoreVertical, Edit2, PauseCircle, Trash, Plus, Shield } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

export const CompanyDashboard = () => {
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const { openModal } = useModal();

  useEffect(() => {
    Promise.all([
      MockApi.getCompanyStats(),
      MockApi.getCompanyJobs('c1')
    ]).then(([s, j]) => {
      setStats(s);
      setJobs(j);
    });
  }, []);

  const handleDelete = (jobId: string) => {
    openModal('CONFIRMATION', {
        title: 'Excluir Vaga',
        description: 'Tem certeza? Essa ação não pode ser desfeita e perderá todos os dados de candidatos.',
        isDestructive: true,
        confirmText: 'Excluir',
        onConfirm: () => {
            setJobs(prev => prev.filter(j => j.id !== jobId));
            openModal('FEEDBACK', { type: 'success', title: 'Sucesso', message: 'Vaga excluída com sucesso.' });
        }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Painel da Empresa</h1>
          <p className="text-onyx-muted mt-1">Gerencie suas vagas e acompanhe métricas.</p>
        </div>
        <div className="flex gap-3">
            <button onClick={() => openModal('VERIFY_COMPANY')} className="flex items-center gap-2 bg-onyx-800 border border-onyx-700 hover:bg-onyx-700 text-white px-4 py-2 rounded-lg font-medium">
                <Shield className="w-4 h-4" /> Verificar
            </button>
            <button onClick={() => openModal('CREATE_JOB')} className="flex items-center gap-2 bg-onyx-accent hover:bg-onyx-accentHover text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-onyx-accent/20">
                <Plus className="w-4 h-4" /> Nova Vaga
            </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 cursor-pointer" onClick={() => openModal('PLAN_PAYMENT')}>
        <div className="bg-onyx-800 p-6 rounded-xl border border-onyx-700 flex items-center gap-4 hover:border-onyx-accent transition-colors">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><FileText className="w-6 h-6"/></div>
          <div><div className="text-2xl font-bold text-white">{stats?.activeJobs}</div><div className="text-xs text-onyx-muted">Vagas Ativas</div></div>
        </div>
        {/* ... other stats remain same just purely visual ... */}
        <div className="bg-onyx-800 p-6 rounded-xl border border-onyx-700 flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-lg text-green-500"><Eye className="w-6 h-6"/></div>
          <div><div className="text-2xl font-bold text-white">{stats?.totalViews}</div><div className="text-xs text-onyx-muted">Visualizações</div></div>
        </div>
        <div className="bg-onyx-800 p-6 rounded-xl border border-onyx-700 flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500"><Users className="w-6 h-6"/></div>
          <div><div className="text-2xl font-bold text-white">{stats?.totalApplications}</div><div className="text-xs text-onyx-muted">Candidaturas</div></div>
        </div>
        <div className="bg-onyx-800 p-6 rounded-xl border border-onyx-700 flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500"><CheckCircle className="w-6 h-6"/></div>
          <div><div className="text-2xl font-bold text-white">{stats?.conversionRate}%</div><div className="text-xs text-onyx-muted">Conversão</div></div>
        </div>
      </div>

      {/* Job List */}
      <div className="bg-onyx-800 rounded-xl border border-onyx-700 overflow-hidden">
        <div className="p-6 border-b border-onyx-700">
          <h2 className="font-bold text-white">Vagas Recentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-onyx-900 text-xs text-onyx-muted uppercase">
              <tr>
                <th className="px-6 py-4">Vaga</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Candidatos</th>
                <th className="px-6 py-4">Publicado em</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-onyx-700">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-onyx-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{job.title}</div>
                    <div className="text-sm text-onyx-muted">{job.location}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      job.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                      job.status === 'PAUSED' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                      'bg-onyx-700 text-onyx-muted'
                    }`}>
                      {job.status}
                    </span>
                    {job.sponsored && <span className="ml-2 px-2 py-1 rounded text-xs bg-onyx-accent/10 text-onyx-accent border border-onyx-accent/20">Impulsionada</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-onyx-700 border-2 border-onyx-800 flex items-center justify-center text-xs text-white">
                           {String.fromCharCode(64+i)}
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-onyx-900 border-2 border-onyx-800 flex items-center justify-center text-xs text-onyx-muted">+12</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-onyx-muted">
                    {new Date(job.postedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal('EDIT_JOB', { job })} className="p-2 text-onyx-muted hover:text-white hover:bg-onyx-700 rounded transition-colors"><Edit2 className="w-4 h-4"/></button>
                      <button className="p-2 text-onyx-muted hover:text-white hover:bg-onyx-700 rounded transition-colors"><PauseCircle className="w-4 h-4"/></button>
                      <button onClick={() => handleDelete(job.id)} className="p-2 text-onyx-muted hover:text-red-400 hover:bg-onyx-700 rounded transition-colors"><Trash className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};