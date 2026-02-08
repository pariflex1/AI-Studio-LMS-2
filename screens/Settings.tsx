
import React from 'react';
import { UserProfile } from '../types';

interface SettingsProps {
  user: UserProfile;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, darkMode, setDarkMode }) => {
  return (
    <div className="flex-1 bg-background-light dark:bg-background-dark flex flex-col min-h-screen">
      <div className="max-w-[430px] mx-auto w-full flex-1 flex flex-col border-x border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm lg:shadow-none">
        {/* Header */}
        <header className="flex items-center p-4 sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
           <h2 className="text-lg font-bold flex-1 text-center dark:text-white">Settings</h2>
        </header>

        <main className="flex-1 flex flex-col p-4 gap-6">
          {/* Profile Header */}
          <section className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm flex items-center gap-4">
            <img src={user.avatar} className="size-20 rounded-full border-2 border-primary/20 object-cover" alt="Profile" />
            <div className="flex flex-col">
              <p className="text-xl font-bold dark:text-white">{user.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.title}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.phone}</p>
            </div>
          </section>

          {/* Preferences */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Preferences</h3>
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
               <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">dark_mode</span>
                    </div>
                    <p className="font-semibold dark:text-white">Dark Mode</p>
                  </div>
                  <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${darkMode ? 'left-7' : 'left-1'}`}></div>
                  </button>
               </div>
               <SettingsItem icon="notifications" label="Notifications" />
               <SettingsItem icon="lock" label="Privacy & Security" />
            </div>
          </div>

          {/* System */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">System</h3>
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
               <SettingsItem icon="info" label="App Version" value="v2.4.0" />
               <SettingsItem icon="help" label="Help & Support" />
            </div>
          </div>

          {/* Logout */}
          <div className="mt-auto py-8 text-center space-y-6">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-danger/30 text-danger font-bold text-base hover:bg-danger/5 transition-all active:scale-[0.98]">
               <span className="material-symbols-outlined">logout</span>
               Log Out
            </button>
            <p className="text-xs text-slate-400">© 2024 SkyCRM Pro. All rights reserved.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

const SettingsItem = ({ icon, label, value }: any) => (
  <div className="flex items-center justify-between p-4 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <p className="font-semibold dark:text-white">{label}</p>
    </div>
    <div className="flex items-center gap-1">
      {value ? (
        <span className="text-sm text-slate-400 font-medium">{value}</span>
      ) : (
        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
      )}
    </div>
  </div>
);

export default Settings;
