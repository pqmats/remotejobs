
import React, { useEffect, useState } from 'react';
import { MockApi } from '../../services/mockApi';
import { Job } from '../../types';
import { JobCard } from '../../components/JobCard';
import { Bookmark, Frown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SavedJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MockApi.getSavedJobs().then(data => {
        setJobs(data);
        setLoading(false);
    });
  }, []);

  const handleUnsave = async (jobId: string) => {
      // Remove immediately from UI for snappy feel
      setJobs(prev => prev.filter(j => j.id !== jobId));
      // Call API
      await MockApi.toggleSavedJob(jobId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-onyx-800 rounded-xl mb-4 border border-onyx-700">
             <Bookmark className="w-6 h-6 text-onyx-accent" />
          </div>
          <h1 className="text-2xl font-bold text-white">Vagas Salvas</h1>
          <p className="text-onyx-muted mt-1">Oportunidades que você marcou para ver depois.</p>
      </div>

      {loading ? (
         <div className="space-y-4">
             {[1,2].map(i => <div key={i} className="h-40 bg-onyx-800 rounded-xl animate-pulse" />)}
         </div>
      ) : jobs.length > 0 ? (
         <div className="space-y-4">
             {jobs.map(job => (
                 <JobCard 
                    key={job.id} 
                    job={job} 
                    isSaved={true} 
                    onToggleSave={handleUnsave} 
                 />
             ))}
         </div>
      ) : (
         <div className="text-center py-20 bg-onyx-800/30 rounded-2xl border border-onyx-700 border-dashed">
             <Frown className="w-12 h-12 text-onyx-muted mx-auto mb-4" />
             <h3 className="text-xl font-bold text-white mb-2">Nada por aqui</h3>
             <p className="text-onyx-muted mb-6">Você ainda não salvou nenhuma vaga.</p>
             <Link to="/jobs" className="px-6 py-2 bg-onyx-accent hover:bg-onyx-accentHover text-white rounded-lg font-bold transition-colors">
                Explorar Vagas
             </Link>
         </div>
      )}
    </div>
  );
};
