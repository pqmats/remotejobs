
import React, { useEffect, useState, useCallback } from 'react';
import { JobCard } from '../components/JobCard';
import { Job } from '../types';
import { MockApi, JobFilters } from '../services/mockApi';
import { useJobFilters } from '../hooks/useJobFilters';
import { JobFilterSidebar } from '../components/filters/JobFilterSidebar';
import { Search, Filter, X } from 'lucide-react';

export const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Custom Hook now mainly serves as URL state manager
  const { filters, setSingleFilter, updateAllFilters } = useJobFilters();

  // Fetch jobs only when 'filters' (URL) changes
  useEffect(() => {
    setIsLoading(true);
    MockApi.getJobs(filters).then(data => {
      setJobs(data);
      setIsLoading(false);
    });
  }, [filters]);

  // Handler for the "Apply" button in Sidebar
  const handleApplyFilters = useCallback((newFilters: JobFilters) => {
    updateAllFilters(newFilters);
    setShowMobileFilters(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updateAllFilters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)] flex flex-col">
      {/* Search Header */}
      <div className="mb-8 flex-shrink-0">
            <div className="relative group max-w-3xl mx-auto">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-onyx-accent to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              
              <div className="relative flex items-center bg-onyx-900 border border-onyx-700 rounded-xl shadow-2xl">
                  <div className="pl-5 pr-3 text-onyx-muted">
                      <Search className="w-6 h-6" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Busque por cargo, empresa, tecnologia..." 
                    className="w-full bg-transparent border-none text-white text-lg placeholder-onyx-500 focus:ring-0 py-5 px-2"
                    value={filters.query}
                    onChange={(e) => setSingleFilter('query', e.target.value)}
                  />
                  <div className="pr-2 hidden sm:block">
                      <span className="text-xs bg-onyx-800 border border-onyx-700 text-onyx-muted px-2 py-1 rounded">CMD + K</span>
                  </div>
              </div>
            </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4 flex-shrink-0">
        <button 
          onClick={() => setShowMobileFilters(true)}
          className="w-full flex items-center justify-center gap-2 bg-onyx-800 border border-onyx-700 py-3 rounded-xl text-white font-medium hover:border-onyx-accent transition-colors"
        >
          <Filter className="w-4 h-4" /> Filtros Avançados
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex md:hidden">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
           <div className="relative w-[90%] max-w-sm bg-onyx-900 h-full p-6 border-r border-onyx-700 flex flex-col">
              <div className="flex justify-between items-center mb-6 flex-shrink-0">
                 <h2 className="text-xl font-bold text-white">Filtros</h2>
                 <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-onyx-800 rounded-full"><X className="w-6 h-6 text-onyx-muted" /></button>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <JobFilterSidebar 
                    initialFilters={filters} 
                    onApply={handleApplyFilters}
                    resultCount={jobs.length}
                />
              </div>
           </div>
        </div>
      )}

      <div className="flex flex-1 min-h-0 gap-8">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-72 shrink-0 h-full">
           <div className="bg-onyx-900 border border-onyx-700 rounded-xl p-4 h-full flex flex-col overflow-hidden shadow-2xl">
              <JobFilterSidebar 
                initialFilters={filters} 
                onApply={handleApplyFilters}
                resultCount={jobs.length}
              />
           </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
          {/* Active Filter Summary */}
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
             <p className="text-sm text-onyx-muted">
               <span className="text-white font-bold">{jobs.length}</span> vagas encontradas
             </p>
             <div className="flex items-center gap-2">
                <span className="text-xs text-onyx-muted hidden sm:inline">Ordenar:</span>
                <select className="bg-onyx-800 border border-onyx-700 text-xs text-white rounded-lg px-3 py-2 focus:ring-0 cursor-pointer hover:border-onyx-500 outline-none">
                   <option>Relevância</option>
                   <option>Mais recentes</option>
                   <option>Maior salário</option>
                </select>
             </div>
          </div>

          {/* Job List Scroll Area */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-10">
            {isLoading ? (
                Array.from({length: 4}).map((_, i) => (
                    <div key={i} className="h-40 bg-onyx-800 rounded-xl animate-pulse border border-onyx-700" />
                ))
            ) : jobs.length > 0 ? (
                jobs.map(job => <JobCard key={job.id} job={job} />)
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-onyx-800/30 rounded-xl border border-onyx-700 border-dashed">
                  <div className="bg-onyx-900 w-20 h-20 rounded-full flex items-center justify-center mb-6 border border-onyx-700">
                     <Search className="w-10 h-10 text-onyx-muted" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Nenhuma vaga encontrada</h3>
                  <p className="text-onyx-muted max-w-xs mx-auto mb-8">Tente remover alguns filtros ou buscar por termos mais genéricos.</p>
                  <button onClick={() => updateAllFilters({})} className="bg-onyx-accent hover:bg-onyx-accentHover text-white px-8 py-3 rounded-lg font-bold transition-colors">
                    Limpar todos os filtros
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
