
import React, { useState } from 'react';
import { Job } from '../types';
import { MapPin, DollarSign, Clock, Building, Bookmark, Sparkles, Verified } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onToggleSave?: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, isSaved = false, onToggleSave }) => {
  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: job.currency, maximumFractionDigits: 0 });
  const [localSaved, setLocalSaved] = useState(isSaved);
  
  const postedDate = new Date(job.postedAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - postedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  const isNew = diffDays <= 3;

  const handleBookmark = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setLocalSaved(!localSaved);
      if (onToggleSave) {
          onToggleSave(job.id);
      }
  };

  return (
    <Link to={`/jobs/${job.id}`} className="group block relative">
      {/* Background Glow Effect on Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-onyx-accent to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
      
      <div className="relative bg-onyx-800/80 backdrop-blur-sm rounded-xl p-5 border border-onyx-700/50 transition-all duration-300 group-hover:border-onyx-accent/30 group-hover:-translate-y-1 shadow-sm group-hover:shadow-xl">
        
        {/* Top Section: Header */}
        <div className="flex justify-between items-start mb-4">
           <div className="flex gap-4">
              <div className="relative flex-shrink-0">
                  <img 
                    src={job.companyLogo} 
                    alt={job.companyName} 
                    className="w-14 h-14 rounded-xl object-cover border border-onyx-700 bg-onyx-900"
                  />
                  {job.verifiedCompany && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-onyx-800" title="Empresa Verificada">
                          <Verified className="w-3 h-3 text-white fill-blue-500" />
                      </div>
                  )}
              </div>
              
              <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-onyx-accent transition-colors line-clamp-1 pr-8">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-onyx-muted mt-1">
                      <span className="font-medium text-gray-300">{job.companyName}</span>
                      <span className="text-onyx-700">•</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                  </div>
              </div>
           </div>

           <div className="flex-shrink-0 flex flex-col items-end gap-2">
               {job.sponsored && (
                   <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                       <Sparkles className="w-3 h-3" /> Destaque
                   </span>
               )}
               <button 
                className={`p-1 rounded transition-colors z-10 ${localSaved ? 'text-onyx-accent' : 'text-onyx-muted hover:text-white hover:bg-onyx-700'}`}
                onClick={handleBookmark}
                title={localSaved ? "Remover dos salvos" : "Salvar vaga"}
               >
                   <Bookmark className={`w-5 h-5 ${localSaved ? 'fill-current' : ''}`} />
               </button>
           </div>
        </div>

        {/* Middle Section: Details Pills */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-onyx-900 border border-onyx-700 text-xs font-medium text-gray-300">
                <Building className="w-3.5 h-3.5 text-onyx-muted" />
                {job.type.replace('_', ' ')}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-onyx-900 border border-onyx-700 text-xs font-medium text-gray-300">
                <Clock className="w-3.5 h-3.5 text-onyx-muted" />
                {job.level}
            </div>
            {job.salaryVisible && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-bold text-green-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    {formatter.format(job.salaryMin)} - {formatter.format(job.salaryMax)}
                </div>
            )}
        </div>

        {/* Bottom Section: Skills & Date */}
        <div className="flex items-center justify-between pt-4 border-t border-onyx-700/50">
            <div className="flex gap-2 overflow-hidden mask-linear-fade">
                {job.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="text-xs text-onyx-muted bg-onyx-700/30 px-2 py-1 rounded hover:bg-onyx-700 hover:text-white transition-colors">
                        {skill}
                    </span>
                ))}
                {job.skills.length > 3 && (
                    <span className="text-xs text-onyx-muted bg-onyx-700/30 px-2 py-1 rounded">+{job.skills.length - 3}</span>
                )}
            </div>
            <span className={`text-xs font-medium ${isNew ? 'text-green-400' : 'text-onyx-600'}`}>
                {isNew ? 'Novo' : diffDays + 'd atrás'}
            </span>
        </div>

      </div>
    </Link>
  );
};
