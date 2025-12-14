import React, { useState, useEffect } from 'react';
import { FilterSection } from './FilterSection';
import { JobFilters } from '../../services/mockApi';
import { Check, Search, X, Filter as FilterIcon, RotateCcw } from 'lucide-react';
import { JobArea, JobLevel, JobType, RemoteType, Currency } from '../../types';

interface JobFilterSidebarProps {
  initialFilters: JobFilters;
  onApply: (filters: JobFilters) => void;
  resultCount: number;
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  subLabel?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, subLabel }) => (
  <label className="flex items-center gap-3 cursor-pointer group py-1 hover:bg-onyx-800/50 rounded px-1 -mx-1 transition-colors">
    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${checked ? 'bg-onyx-accent border-onyx-accent' : 'bg-onyx-900 border-onyx-600 group-hover:border-onyx-500'}`}>
      {checked && <Check className="w-3 h-3 text-white" />}
    </div>
    <div className="flex-1 text-sm text-onyx-muted group-hover:text-white transition-colors">
      {label}
      {subLabel && <span className="block text-xs text-onyx-600">{subLabel}</span>}
    </div>
  </label>
);

export const JobFilterSidebar: React.FC<JobFilterSidebarProps> = ({
  initialFilters,
  onApply,
  resultCount
}) => {
  // Local Draft State
  const [draftFilters, setDraftFilters] = useState<JobFilters>(initialFilters);
  const [techInput, setTechInput] = useState('');
  
  // Sync when initial filters change (e.g. from URL load), but allow draft drift
  useEffect(() => {
    setDraftFilters(initialFilters);
  }, [initialFilters]);

  // Helpers to update draft state
  const toggleDraftArray = (key: keyof JobFilters, value: string) => {
    setDraftFilters(prev => {
      const current = (prev[key] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const setDraftSingle = (key: keyof JobFilters, value: any) => {
    setDraftFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(draftFilters);
  };

  const handleClear = () => {
    const emptyFilters: JobFilters = {
        query: draftFilters.query, // Keep query
        areas: [],
        levels: [],
        types: [],
        remoteTypes: [],
        currencies: [],
        minSalary: 0,
        techStack: [],
        languages: [],
        verifiedOnly: false,
        salaryVisibleOnly: false
    };
    setDraftFilters(emptyFilters);
    onApply(emptyFilters);
  };

  const addTech = (e: React.FormEvent) => {
    e.preventDefault();
    if(techInput.trim()) {
        toggleDraftArray('techStack', techInput.trim());
        setTechInput('');
    }
  };

  // Autocomplete Suggestions Mock
  const techSuggestions = ['React', 'Node.js', 'TypeScript', 'Java', 'Python', 'AWS', 'Docker', 'Kubernetes'].filter(
    t => t.toLowerCase().includes(techInput.toLowerCase()) && !draftFilters.techStack?.includes(t)
  );

  // Lists
  const areas: { label: string, value: JobArea }[] = [
    { label: 'Front-end', value: 'Frontend' },
    { label: 'Back-end', value: 'Backend' },
    { label: 'Full Stack', value: 'Fullstack' },
    { label: 'Mobile', value: 'Mobile' },
    { label: 'Data & AI', value: 'Data_AI' },
    { label: 'DevOps & Cloud', value: 'DevOps' },
    { label: 'Design (UX/UI)', value: 'Design' },
    { label: 'Product', value: 'Product' },
    { label: 'Cybersecurity', value: 'Security' },
  ];

  const levels: { label: string, value: JobLevel }[] = [
    { label: 'Estágio', value: 'INTERN' },
    { label: 'Júnior', value: 'JUNIOR' },
    { label: 'Pleno', value: 'MID' },
    { label: 'Sênior', value: 'SENIOR' },
    { label: 'Tech Lead / Staff', value: 'LEAD' },
    { label: 'C-Level / Head', value: 'C_LEVEL' },
  ];

  const types: { label: string, value: JobType }[] = [
    { label: 'CLT Brasil', value: 'CLT_BR' },
    { label: 'CLT Internacional', value: 'CLT_INTL' },
    { label: 'PJ (B2B)', value: 'PJ' },
    { label: 'Freelance', value: 'FREELANCE' },
  ];

  const remotes: { label: string, value: RemoteType }[] = [
    { label: '100% Remoto (Global)', value: 'GLOBAL' },
    { label: '100% Remoto (Latam)', value: 'LATAM' },
    { label: '100% Remoto (Brasil)', value: 'BRAZIL_ONLY' },
    { label: 'Híbrido', value: 'HYBRID' },
  ];

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-onyx-700">
        <h3 className="font-bold text-white flex items-center gap-2">
            <FilterIcon className="w-4 h-4" /> Filtros
        </h3>
        <button onClick={handleClear} className="text-xs text-onyx-muted hover:text-white flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Limpar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-2">
          
          {/* Active Tags Summary */}
          {draftFilters.techStack && draftFilters.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
                {draftFilters.techStack.map(tech => (
                    <span key={tech} className="bg-onyx-800 border border-onyx-700 text-xs text-white px-2 py-1 rounded flex items-center gap-1 group">
                        {tech} <button onClick={() => toggleDraftArray('techStack', tech)} className="group-hover:text-red-400"><X className="w-3 h-3"/></button>
                    </span>
                ))}
            </div>
          )}

          {/* Switches */}
          <div className="space-y-3 bg-onyx-800/50 p-4 rounded-xl border border-onyx-700">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-onyx-muted group-hover:text-white transition-colors">Salário Visível</span>
              <input 
                type="checkbox" 
                className="rounded bg-onyx-900 border-onyx-600 text-onyx-accent focus:ring-0 cursor-pointer" 
                checked={draftFilters.salaryVisibleOnly || false}
                onChange={(e) => setDraftSingle('salaryVisibleOnly', e.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-onyx-muted group-hover:text-white transition-colors">Empresas Verificadas</span>
              <input 
                type="checkbox" 
                className="rounded bg-onyx-900 border-onyx-600 text-onyx-accent focus:ring-0 cursor-pointer" 
                checked={draftFilters.verifiedOnly || false}
                onChange={(e) => setDraftSingle('verifiedOnly', e.target.checked)}
              />
            </label>
          </div>

          <FilterSection title="Stack & Tecnologias" isOpenDefault activeCount={draftFilters.techStack?.length}>
            <div className="relative">
                <form onSubmit={addTech} className="mb-2">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            placeholder="Ex: React, AWS..." 
                            className="w-full bg-onyx-900 border border-onyx-700 rounded-lg py-2 pl-3 pr-8 text-sm text-white focus:border-onyx-accent focus:outline-none focus:ring-1 focus:ring-onyx-accent"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-onyx-muted hover:text-white">
                            <PlusIcon className="w-4 h-4" />
                        </button>
                    </div>
                </form>
                {/* Autocomplete Dropdown */}
                {techInput && techSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-onyx-800 border border-onyx-700 rounded-lg shadow-xl mt-1 overflow-hidden">
                        {techSuggestions.map(tech => (
                            <button 
                                key={tech}
                                onClick={() => { toggleDraftArray('techStack', tech); setTechInput(''); }}
                                className="w-full text-left px-3 py-2 text-sm text-onyx-muted hover:bg-onyx-700 hover:text-white transition-colors block"
                            >
                                {tech}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
                {['React', 'Node.js', 'Python', 'Java'].map(tech => (
                    <button 
                      key={tech} 
                      onClick={() => toggleDraftArray('techStack', tech)}
                      className={`text-xs border px-2 py-1 rounded-md transition-colors ${
                          draftFilters.techStack?.includes(tech) 
                          ? 'bg-onyx-accent/20 border-onyx-accent text-white' 
                          : 'border-onyx-700 text-onyx-muted hover:border-onyx-500'
                      }`}
                    >
                        {tech}
                    </button>
                ))}
            </div>
          </FilterSection>

          <FilterSection title="Área de Atuação" isOpenDefault activeCount={draftFilters.areas?.length}>
            <div className="space-y-1">
              {areas.map(area => (
                <Checkbox 
                  key={area.value} 
                  label={area.label} 
                  checked={draftFilters.areas?.includes(area.value) || false} 
                  onChange={() => toggleDraftArray('areas', area.value)} 
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Nível de Experiência" activeCount={draftFilters.levels?.length}>
            <div className="space-y-1">
              {levels.map(lvl => (
                <Checkbox 
                  key={lvl.value} 
                  label={lvl.label} 
                  checked={draftFilters.levels?.includes(lvl.value) || false} 
                  onChange={() => toggleDraftArray('levels', lvl.value)} 
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Modelo de Trabalho" activeCount={draftFilters.remoteTypes?.length}>
            <div className="space-y-1">
               {remotes.map(rem => (
                   <Checkbox 
                     key={rem.value} 
                     label={rem.label} 
                     checked={draftFilters.remoteTypes?.includes(rem.value) || false} 
                     onChange={() => toggleDraftArray('remoteTypes', rem.value)} 
                   />
               ))}
            </div>
          </FilterSection>

          <FilterSection title="Contrato & Moeda" activeCount={(draftFilters.types?.length || 0) + (draftFilters.currencies?.length || 0)}>
            <div className="space-y-4">
               <div className="space-y-1">
                   <p className="text-xs text-onyx-muted font-semibold uppercase mb-2">Tipo</p>
                   {types.map(type => (
                     <Checkbox 
                        key={type.value} 
                        label={type.label} 
                        checked={draftFilters.types?.includes(type.value) || false} 
                        onChange={() => toggleDraftArray('types', type.value)} 
                     />
                   ))}
               </div>
               <div className="space-y-1">
                   <p className="text-xs text-onyx-muted font-semibold uppercase mb-2">Moeda</p>
                   <div className="flex gap-2">
                      {['BRL', 'USD', 'EUR', 'GBP'].map(curr => (
                          <button 
                            key={curr}
                            onClick={() => toggleDraftArray('currencies', curr)}
                            className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                                draftFilters.currencies?.includes(curr as Currency)
                                ? 'bg-green-500/20 border-green-500 text-green-500'
                                : 'border-onyx-700 text-onyx-muted hover:border-onyx-500'
                            }`}
                          >
                              {curr}
                          </button>
                      ))}
                   </div>
               </div>
            </div>
          </FilterSection>

          <FilterSection title="Faixa Salarial (Mínimo)" isOpenDefault={!!draftFilters.minSalary}>
             <div className="px-2 pb-4">
                <input 
                  type="range" 
                  min="0" 
                  max="20000" 
                  step="1000" 
                  value={draftFilters.minSalary || 0}
                  onChange={(e) => setDraftSingle('minSalary', Number(e.target.value))}
                  className="w-full accent-onyx-accent h-2 bg-onyx-900 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-onyx-muted mt-2 font-mono">
                   <span>0</span>
                   <span className="text-white font-bold">{draftFilters.minSalary ? `> ${draftFilters.minSalary}` : 'Qualquer valor'}</span>
                   <span>20k+</span>
                </div>
             </div>
          </FilterSection>
      </div>
      
      {/* Sticky Action Footer */}
      <div className="pt-4 border-t border-onyx-700 bg-onyx-900 sticky bottom-0">
         <button 
            onClick={handleApply}
            className="w-full py-3 bg-onyx-accent hover:bg-onyx-accentHover text-white rounded-lg font-bold transition-all shadow-lg shadow-onyx-accent/20 active:scale-95"
         >
            Filtrar Resultados ({resultCount})
         </button>
      </div>

    </div>
  );
};

const PlusIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
)
