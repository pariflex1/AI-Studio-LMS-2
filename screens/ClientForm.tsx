
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Client, LeadStatus } from '../types';
import { supabase } from '../supabaseClient';

interface ClientFormProps {
  clients?: Client[];
  onSubmit: (client: any) => void;
  onDelete?: (id: string) => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ clients = [], onSubmit, onDelete }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const existingClient = clients.find(c => c.id === id);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Client>>(existingClient || {
    name: '',
    email: '',
    phone: '',
    location: '',
    profession: '',
    status: LeadStatus.NEW,
    notes: '',
    budget: '',
    nextFollowUp: new Date().toISOString().slice(0, 16),
    intent: 'New Lead'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (id) {
        // Update existing
        const { error } = await supabase
          .from('clients')
          .update(formData)
          .eq('id', id);
        
        if (error) throw error;
        onSubmit(id, formData);
      } else {
        // Create new
        const newId = `CL-${Math.floor(1000 + Math.random() * 9000)}`;
        const finalData = {
          ...formData,
          id: newId,
          avatar: formData.avatar || `https://picsum.photos/seed/${formData.name || 'default'}/200`
        };
        
        const { error } = await supabase
          .from('clients')
          .insert([finalData]);
        
        if (error) throw error;
        onSubmit(finalData as Client);
      }
      navigate('/clients');
    } catch (err) {
      console.error('Supabase operation failed:', err);
      alert('Failed to save client. Please check your Supabase table configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !onDelete) return;
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      onDelete(id);
      navigate('/clients');
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-slate-950">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <button onClick={() => navigate(-1)} className="text-primary text-base font-medium">Cancel</button>
          <h1 className="text-[#0e141b] dark:text-white text-lg font-bold leading-tight flex-1 text-center">
            {id ? 'Edit Client' : 'Client Entry Form'}
          </h1>
          <div className="w-12 flex justify-end">
            <span className="material-symbols-outlined text-[#0e141b] dark:text-white">more_horiz</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto pb-32 w-full">
        <div className="flex p-8 justify-center">
          <div className="flex flex-col gap-4 items-center">
            <div className="relative">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 border-4 border-white dark:border-slate-800 shadow-md"
                style={{ backgroundImage: `url(${formData.avatar || 'https://picsum.photos/seed/placeholder/200'})` }}
              ></div>
              <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </div>
            </div>
            <p className="text-primary text-base font-semibold cursor-pointer">Edit Profile Photo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-[#0e141b] dark:text-slate-200 text-xs font-bold uppercase tracking-wider pb-2">Primary Contact Number</p>
            <div className="flex w-full items-stretch rounded-lg">
              <input 
                type="tel"
                placeholder="000-000-0000"
                className="flex-1 rounded-l-lg border-slate-200 dark:border-slate-700 bg-background-light dark:bg-slate-800 h-16 text-xl font-bold tracking-widest text-slate-900 dark:text-white focus:ring-primary focus:border-primary px-4"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <div className="text-[#4e7397] flex border-l-0 border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-slate-800 items-center justify-center px-4 rounded-r-lg">
                <span className="material-symbols-outlined">call</span>
              </div>
            </div>
          </div>

          <section className="space-y-4">
            <h3 className="text-lg font-bold dark:text-white">Basic Information</h3>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-4">
              <FormField label="Client Name" placeholder="John Doe" value={formData.name} onChange={(v: string) => setFormData({ ...formData, name: v })} />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Profession" placeholder="Architect" value={formData.profession} onChange={(v: string) => setFormData({ ...formData, profession: v })} />
                <FormField label="City" placeholder="New York" value={formData.location} onChange={(v: string) => setFormData({ ...formData, location: v })} />
              </div>
              <FormField label="Email Address" placeholder="client@example.com" value={formData.email} onChange={(v: string) => setFormData({ ...formData, email: v })} type="email" />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold dark:text-white">Property Requirements</h3>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-4">
              <FormField label="Project Name" placeholder="Skyline Towers" value={formData.intent} onChange={(v: string) => setFormData({ ...formData, intent: v })} />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Property Type</p>
                  <select className="h-14 rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary px-4">
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Condo</option>
                  </select>
                </div>
                <FormField label="Budget Range" placeholder="$500k - $800k" value={formData.budget} onChange={(v: string) => setFormData({ ...formData, budget: v })} />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold dark:text-white">Management</h3>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Lead Status</p>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                      className="h-14 rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary px-4"
                    >
                      {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Follow-up Date</p>
                    <input 
                      type="datetime-local"
                      className="h-14 rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary px-2"
                      value={formData.nextFollowUp}
                      onChange={e => setFormData({ ...formData, nextFollowUp: e.target.value })}
                    />
                  </div>
               </div>
               <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Notes</p>
                  <textarea 
                    className="min-h-[120px] rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary p-4 resize-none"
                    placeholder="Add detailed notes..."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  />
               </div>
            </div>
          </section>

          {id && (
            <div className="pt-4 pb-8 flex justify-center">
              <button 
                type="button" 
                onClick={handleDelete}
                className="flex items-center gap-2 text-danger font-semibold text-base py-2 px-4 rounded-lg active:bg-danger/10"
              >
                <span className="material-symbols-outlined text-xl">delete</span>
                Delete Client
              </button>
            </div>
          )}
        </form>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 pb-10 z-50">
        <div className="max-w-md mx-auto">
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-colors active:scale-95 disabled:opacity-50"
          >
            <span className="material-symbols-outlined">{isSaving ? 'progress_activity' : 'save'}</span>
            {isSaving ? 'Synchronizing...' : 'Save Client Information'}
          </button>
        </div>
      </footer>
    </div>
  );
};

const FormField = ({ label, placeholder, value, onChange, type = 'text' }: any) => (
  <label className="flex flex-col gap-1">
    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
    <input 
      type={type}
      placeholder={placeholder}
      className="h-14 rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary px-4"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </label>
);

export default ClientForm;
