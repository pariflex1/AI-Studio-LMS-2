
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { INITIAL_CLIENTS, CURRENT_USER } from './constants';
import { Client, UserProfile } from './types';
import { supabase } from './supabaseClient';
import Dashboard from './screens/Dashboard';
import ClientList from './screens/ClientList';
import ClientDetails from './screens/ClientDetails';
import ClientForm from './screens/ClientForm';
import AIAssistant from './screens/AIAssistant';
import Settings from './screens/Settings';

const DesktopSidebar = () => {
  const location = useLocation();
  const navItems = [
    { label: 'Home', icon: 'dashboard', path: '/' },
    { label: 'Clients', icon: 'groups', path: '/clients' },
    { label: 'New Entry', icon: 'person_add', path: '/new-client' },
    { label: 'AI Assistant', icon: 'smart_toy', path: '/ai' },
    { label: 'Settings', icon: 'settings', path: '/settings' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed h-full z-20">
      <div className="p-6 border-b border-slate-50 dark:border-slate-800">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-3xl font-bold">real_estate_agent</span>
          <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white font-display">SkyCRM</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              location.pathname === item.path
                ? 'bg-primary/10 text-primary'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Support</p>
          <button className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
            Help Center
          </button>
        </div>
      </div>
    </aside>
  );
};

const MobileNav = () => {
  const location = useLocation();
  const navItems = [
    { label: 'Home', icon: 'dashboard', path: '/' },
    { label: 'Clients', icon: 'groups', path: '/clients' },
    { label: 'AI Assistant', icon: 'smart_toy', path: '/ai' },
    { label: 'Settings', icon: 'settings', path: '/settings' },
  ];

  const isFullScreen = location.pathname.includes('/clients/') || 
                       location.pathname === '/new-client' || 
                       location.pathname.startsWith('/edit-client/');

  if (isFullScreen) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 ios-blur border-t border-slate-100 dark:border-slate-800 px-6 pb-8 pt-3 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1 group">
            <div className={`size-10 rounded-full flex items-center justify-center transition-all ${
              location.pathname === item.path
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'text-slate-400 dark:text-slate-500'
            }`}>
              <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
            </div>
            <span className={`text-[10px] font-bold ${
              location.pathname === item.path ? 'text-primary' : 'text-slate-400 dark:text-slate-500'
            }`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser] = useState<UserProfile>(CURRENT_USER);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error);
      // Fallback to initial clients if DB is empty or fails
      setClients(INITIAL_CLIENTS);
    } else if (data && data.length > 0) {
      // Map database keys to frontend keys if they differ (assuming they match for this impl)
      setClients(data as Client[]);
    } else {
      setClients(INITIAL_CLIENTS);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addClientState = (client: Client) => {
    setClients(prev => [client, ...prev]);
  };

  const updateClientState = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteClientState = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950">
        <DesktopSidebar />
        <main className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-24 lg:pb-0 overflow-x-hidden relative">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
               <div className="flex flex-col items-center gap-4">
                  <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-bold animate-pulse">Syncing with SkyCRM Cloud...</p>
               </div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Dashboard clients={clients} user={currentUser} />} />
              <Route path="/clients" element={<ClientList clients={clients} />} />
              <Route path="/clients/:id" element={<ClientDetails clients={clients} updateClient={updateClientState} />} />
              <Route path="/new-client" element={<ClientForm onSubmit={addClientState} />} />
              <Route path="/edit-client/:id" element={<ClientForm clients={clients} onSubmit={updateClientState} onDelete={deleteClientState} />} />
              <Route path="/ai" element={<AIAssistant clients={clients} user={currentUser} />} />
              <Route path="/settings" element={<Settings user={currentUser} darkMode={darkMode} setDarkMode={setDarkMode} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
        <MobileNav />
      </div>
    </Router>
  );
};

export default App;
