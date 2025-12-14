import React, { useEffect, useState } from 'react';
import { AdminStats } from '../../types';
import { MockApi } from '../../services/mockApi';
import { Shield, TrendingUp, Users, DollarSign, AlertTriangle, Check, X } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

export const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const { openModal } = useModal();

  useEffect(() => {
    MockApi.getAdminStats().then(setStats);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
           <Shield className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
          <p className="text-onyx-muted">Visão geral da plataforma e moderação.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-onyx-800 p-6 rounded-xl border border-onyx-700">
           <div className="flex justify-between mb-4">
              <span className="text-onyx-muted text-sm">Usuários Totais</span>
              <Users className="w-5 h-5 text-blue-500" />
           </div>
           <div className="text-3xl font-bold text-white">{stats?.totalUsers.toLocaleString()}</div>
        </div>
        <div className="bg-onyx-800 p-6 rounded-xl border border-onyx-700">
           <div className="flex justify-between mb-4">
              <span className="text-onyx-muted text-sm">Vagas Ativas</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
           </div>
           <div className="text-3xl font-bold text-white">{stats?.activeJobs}</div>
        </div>
        <div className="bg-onyx-800 p-6 rounded-xl border border-onyx-700">
           <div className="flex justify-between mb-4">
              <span className="text-onyx-muted text-sm">Receita Mensal</span>
              <DollarSign className="w-5 h-5 text-green-400" />
           </div>
           <div className="text-3xl font-bold text-white">R$ {stats?.monthlyRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-onyx-800 p-6 rounded-xl border border-onyx-700">
           <div className="flex justify-between mb-4">
              <span className="text-onyx-muted text-sm">Verificações Pendentes</span>
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
           </div>
           <div className="text-3xl font-bold text-white">{stats?.pendingVerifications}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Moderation Queue */}
         <div className="bg-onyx-800 rounded-xl border border-onyx-700 p-6">
            <h2 className="font-bold text-white mb-6">Fila de Moderação de Vagas</h2>
            <div className="space-y-4">
               {[1, 2, 3].map(i => (
                  <div key={i} className="bg-onyx-900 p-4 rounded-lg flex justify-between items-start">
                     <div>
                        <h4 className="font-medium text-white">Senior Java Developer</h4>
                        <p className="text-sm text-onyx-muted">Tech Solutions LTDA • Postado há 2h</p>
                        <div className="mt-2 flex gap-2">
                           <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded">Suspeita de Spam</span>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => openModal('MODERATE_JOB')} className="p-2 bg-green-500/10 text-green-500 rounded hover:bg-green-500/20"><Check className="w-4 h-4"/></button>
                        <button onClick={() => openModal('MODERATE_JOB')} className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20"><X className="w-4 h-4"/></button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Verification Requests */}
         <div className="bg-onyx-800 rounded-xl border border-onyx-700 p-6">
            <h2 className="font-bold text-white mb-6">Solicitações de Empresa Verificada</h2>
            <div className="space-y-4">
               {[1, 2].map(i => (
                  <div key={i} className="bg-onyx-900 p-4 rounded-lg flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-onyx-800 rounded-full"></div>
                        <div>
                           <h4 className="font-medium text-white">DevHouse Inc.</h4>
                           <p className="text-xs text-onyx-muted">CNPJ: 12.345.678/0001-90</p>
                        </div>
                     </div>
                     <button onClick={() => openModal('MODERATE_JOB')} className="text-xs text-onyx-accent hover:underline">Ver documentos</button>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};