
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, User, LogOut, Menu, X, LayoutDashboard, 
  Bell, Users, Shield, Calculator, Home, Search,
  Settings, ChevronRight, ChevronLeft, PanelLeftClose, PanelLeftOpen,
  Bookmark, Sparkles, LogIn
} from 'lucide-react';

// --- Sidebar Components (Authenticated) ---

const SidebarItem = ({ 
  to, 
  icon: Icon, 
  label, 
  active, 
  collapsed,
  badgeCount
}: { 
  to: string, 
  icon: any, 
  label: string, 
  active: boolean,
  collapsed: boolean,
  badgeCount?: number
}) => (
  <Link 
    to={to} 
    title={collapsed ? label : undefined}
    className={`
      relative group flex items-center gap-3 px-3 py-2.5 mx-3 rounded-xl transition-all duration-300 ease-out
      ${active 
        ? 'bg-onyx-accent text-white shadow-lg shadow-onyx-accent/25' 
        : 'text-onyx-muted hover:bg-onyx-800 hover:text-white'
      } 
      ${collapsed ? 'justify-center mx-2 px-2' : ''}
    `}
  >
    <Icon 
      className={`
        w-5 h-5 flex-shrink-0 transition-transform duration-300 
        ${active ? 'scale-105' : 'group-hover:scale-110'}
      `} 
      strokeWidth={active ? 2.5 : 2}
    />
    
    {!collapsed && (
      <span className="font-medium text-sm truncate transition-opacity duration-300 flex-1">
        {label}
      </span>
    )}

    {/* Badge Logic */}
    {!collapsed && badgeCount && badgeCount > 0 && (
       <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">
         {badgeCount}
       </span>
    )}
    
    {/* Collapsed Dot Indicator for Active */}
    {collapsed && active && (
        <span className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full shadow-sm" />
    )}
  </Link>
);

const SidebarSectionTitle = ({ children, collapsed }: { children?: React.ReactNode, collapsed: boolean }) => {
    if (collapsed) return <div className="h-4 w-full border-b border-onyx-800/50 my-2"></div>;
    return (
        <h4 className="px-6 text-[10px] uppercase tracking-widest font-bold text-onyx-600 mb-2 mt-6">
            {children}
        </h4>
    );
};

