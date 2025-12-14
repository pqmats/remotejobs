import React, { useEffect, useState, useMemo } from 'react';
import { Application, CandidateStats, ApplicationStatus } from '../../types';
import { MockApi } from '../../services/mockApi';
import { 
  Briefcase, Send, MessageSquare, CheckCircle, XCircle, FileText, 
  Search, ChevronDown, Calendar, MoreHorizontal, ArrowUpRight,
  Filter, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';

// --- Components ---

const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
  const styles = {
    SAVED: 'bg-onyx-700 text-onyx-muted border-onyx-600',
    APPLIED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    INTERVIEW: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    OFFER: 'bg-green-500/10 text-green-400 border-green-500/20',
    REJECTED: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const labels = {
    SAVED: 'Salvo',
    APPLIED: 'Aplicado',
    INTERVIEW: 'Entrevista',
    OFFER: 'Oferta',
    REJECTED: 'Não Selec.'
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]} flex items-center gap-1.5 w-fit`}>
       <span className={`w-1.5 h-1.5 rounded-full ${status === 'SAVED' ? 'bg-gray-400' : 'bg-current'}`}></span>
       {labels[status]}
    </span>
  );
};

const Timeline = ({ status }: { status: ApplicationStatus }) => {
    const steps: ApplicationStatus[] = ['SAVED', 'APPLIED', 'INTERVIEW', 'OFFER'];
    const currentIdx = steps.indexOf(status);
    const isRejected = status === 'REJECTED';

    return (
        <div className="flex items-center gap-1 w-24">
            {steps.map((step, idx) => {
                let colorClass = 'bg-onyx-700';
                if (isRejected) colorClass = 'bg-red-900/30';
                else if (idx <= currentIdx) {
                    if (step === 'OFFER') colorClass = 'bg-green-500';
                    else if (step === 'INTERVIEW') colorClass = 'bg-yellow-500';
                    else if (step === 'APPLIED') colorClass = 'bg-blue-500';
                    else colorClass = 'bg-gray-500';
                }

                return (
                    <div key={step} className={`h-1.5 flex-1 rounded-full ${colorClass} transition-colors duration-300`} title={step} />
                )
            })}
        </div>
    )
}

const StatCard = ({ label, value, icon: Icon, colorClass, subtext }: any) => (
  <div className="bg-onyx-800 p-6 rounded-xl border border-onyx-700 flex items-start justify-between hover:border-onyx-600 transition-colors">
     <div>
        <p className="text-onyx-muted text-sm font-medium mb-1">{label}</p>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        {subtext && <p className="text-xs text-onyx-muted">{subtext}</p>}
     </div>
     <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="w-5 h-5" />
     </div>
  </div>
);

export const CandidateDashboard = () => {
  const [stats, setStats] = useState<CandidateStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  
  const { openModal } = useModal();

  useEffect(() => {
    Promise.all([
      MockApi.getCandidateStats(),
      MockApi.getApplications()
    ]).then(([s, apps]) => {
      setStats(s);
      setApplications(apps);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    await MockApi.updateApplicationStatus(id, newStatus);
  };

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
        const matchesSearch = app.job.title.toLowerCase().includes(search.toLowerCase()) || 
                              app.job.companyName.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  if (loading) return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-32 bg-onyx-800 rounded-xl animate-pulse"/>)}
          </div>
          <div className="h-96 bg-onyx-800 rounded-xl animate-pulse"/>
      </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-onyx-muted text-sm">Acompanhe seu progresso e gerencie suas candidaturas.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => openModal('PROPOSAL_TEMPLATE')} className="flex items-center gap-2 bg-onyx-800 border border-onyx-700 hover:bg-onyx-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <FileText className="w-4 h-4" /> Gerar Proposta
             </button>
             <Link to="/jobs" className="flex items-center gap-2 bg-onyx-accent hover:bg-onyx-accentHover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-onyx-accent/20">
                <Search className="w-4 h-4" /> Buscar Vagas
             </Link>
          </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
            label="Candidaturas Ativas" 
            value={applications.filter(a => ['APPLIED', 'INTERVIEW', 'OFFER'].includes(a.status)).length} 
            icon={Send} 
            colorClass="bg-blue-500/10 text-blue-400" 
            subtext="Últimos 30 dias"
        />
        <StatCard 
            label="Entrevistas" 
            value={applications.filter(a => a.status === 'INTERVIEW').length} 
            icon={MessageSquare} 
            colorClass="bg-yellow-500/10 text-yellow-400"
            subtext="Agendadas"
        />
        <StatCard 
            label="Taxa de Resposta" 
            value={`${stats?.responseRate}%`} 
            icon={CheckCircle} 
            colorClass="bg-green-500/10 text-green-400"
            subtext={`Avg: ${stats?.avgResponseTime} dias`}
        />
        <StatCard 
            label="Área de Foco" 
            value={stats?.topArea || 'N/A'} 
            icon={Briefcase} 
            colorClass="bg-purple-500/10 text-purple-400"
            subtext="Maior conversão"
        />
      </div>

      {/* Main Table Section */}
      <div className="bg-onyx-800 rounded-2xl border border-onyx-700 overflow-hidden shadow-2xl">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-onyx-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-onyx-800/50">
             <div className="flex items-center gap-2 w-full sm:w-auto">
                 <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onyx-muted" />
                    <input 
                        type="text" 
                        placeholder="Filtrar por empresa ou cargo..." 
                        className="w-full bg-onyx-900 border border-onyx-700 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-onyx-accent focus:ring-1 focus:ring-onyx-accent"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                 </div>
                 <div className="relative">
                    <select 
                        className="appearance-none bg-onyx-900 border border-onyx-700 rounded-lg py-2 pl-3 pr-8 text-sm text-white focus:border-onyx-accent focus:ring-1 focus:ring-onyx-accent cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                    >
                        <option value="ALL">Todos Status</option>
                        <option value="SAVED">Salvos</option>
                        <option value="APPLIED">Aplicados</option>
                        <option value="INTERVIEW">Entrevista</option>
                        <option value="OFFER">Oferta</option>
                        <option value="REJECTED">Arquivados</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-onyx-muted pointer-events-none" />
                 </div>
             </div>
             <div className="text-sm text-onyx-muted font-mono">
                 {filteredApps.length} registros
             </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-onyx-900/50 text-xs text-onyx-muted uppercase border-b border-onyx-700">
                        <th className="px-6 py-4 font-semibold">Vaga & Empresa</th>
                        <th className="px-6 py-4 font-semibold">Status Atual</th>
                        <th className="px-6 py-4 font-semibold">Progresso</th>
                        <th className="px-6 py-4 font-semibold">Atualizado em</th>
                        <th className="px-6 py-4 font-semibold text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-onyx-700">
                    {filteredApps.map((app) => (
                        <tr key={app.id} className="group hover:bg-onyx-700/20 transition-colors">
                            <td className="px-6 py-4 align-top">
                                <div className="flex items-center gap-4">
                                    <img src={app.job.companyLogo} alt="" className="w-10 h-10 rounded-lg bg-onyx-900 object-cover border border-onyx-700" />
                                    <div>
                                        <Link to={`/jobs/${app.job.id}`} className="font-medium text-white hover:text-onyx-accent transition-colors block mb-0.5">
                                            {app.job.title}
                                        </Link>
                                        <div className="text-sm text-onyx-muted flex items-center gap-1.5">
                                            {app.job.companyName}
                                            <span className="text-onyx-700">•</span>
                                            <span className="text-xs">{app.job.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 align-middle">
                                <div className="relative group/dropdown inline-block">
                                   <button className="flex items-center gap-2 hover:bg-onyx-700 rounded-lg pr-2 transition-colors">
                                      <StatusBadge status={app.status} />
                                      <ChevronDown className="w-3 h-3 text-onyx-muted opacity-0 group-hover/dropdown:opacity-100 transition-opacity" />
                                   </button>
                                   {/* Custom Dropdown (Simple implementation) */}
                                   <select 
                                      className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                      value={app.status}
                                      onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                                   >
                                      <option value="SAVED">Mover para Salvos</option>
                                      <option value="APPLIED">Marcar como Aplicado</option>
                                      <option value="INTERVIEW">Marcar Entrevista</option>
                                      <option value="OFFER">Registrar Oferta</option>
                                      <option value="REJECTED">Arquivar / Rejeitado</option>
                                   </select>
                                </div>
                            </td>
                            <td className="px-6 py-4 align-middle">
                                <Timeline status={app.status} />
                            </td>
                            <td className="px-6 py-4 align-middle text-sm text-onyx-muted">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5" />
                                    {new Date(app.appliedAt).toLocaleDateString()}
                                </div>
                            </td>
                            <td className="px-6 py-4 align-middle text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link to={`/jobs/${app.job.id}`} className="p-2 text-onyx-muted hover:text-white hover:bg-onyx-700 rounded-lg" title="Ver Vaga">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                    <button className="p-2 text-onyx-muted hover:text-white hover:bg-onyx-700 rounded-lg" title="Mais opções">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredApps.length === 0 && (
                        <tr>
                            <td colSpan={5} className="py-16 text-center text-onyx-muted">
                                <div className="mb-2">Nenhuma candidatura encontrada com os filtros atuais.</div>
                                <button onClick={() => {setSearch(''); setStatusFilter('ALL');}} className="text-onyx-accent hover:underline">Limpar filtros</button>
                            </td>
                        </tr>
                    )}
                </tbody>
             </table>
          </div>
      </div>
    </div>
  );
};