
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '../types';

interface ClientListProps {
  clients: Client[];
}

const ClientList: React.FC<ClientListProps> = ({ clients }) => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sticky Header with Search */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="relative flex-1 group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text"
              placeholder="Search contacts, location..."
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-3 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full p-4 space-y-4">
        {/* Today's Follow Up (Horizontal Scroll) */}
        <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold dark:text-white">Today's Follow-Up</h2>
                <span className="text-primary text-xs font-semibold">View All</span>
            </div>
            <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4">
                {clients.slice(0, 3).map(client => (
                    <div 
                      key={client.id}
                      onClick={() => navigate(`/clients/${client.id}`)}
                      className="flex-shrink-0 w-40 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-primary/50 transition-colors"
                    >
                        <div className="w-full h-24 bg-slate-100 dark:bg-slate-700 rounded-lg mb-3 overflow-hidden">
                            <img src={client.avatar} className="w-full h-full object-cover" alt={client.name} />
                        </div>
                        <p className="text-sm font-bold truncate dark:text-white">{client.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Today at 10:30 AM</p>
                        <div className="mt-3 inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[9px] font-bold uppercase tracking-wider">
                            Pending
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Main Listing */}
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold dark:text-white">Client Listing <span className="text-sm font-normal text-slate-400 ml-1">({filteredClients.length})</span></h2>
            <button 
              onClick={() => navigate('/new-client')}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-blue-600 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">person_add</span>
              Add Client
            </button>
        </div>

        <div className="space-y-3">
          {filteredClients.map(client => (
            <div 
              key={client.id} 
              onClick={() => navigate(`/clients/${client.id}`)}
              className="flex items-start gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-primary/50 transition-all active:scale-[0.98]"
            >
              <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-700 flex-shrink-0 overflow-hidden border border-slate-50 dark:border-slate-800">
                <img src={client.avatar} className="w-full h-full object-cover" alt={client.name} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">{client.name}</h3>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[9px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {client.status}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">In 2 hours</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{client.phone}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">{client.location}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredClients.length === 0 && (
            <div className="py-20 text-center text-slate-400 dark:text-slate-600">
              <span className="material-symbols-outlined text-5xl mb-2">person_search</span>
              <p>No clients found matching your search.</p>
            </div>
          )}
          
          {filteredClients.length > 0 && (
             <div className="pt-8 pb-12 flex justify-center">
                <button className="flex items-center gap-2 px-8 py-3 rounded-full border border-primary/20 bg-primary/5 text-primary text-[14px] font-semibold hover:bg-primary/10 transition-colors">
                    <span>Load More</span>
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                </button>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientList;