const Sidebar = ({ isOpenMobile, onCloseMobile }: { isOpenMobile: boolean, onCloseMobile: () => void }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Collapsed state with persistence
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebar_collapsed', String(newState));
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const widthClass = collapsed ? 'w-20' : 'w-72'; // Increased expanded width slightly for better spacing

  return (
    <>
      {/* Mobile Overlay */}
      {isOpenMobile && <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={onCloseMobile} />}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen bg-onyx-900 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        border-r border-onyx-800
        ${isOpenMobile ? 'translate-x-0 w-72' : '-translate-x-full'} 
        md:translate-x-0 ${widthClass}
      `}>
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-0 w-full h-64 bg-onyx-accent/5 blur-3xl pointer-events-none rounded-b-full"></div>

        {/* Logo Area */}
        <div className={`
            relative z-10 h-20 flex items-center 
            ${collapsed ? 'justify-center' : 'justify-between px-6'}
        `}>
          <Link to="/" className="flex items-center gap-3 group overflow-hidden">
             <div className="relative w-9 h-9 flex-shrink-0">
                <div className="absolute inset-0 bg-onyx-accent blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-onyx-accent to-purple-600 flex items-center justify-center shadow-inner border border-white/10">
                    <Briefcase className="w-5 h-5 text-white" />
                </div>
             </div>
             {!collapsed && (
                 <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-tight text-white leading-none">Remota</span>
                    <span className="text-[10px] text-onyx-muted uppercase tracking-wider font-medium">Platform</span>
                 </div>
             )}
          </Link>
          
          {/* Desktop Toggle Button */}
          <button 
            onClick={toggleCollapse} 
            className={`
                hidden md:flex items-center justify-center
                text-onyx-500 hover:text-white transition-colors 
                w-6 h-6 rounded-md hover:bg-onyx-800
                ${collapsed ? 'absolute -right-3 top-7 bg-onyx-800 border border-onyx-700 shadow-xl rounded-full w-6 h-6 p-0.5' : ''}
            `}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-2 space-y-1 custom-scrollbar overflow-x-hidden relative z-10">
            
            <SidebarSectionTitle collapsed={collapsed}>Principal</SidebarSectionTitle>
            <SidebarItem to="/" icon={Home} label="Início" active={isActive('/')} collapsed={collapsed} />
            <SidebarItem to="/jobs" icon={Search} label="Explorar Vagas" active={isActive('/jobs')} collapsed={collapsed} />
            <SidebarItem to="/calculator" icon={Calculator} label="Calculadora" active={isActive('/calculator')} collapsed={collapsed} />

            <SidebarSectionTitle collapsed={collapsed}>Pessoal</SidebarSectionTitle>
            <SidebarItem to="/notifications" icon={Bell} label="Notificações" active={isActive('/notifications')} collapsed={collapsed} badgeCount={2} />
            
            {user?.role === 'CANDIDATE' && (
                <>
                <SidebarItem to="/candidate/dashboard" icon={LayoutDashboard} label="Meu Dashboard" active={isActive('/candidate/dashboard')} collapsed={collapsed} />
                <SidebarItem to="/candidate/saved-jobs" icon={Bookmark} label="Vagas Salvas" active={isActive('/candidate/saved-jobs')} collapsed={collapsed} />
                <SidebarItem to="/candidate/alerts" icon={Bell} label="Meus Alertas" active={isActive('/candidate/alerts')} collapsed={collapsed} />
                </>
            )}

            {user?.role === 'COMPANY' && (
                <>
                <SidebarItem to="/company/dashboard" icon={LayoutDashboard} label="Gestão de Vagas" active={isActive('/company/dashboard')} collapsed={collapsed} />
                <SidebarItem to="/company/talent" icon={Users} label="Banco de Talentos" active={isActive('/company/talent')} collapsed={collapsed} />
                </>
            )}

            {user?.role === 'ADMIN' && (
                <>
                <SidebarItem to="/admin/dashboard" icon={Shield} label="Painel Admin" active={isActive('/admin/dashboard')} collapsed={collapsed} />
                </>
            )}

            {!collapsed && user?.role === 'COMPANY' && (
                <div className="mx-4 mt-8 bg-gradient-to-br from-onyx-800 to-onyx-900 border border-onyx-700 rounded-2xl p-4 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-onyx-accent/5 group-hover:bg-onyx-accent/10 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-onyx-accent rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-onyx-accent/30">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h5 className="text-white font-bold text-sm mb-1">Seja Premium</h5>
                        <p className="text-xs text-onyx-muted mb-3">Destaque suas vagas e acesse talentos exclusivos.</p>
                        <button className="w-full py-2 bg-white text-onyx-900 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">
                            Ver Planos
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-onyx-800 bg-onyx-900/50 backdrop-blur-sm relative z-20">
            <div className={`flex items-center ${collapsed ? 'flex-col gap-4' : 'gap-3'}`}>
               
               <Link 
                 to="/profile" 
                 className={`
                    flex items-center gap-3 p-1.5 rounded-xl transition-all
                    ${collapsed ? 'justify-center' : 'flex-1 hover:bg-onyx-800'}
                 `}
               >
                  <div className="relative">
                    <img src={user?.avatarUrl} alt="Avatar" className="w-9 h-9 rounded-lg object-cover bg-onyx-800 border border-onyx-700" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-onyx-900 rounded-full"></div>
                  </div>
                  
                  {!collapsed && (
                    <div className="min-w-0 flex-1">
                       <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                       <p className="text-[10px] text-onyx-muted truncate capitalize flex items-center gap-1">
                           {user?.role === 'CANDIDATE' ? 'Desenvolvedor' : 'Recrutador'}
                       </p>
                    </div>
                  )}
               </Link>

               {/* Separate Settings/Logout Actions */}
                {!collapsed ? (
                    <button 
                        onClick={logout} 
                        className="p-2 text-onyx-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Sair"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                ) : (
                    <button 
                        onClick={logout}
                        className="w-9 h-9 flex items-center justify-center text-onyx-muted hover:text-red-400 hover:bg-onyx-800 rounded-lg"
                        title="Sair"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
      </aside>
    </>
  );
};

// --- Top Navbar Components (Public) ---
const TopNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, label }: { to: string, label: string }) => (
    <Link 
      to={to} 
      className={`text-sm font-medium transition-colors relative py-1 ${
        isActive(to) ? 'text-white' : 'text-onyx-muted hover:text-white'
      }`}
    >
      {label}
      {isActive(to) && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-onyx-accent rounded-full"></span>
      )}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-40 w-full bg-onyx-900/80 backdrop-blur-md border-b border-onyx-800">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
             <div className="flex-shrink-0">
                <Link to="/" className="flex items-center gap-2 group">
                  <div className="relative w-8 h-8">
                      <div className="absolute inset-0 bg-onyx-accent blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                      <div className="relative w-full h-full rounded-lg bg-onyx-accent flex items-center justify-center shadow-lg">
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                  </div>
                  <span className="text-lg font-bold text-white tracking-tight">Remota</span>
                </Link>
             </div>
             <div className="hidden md:flex items-center gap-8">
                <NavLink to="/" label="Início" />
                <NavLink to="/jobs" label="Vagas" />
                <NavLink to="/calculator" label="Calculadora" />
             </div>
             <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold text-onyx-muted hover:text-white transition-colors flex items-center gap-2">
                    <LogIn className="w-4 h-4" /> Entrar
                </Link>
                <Link to="/register" className="text-sm font-bold bg-white text-onyx-900 hover:bg-gray-200 px-5 py-2 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    Criar conta
                </Link>
             </div>
             <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-onyx-muted hover:text-white p-2">
                   {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
             </div>
          </div>
       </div>
       {mobileMenuOpen && (
         <div className="md:hidden bg-onyx-900 border-b border-onyx-800 absolute w-full left-0 top-16 shadow-2xl">
            <div className="px-4 pt-4 pb-6 space-y-2">
               <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl bg-onyx-800/50 text-base font-medium text-white">Início</Link>
               <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-onyx-800 text-base font-medium text-onyx-muted hover:text-white">Vagas</Link>
               <Link to="/calculator" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-onyx-800 text-base font-medium text-onyx-muted hover:text-white">Calculadora</Link>
               <div className="h-px bg-onyx-800 my-2"></div>
               <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl font-bold text-onyx-muted hover:text-white hover:bg-onyx-800">Entrar</Link>
               <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl font-bold bg-onyx-accent text-white shadow-lg">Criar conta</Link>
            </div>
         </div>
       )}
    </nav>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  useEffect(() => {
     const checkStorage = () => setCollapsed(localStorage.getItem('sidebar_collapsed') === 'true');
     window.addEventListener('storage', checkStorage);
     const interval = setInterval(checkStorage, 200); 
     return () => clearInterval(interval);
  }, []);

  const marginClass = collapsed ? 'md:ml-20' : 'md:ml-72';

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-onyx-900 text-onyx-text selection:bg-onyx-accent selection:text-white font-sans flex">
        <Sidebar isOpenMobile={sidebarOpenMobile} onCloseMobile={() => setSidebarOpenMobile(false)} />

        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${marginClass}`}>
          <header className="md:hidden h-16 bg-onyx-900/80 backdrop-blur-md border-b border-onyx-800 flex items-center justify-between px-4 sticky top-0 z-30">
            <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-onyx-accent flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Remota</span>
            </Link>
            <button onClick={() => setSidebarOpenMobile(true)} className="p-2 text-onyx-muted hover:text-white">
                <Menu className="w-6 h-6" />
            </button>
          </header>

          <main className="flex-grow">
            {children}
          </main>

          <footer className="py-6 px-8 border-t border-onyx-800 mt-auto bg-onyx-900">
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-onyx-muted gap-4">
                <p>© 2024 Remota Platform. Todos os direitos reservados.</p>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-onyx-accent transition-colors">Termos</a>
                  <a href="#" className="hover:text-onyx-accent transition-colors">Privacidade</a>
                </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-onyx-900 text-onyx-text selection:bg-onyx-accent selection:text-white font-sans flex flex-col">
      <TopNavbar />
      <main className="flex-grow">{children}</main>
      <footer className="py-12 bg-onyx-900 border-t border-onyx-800">
         <div className="max-w-7xl mx-auto px-4 text-center text-sm text-onyx-muted">© 2024 Remota Platform.</div>
      </footer>
    </div>
  );
};
