
import React, { useEffect, useState } from 'react';
import { MockApi } from '../../services/mockApi';
import { User } from '../../types';
import { Search, MapPin, Download, ExternalLink, Briefcase, Code, Award } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

export const TalentBank = () => {
  const [candidates, setCandidates] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { openModal } = useModal();

  useEffect(() => {
    MockApi.getCandidates().then(data => {
        setCandidates(data);
        setLoading(false);
    });
  }, []);

  const filtered = candidates.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Banco de Talentos</h1>
          <p className="text-onyx-muted mt-1">Encontre profissionais qualificados para sua empresa.</p>
        </div>
        
        <div className="w-full md:w-96 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onyx-muted" />
             <input 
                type="text" 
                placeholder="Buscar por nome, cargo ou skill..." 
                className="w-full bg-onyx-800 border border-onyx-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-onyx-accent transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
             />
        </div>
      </div>

      {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-64 bg-onyx-800 rounded-2xl animate-pulse" />)}
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filtered.map(candidate => (
                <div key={candidate.id} className="bg-onyx-800 rounded-2xl border border-onyx-700 p-6 flex flex-col hover:border-onyx-500 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <img src={candidate.avatarUrl} alt={candidate.name} className="w-14 h-14 rounded-full border-2 border-onyx-700" />
                            <div>
                                <h3 className="font-bold text-white text-lg">{candidate.name}</h3>
                                <div className="flex items-center gap-1 text-sm text-onyx-muted">
                                    <MapPin className="w-3 h-3" /> Brasil
                                </div>
                            </div>
                        </div>
                        <div className="p-2 bg-green-500/10 rounded-full text-green-500" title="Disponível para trabalho">
                            <Briefcase className="w-4 h-4" />
                        </div>
                    </div>

                    <p className="text-onyx-muted text-sm line-clamp-3 mb-6 flex-1">
                        {candidate.bio || "Sem biografia."}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {candidate.skills?.slice(0, 4).map(skill => (
                            <span key={skill} className="px-2 py-1 bg-onyx-900 border border-onyx-700 rounded text-xs text-onyx-muted font-medium">
                                {skill}
                            </span>
                        ))}
                        {(candidate.skills?.length || 0) > 4 && (
                            <span className="px-2 py-1 bg-onyx-900 border border-onyx-700 rounded text-xs text-onyx-muted font-medium">
                                +{(candidate.skills?.length || 0) - 4}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-onyx-700">
                        <button className="flex-1 bg-white text-onyx-900 font-bold py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                             Ver Perfil
                        </button>
                        {candidate.resume && (
                            <a href={candidate.resume.url} target="_blank" rel="noreferrer" className="p-2.5 bg-onyx-700 text-white rounded-lg hover:bg-onyx-600 transition-colors" title="Ver Currículo">
                                <Download className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>
             ))}
          </div>
      )}
    </div>
  );
};
