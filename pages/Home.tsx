
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Globe, DollarSign, Zap, Briefcase, Code, Database, PenTool, Layout, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { Job, JobArea } from '../types';
import { MockApi } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    MockApi.getJobs().then(jobs => {
      // 1. Set Featured (first 3)
      setFeaturedJobs(jobs.slice(0, 3));

      // 2. Calculate Counts per Category Group
      const stats: Record<string, number> = {
        'Development': 0,
        'Design': 0,
        'Data & AI': 0,
        'Product': 0,
        'Business': 0,
        'Marketing': 0
      };

      jobs.forEach(job => {
        // Grouping logic based on JobArea types
        if (['Frontend', 'Backend', 'Fullstack', 'Mobile', 'DevOps', 'QA', 'Security', 'Blockchain'].includes(job.area)) {
          stats['Development'] = (stats['Development'] || 0) + 1;
        } else if (job.area === 'Design') {
          stats['Design'] = (stats['Design'] || 0) + 1;
        } else if (job.area === 'Data_AI') {
          stats['Data & AI'] = (stats['Data & AI'] || 0) + 1;
        } else if (job.area === 'Product') {
          stats['Product'] = (stats['Product'] || 0) + 1;
        }
        // Business and Marketing aren't in the mock data types yet, so they remain 0
      });

      setCategoryCounts(stats);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/jobs?q=${searchQuery}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-onyx-accent/20 rounded-full blur-[120px] -z-10 opacity-30 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Trabalhe remoto, ganhe em <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-onyx-accent to-purple-400">
              Dólar, Euro ou Real
            </span>
          </h1>
          <p className="text-xl text-onyx-muted max-w-2xl mx-auto mb-10">
            A plataforma definitiva para profissionais brasileiros encontrarem vagas internacionais, freelas e oportunidades remotas.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-onyx-accent to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-onyx-800 border border-onyx-700 rounded-xl p-2 shadow-2xl">
              <Search className="w-6 h-6 text-onyx-muted ml-3" />
              <input 
                type="text" 
                placeholder="Busque por cargo, tecnologia ou empresa..." 
                className="w-full bg-transparent border-none text-white placeholder-onyx-muted focus:ring-0 px-4 py-3 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-onyx-accent hover:bg-onyx-accentHover text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Buscar
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-onyx-muted">
            <span className="px-3 py-1 bg-onyx-800 rounded-full border border-onyx-700">🇧🇷 CLT & PJ</span>
            <span className="px-3 py-1 bg-onyx-800 rounded-full border border-onyx-700">🇺🇸 Vagas em USD</span>
            <span className="px-3 py-1 bg-onyx-800 rounded-full border border-onyx-700">🇪🇺 Vagas em EUR</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Explore por Categoria</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
                { name: 'Development', icon: Code, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { name: 'Design', icon: PenTool, color: 'text-pink-400', bg: 'bg-pink-400/10' },
                { name: 'Data & AI', icon: Database, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                { name: 'Product', icon: Layout, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                { name: 'Business', icon: Briefcase, color: 'text-green-400', bg: 'bg-green-400/10' },
                { name: 'Marketing', icon: Zap, color: 'text-red-400', bg: 'bg-red-400/10' }
            ].map((cat) => (
                <Link to={`/jobs?areas=${cat.name}`} key={cat.name} className="group bg-onyx-800 border border-onyx-700 hover:border-onyx-accent rounded-xl p-6 flex flex-col items-center gap-3 transition-all hover:-translate-y-1">
                    <div className={`p-3 rounded-full ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                        <cat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                        <span className="text-white font-medium text-sm block">{cat.name}</span>
                        <span className="text-xs text-onyx-muted font-medium mt-1 inline-block bg-onyx-900 px-2 py-0.5 rounded-md border border-onyx-700">
                           {categoryCounts[cat.name] || 0} vagas
                        </span>
                    </div>
                </Link>
            ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-onyx-800/30 border-y border-onyx-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">Como funciona?</h2>
                <p className="text-onyx-muted max-w-xl mx-auto">Processo simplificado para conectar talentos brasileiros a oportunidades globais sem burocracia excessiva.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-20 right-20 h-0.5 bg-gradient-to-r from-transparent via-onyx-700 to-transparent z-0"></div>

                {[
                    { title: 'Crie seu Perfil', desc: 'Cadastre suas skills, experiência e portfólio em minutos.', step: '01' },
                    { title: 'Encontre Vagas', desc: 'Use nossos filtros avançados para achar vagas PJ, CLT ou Internacionais.', step: '02' },
                    { title: 'Aplique e Trabalhe', desc: 'Envie sua proposta diretamente para empresas e inicie sua jornada.', step: '03' }
                ].map((item, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-onyx-900 border-4 border-onyx-800 rounded-full flex items-center justify-center text-2xl font-bold text-onyx-accent shadow-xl mb-6">
                            {item.step}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-onyx-muted leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Vagas em Destaque</h2>
            <p className="text-onyx-muted mt-2">As melhores oportunidades curadas hoje.</p>
          </div>
          <Link to="/jobs" className="text-onyx-accent hover:text-white transition-colors font-medium">
            Ver todas &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {featuredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* Features/Stats */}
      <section className="border-y border-onyx-700 bg-onyx-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Sem Fronteiras</h3>
              <p className="text-sm text-onyx-muted">Acesso a empresas globais que contratam BRs.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Salários Competitivos</h3>
              <p className="text-sm text-onyx-muted">Vagas com conversão direta e alta valorização.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Processo Rápido</h3>
              <p className="text-sm text-onyx-muted">Candidatura simplificada e feedback direto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-onyx-800 to-onyx-900 rounded-3xl p-12 text-center border border-onyx-700 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-onyx-accent/10 blur-[80px] rounded-full pointer-events-none" />
           <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Pronto para dar o próximo passo?</h2>
           <p className="text-onyx-muted mb-8 max-w-lg mx-auto relative z-10">Crie seu perfil profissional, salve suas vagas favoritas e receba alertas personalizados.</p>
           <div className="flex justify-center gap-4 relative z-10">
               {isAuthenticated ? (
                  <Link to="/jobs" className="inline-block bg-white text-onyx-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                    Ver Vagas Disponíveis <ArrowRight className="w-4 h-4"/>
                  </Link>
               ) : (
                  <Link to="/register" className="inline-block bg-white text-onyx-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                    Começar Gratuitamente
                  </Link>
               )}
               <Link to="/calculator" className="inline-block bg-onyx-800 border border-onyx-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-onyx-700 transition-colors">
                Calcular Valor Hora
               </Link>
           </div>
        </div>
      </section>
    </div>
  );
};
