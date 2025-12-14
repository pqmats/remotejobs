
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, User, LogOut, Menu, X, LayoutDashboard, 
  Bell, Users, Shield, Calculator, Home, Search,
  Settings, ChevronRight, ChevronLeft, PanelLeftClose, PanelLeftOpen,
  Bookmark
} from 'lucide-react';

// --- Sidebar Components (Authenticated) ---

const SidebarItem = ({ 
  to, 
  icon: Icon, 
  label, 
  active, 
  collapsed 
}: { 
  to: string, 
  icon: any, 
  label: string, 
  active: boolean,
  collapsed: boolean 
}) => (
  <Link 
    to={to} 
    title={collapsed ? label : undefined}
    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-onyx-800 text-white border-l-4 border-onyx-accent' 
        : 'text-onyx-muted hover:bg-onyx-800 hover:text-white'
    } ${collapsed ? 'justify-center' : ''}`}
  >
    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-onyx-accent' : 'text-onyx-muted group-hover:text-white'}`} />
    {!collapsed && <span className="font-medium text-sm truncate transition-opacity duration-300">{label}</span>}
  </Link>
);

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

  const widthClass = collapsed ? 'w-20' : 'w-64';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpenMobile && <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={onCloseMobile} />}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen bg-onyx-900 border-r border-onyx-700 flex flex-col transition-all duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full'} 
        md:translate-x-0 ${widthClass}
      `}>
        
        {/* Logo Area */}
        <div className={`h-16 flex items-center border-b border-onyx-700/50 ${collapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
          <Link to="/" className="flex items-center gap-3 group overflow-hidden">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-onyx-accent to-purple-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-onyx-accent/20">
                <Briefcase className="w-4 h-4 text-white" />
             </div>
             {!collapsed && <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">Remota</span>}
          </Link>
          
          {/* Desktop Toggle Button */}
          <button 
            onClick={toggleCollapse} 
            className={`hidden md:flex text-onyx-muted hover:text-white transition-colors ${collapsed ? 'absolute -right-3 top-6 bg-onyx-800 border border-onyx-700 rounded-full p-1 shadow-md' : ''}`}
          >
            {collapsed ? <ChevronRight className="w-3 h-3" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar overflow-x-hidden">
          <div className="mb-6">
            {!collapsed && <p className="px-3 text-xs font-semibold text-onyx-muted uppercase tracking-wider mb-2 animate-in fade-in">Menu</p>}
            <SidebarItem to="/" icon={Home} label="Início" active={isActive('/')} collapsed={collapsed} />
            <SidebarItem to="/jobs" icon={Search} label="Vagas" active={isActive('/jobs')} collapsed={collapsed} />
            <SidebarItem to="/calculator" icon={Calculator} label="Calculadora" active={isActive('/calculator')} collapsed={collapsed} />
          </div>

          <div className="mb-6">
               {!collapsed && (
                 <p className="px-3 text-xs font-semibold text-onyx-muted uppercase tracking-wider mb-2 animate-in fade-in">
                   {user?.role === 'CANDIDATE' ? 'Candidato' : user?.role === 'COMPANY' ? 'Empresa' : 'Admin'}
                 </p>
               )}
               
               {/* Common Authenticated */}
               <SidebarItem to="/notifications" icon={Bell} label="Notificações" active={isActive('/notifications')} collapsed={collapsed} />

               {user?.role === 'CANDIDATE' && (
                 <>
                   <SidebarItem to="/candidate/dashboard" icon={LayoutDashboard} label="Dashboard" active={isActive('/candidate/dashboard')} collapsed={collapsed} />
                   <SidebarItem to="/candidate/saved-jobs" icon={Bookmark} label="Vagas Salvas" active={isActive('/candidate/saved-jobs')} collapsed={collapsed} />
                   <SidebarItem to="/candidate/alerts" icon={Bell} label="Alertas" active={isActive('/candidate/alerts')} collapsed={collapsed} />
                 </>
               )}

               {user?.role === 'COMPANY' && (
                 <>
                   <SidebarItem to="/company/dashboard" icon={LayoutDashboard} label="Gestão" active={isActive('/company/dashboard')} collapsed={collapsed} />
                   <SidebarItem to="/company/talent" icon={Users} label="Banco de Talentos" active={isActive('/company/talent')} collapsed={collapsed} />
                 </>
               )}

               {user?.role === 'ADMIN' && (
                 <SidebarItem to="/admin/dashboard" icon={Shield} label="Administração" active={isActive('/admin/dashboard')} collapsed={collapsed} />
               )}
          </div>
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-onyx-700/50 bg-onyx-800/30">
            <div className={`flex flex-col gap-2 ${collapsed ? 'items-center' : ''}`}>
               <Link to="/profile" className={`flex items-center gap-3 p-2 rounded-lg hover:bg-onyx-800 transition-colors ${collapsed ? 'justify-center' : ''}`}>
                  <img src={user?.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-onyx-600 flex-shrink-0" />
                  {!collapsed && (
                    <div className="flex-1 min-w-0 overflow-hidden">
                       <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                       <p className="text-xs text-onyx-muted truncate capitalize">{user?.role.toLowerCase()}</p>
                    </div>
                  )}
                  {!collapsed && <Settings className="w-4 h-4 text-onyx-muted flex-shrink-0" />}
               </Link>
               <button 
                  onClick={logout} 
                  title="Sair"
                  className={`flex items-center justify-center gap-2 text-xs font-medium text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 py-2 rounded-lg transition-colors ${collapsed ? 'w-full' : 'w-full px-4'}`}
               >
                  <LogOut className="w-3.5 h-3.5" /> {!collapsed && 'Sair'}
               </button>
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
      className={`text-sm font-medium transition-colors ${
        isActive(to) ? 'text-white' : 'text-onyx-muted hover:text-white'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-40 w-full bg-onyx-900/80 backdrop-blur-md border-b border-onyx-700">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
             <div className="flex-shrink-0">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-onyx-accent flex items-center justify-center shadow-lg shadow-onyx-accent/20">
                    <Briefcase className="w-4 h-4 text-white" />
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
                <Link to="/login" className="text-sm font-medium text-onyx-muted hover:text-white transition-colors">Entrar</Link>
                <Link to="/register" className="text-sm font-medium bg-onyx-accent hover:bg-onyx-accentHover text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-onyx-accent/20">Criar conta</Link>
             </div>
             <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-onyx-muted hover:text-white p-2">
                   {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
             </div>
          </div>
       </div>
       {mobileMenuOpen && (
         <div className="md:hidden bg-onyx-800 border-b border-onyx-700">
            <div className="px-4 pt-2 pb-4 space-y-1">
               <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-onyx-700">Início</Link>
               <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-onyx-muted hover:text-white hover:bg-onyx-700">Vagas</Link>
               <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-onyx-muted hover:text-white hover:bg-onyx-700 mt-4">Entrar</Link>
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

  const marginClass = collapsed ? 'md:ml-20' : 'md:ml-64';

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-onyx-900 text-onyx-text selection:bg-onyx-accent selection:text-white font-sans flex">
        <Sidebar isOpenMobile={sidebarOpenMobile} onCloseMobile={() => setSidebarOpenMobile(false)} />

        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${marginClass}`}>
          <header className="md:hidden h-16 bg-onyx-900/80 backdrop-blur-md border-b border-onyx-700 flex items-center justify-between px-4 sticky top-0 z-30">
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

          <footer className="py-6 px-8 border-t border-onyx-800 mt-auto">
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-onyx-muted gap-4">
                <p>© 2024 Remota Platform. Todos os direitos reservados.</p>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-onyx-accent">Termos</a>
                  <a href="#" className="hover:text-onyx-accent">Privacidade</a>
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
      <footer className="py-12 bg-onyx-800 border-t border-onyx-700">
         <div className="max-w-7xl mx-auto px-4 text-center text-sm text-onyx-muted">© 2024 Remota Platform.</div>
      </footer>
    </div>
  );
};
