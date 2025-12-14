import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, ArrowRight, CheckCircle2, Star } from 'lucide-react';

// --- Icons & Assets ---

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.38-1.09-.5-2.04-.48-3.24 0-1.44.55-2.2.35-3.01-.65-4.22-5.23-2.94-11.33 1.86-11.47 1.37.06 2.37.81 3.12.82.72.03 2.11-.91 3.52-.77 1.19.12 2.37.66 3.11 1.57-2.73 1.54-2.27 5.8.55 6.84-.52 1.3-1.15 2.54-1.83 3.28zm-3.26-17.7c.68-1.03.46-2.09.43-2.56-1.03.12-2.31.79-2.88 1.95-.53.94-.35 2.11.38 2.17.07-.02 1.32-.42 2.07-1.56z"/>
  </svg>
);

// --- Layout Components ---

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex bg-onyx-900 text-white">
      {/* Left Column: Visuals */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-onyx-800">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-onyx-accent/20 via-onyx-900 to-onyx-900 z-0" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-onyx-accent/20 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-onyx-accent flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Remota</span>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-bold leading-tight">
              A ponte entre <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-onyx-accent to-purple-400">seu talento</span> e o mundo.
            </h2>
            
            {/* Testimonial Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl max-w-md">
               <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
               </div>
               <p className="text-lg text-gray-200 mb-4 font-light">
                 "Consegui meu primeiro emprego em Dólar através da Remota em menos de 3 semanas. O processo foi transparente e seguro."
               </p>
               <div className="flex items-center gap-3">
                  <img src="https://ui-avatars.com/api/?name=Sarah+M&background=random" className="w-10 h-10 rounded-full" alt="User" />
                  <div>
                    <p className="font-semibold text-white">Sarah Mendes</p>
                    <p className="text-xs text-gray-400">Senior Product Designer</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            © 2024 Remota Platform.
          </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative">
        <div className="w-full max-w-md space-y-8">
           <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
              <p className="text-onyx-muted">{subtitle}</p>
           </div>
           {children}
        </div>
      </div>
    </div>
  );
};

// --- Login Page ---

export const Login = () => {
  const [email, setEmail] = useState('');
  const { login, socialLogin, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
        navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, 'CANDIDATE'); 
    navigate('/profile');
  };

  if (isAuthenticated) return null;

  return (
    <AuthLayout 
      title="Bem-vindo de volta" 
      subtitle="Digite seus dados para acessar sua conta."
    >
        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => socialLogin('google')}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-onyx-800 border border-onyx-700 rounded-xl hover:bg-onyx-700 hover:border-onyx-600 transition-all text-sm font-medium text-white"
          >
            <GoogleIcon /> Google
          </button>
          <button 
            onClick={() => socialLogin('apple')}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-onyx-800 border border-onyx-700 rounded-xl hover:bg-onyx-700 hover:border-onyx-600 transition-all text-sm font-medium text-white"
          >
            <AppleIcon /> Apple
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-onyx-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-onyx-900 text-onyx-muted">ou continue com email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-onyx-500 w-5 h-5 group-focus-within:text-onyx-accent transition-colors" />
              <input 
                type="email" 
                required
                className="w-full bg-onyx-800 border border-onyx-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-onyx-accent focus:border-transparent transition-all outline-none"
                placeholder="nome@empresa.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300">Senha</label>
                <a href="#" className="text-xs text-onyx-accent hover:text-onyx-accentHover font-medium">Esqueceu a senha?</a>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-onyx-500 w-5 h-5 group-focus-within:text-onyx-accent transition-colors" />
              <input 
                type="password" 
                required
                className="w-full bg-onyx-800 border border-onyx-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-onyx-accent focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-onyx-accent to-purple-600 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-onyx-accent/20 flex items-center justify-center gap-2 group"
          >
            {isLoading ? 'Entrando...' : 'Entrar na Plataforma'}
            {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="text-center text-sm text-onyx-muted">
          Não tem uma conta? <Link to="/register" className="text-onyx-accent hover:text-white font-medium transition-colors">Cadastre-se gratuitamente</Link>
        </p>
    </AuthLayout>
  );
};

// --- Register Page ---

export const Register = () => {
  const [role, setRole] = useState<'CANDIDATE' | 'COMPANY'>('CANDIDATE');
  const [email, setEmail] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
        navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, role);
    navigate('/profile');
  };

  if (isAuthenticated) return null;

  return (
    <AuthLayout 
      title="Crie sua conta" 
      subtitle="Junte-se a milhares de profissionais e empresas."
    >
       {/* Role Selection */}
       <div className="grid grid-cols-2 gap-3 p-1 bg-onyx-800 rounded-xl border border-onyx-700">
          <button 
            type="button"
            onClick={() => setRole('CANDIDATE')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              role === 'CANDIDATE' 
              ? 'bg-onyx-700 text-white shadow-sm ring-1 ring-white/10' 
              : 'text-onyx-muted hover:text-white'
            }`}
          >
            <User className="w-4 h-4" /> Candidato
          </button>
          <button 
            type="button"
            onClick={() => setRole('COMPANY')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              role === 'COMPANY' 
              ? 'bg-onyx-700 text-white shadow-sm ring-1 ring-white/10' 
              : 'text-onyx-muted hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Empresa
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Nome</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-onyx-800 border border-onyx-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-onyx-accent focus:border-transparent transition-all outline-none"
                  placeholder="João"
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Sobrenome</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-onyx-800 border border-onyx-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-onyx-accent focus:border-transparent transition-all outline-none"
                  placeholder="Silva"
                />
             </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Email Profissional</label>
            <input 
              type="email" 
              required
              className="w-full bg-onyx-800 border border-onyx-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-onyx-accent focus:border-transparent transition-all outline-none"
              placeholder="nome@exemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Senha</label>
            <input 
              type="password" 
              required
              className="w-full bg-onyx-800 border border-onyx-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-onyx-accent focus:border-transparent transition-all outline-none"
              placeholder="••••••••"
            />
            <p className="text-xs text-onyx-muted mt-1">Mínimo de 8 caracteres</p>
          </div>

          <div className="space-y-3 pt-2">
             <div className="flex items-start gap-2">
                <div className="mt-0.5 min-w-[16px]">
                   <CheckCircle2 className="w-4 h-4 text-onyx-accent" />
                </div>
                <p className="text-xs text-onyx-muted">Concordo com os <a href="#" className="text-white hover:underline">Termos de Uso</a> e <a href="#" className="text-white hover:underline">Política de Privacidade</a>.</p>
             </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-white text-onyx-900 hover:bg-gray-100 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group mt-2"
          >
            Criar conta
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-sm text-onyx-muted">
          Já tem uma conta? <Link to="/login" className="text-onyx-accent hover:text-white font-medium transition-colors">Fazer Login</Link>
        </p>
    </AuthLayout>
  );
};
