
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client, LeadStatus } from '../types';
import { supabase } from '../supabaseClient';

interface ClientDetailsProps {
  clients: Client[];
  updateClient: (id: string, updates: Partial<Client>) => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ clients, updateClient }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = clients.find(c => c.id === id);

  if (!client) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400">
        <span className="material-symbols-outlined text-6xl">person_off</span>
        <p className="mt-4">Client not found.</p>
        <button onClick={() => navigate('/clients')} className="mt-4 text-primary font-bold">Back to list</button>
      </div>
    );
  }

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as LeadStatus;
    // Optimistic update
    updateClient(client.id, { status: newStatus });
    
    try {
      const { error } = await supabase
        .from('clients')
        .update({ status: newStatus })
        .eq('id', client.id);
      
      if (error) throw error;
    } catch (err) {
      console.error('Failed to update status in Supabase:', err);
      alert('Failed to sync status with cloud.');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 lg:bg-slate-900/20 backdrop-blur-sm flex items-end lg:items-center justify-center p-0 lg:p-8">
      <div className="absolute inset-0 hidden lg:block" onClick={() => navigate('/clients')}></div>
      
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[40px] lg:rounded-[32px] shadow-2xl flex flex-col max-h-[95%] lg:max-h-[85%] overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        <div className="flex flex-col items-center pt-4 pb-2 lg:hidden">
          <div className="h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>

        <div className="flex-1 overflow-y-auto pb-40 px-6">
          <header className="flex flex-col py-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                 <img src={client.avatar} className="size-16 rounded-3xl object-cover shadow-md border-2 border-white dark:border-slate-800" alt={client.name} />
                 <div>
                    <h1 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight font-display">{client.name}</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{client.profession}</p>
                 </div>
              </div>
              <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                {client.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
               <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Budget</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{client.budget}</p>
               </div>
               <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">ID Tag</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{client.id}</p>
               </div>
            </div>
          </header>

          <section className="space-y-6">
            <div className="space-y-2">
              <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-widest px-1">Pipeline State</p>
              <select 
                value={client.status}
                onChange={handleStatusChange}
                className="w-full rounded-2xl text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-16 p-4 text-base font-bold focus:ring-2 focus:ring-primary/20 appearance-none transition-all"
              >
                {Object.values(LeadStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-widest px-1">Contact Information</p>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                 <ContactRow icon="call" label="Phone" value={client.phone} />
                 <ContactRow icon="mail" label="Email" value={client.email} />
                 <ContactRow icon="location_on" label="Location" value={client.location} />
              </div>
            </div>

            <div className="space-y-2">
               <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-widest px-1">CRM Notes</p>
               <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-3xl border border-amber-100 dark:border-amber-900/30">
                  <p className="text-amber-900 dark:text-amber-200 text-sm leading-relaxed font-medium italic">
                    "{client.notes}"
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-amber-700 dark:text-amber-500 font-bold uppercase">Cloud Synced</span>
                    <button onClick={() => navigate(`/edit-client/${client.id}`)} className="text-primary text-xs font-bold">Edit Notes</button>
                  </div>
               </div>
            </div>
          </section>
        </div>

        <footer className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 ios-blur border-t border-slate-100 dark:border-slate-800 px-6 pb-12 pt-6 z-10">
          <div className="flex justify-between items-center max-w-md mx-auto">
            <ActionCircle icon="call" label="Call" color="bg-primary" onClick={() => window.open(`tel:${client.phone}`)} />
            <ActionCircle icon="chat" label="WhatsApp" color="bg-[#25D366]" onClick={() => window.open(`https://wa.me/${client.phone}`)} />
            <ActionCircle icon="sms" label="SMS" color="bg-primary" onClick={() => window.open(`sms:${client.phone}`)} />
            <ActionCircle icon="calendar_month" label="Event" color="bg-slate-900 dark:bg-slate-700" onClick={() => navigate(`/edit-client/${client.id}`)} />
          </div>
        </footer>
        
        <button 
          onClick={() => navigate('/clients')}
          className="absolute top-6 right-6 hidden lg:flex items-center justify-center size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:rotate-90 transition-all duration-300"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );
};

const ContactRow = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-4 p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
    <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-primary shadow-sm border border-slate-100 dark:border-slate-700">
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{value}</span>
    </div>
  </div>
);

const ActionCircle = ({ icon, label, color, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group">
    <div className={`size-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-xl shadow-primary/10 group-active:scale-90 group-hover:translate-y-[-2px] transition-all`}>
      <span className="material-symbols-outlined text-[28px]">{icon}</span>
    </div>
    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{label}</span>
  </button>
);

export default ClientDetails;
