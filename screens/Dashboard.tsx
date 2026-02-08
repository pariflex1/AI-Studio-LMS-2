
import React from 'react';
import { Client, LeadStatus } from '../types';
import { UserProfile } from '../types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip as RechartsTooltip, PieChart, Pie } from 'recharts';

interface DashboardProps {
  clients: Client[];
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ clients, user }) => {
  const totalClients = clients.length;
  const hotLeads = clients.filter(c => c.status === LeadStatus.HOT).length;
  const viewing = clients.filter(c => c.status === LeadStatus.VIEWING).length;
  const closedDeals = clients.filter(c => c.status === LeadStatus.CLOSED).length;

  const chartData = [
    { name: 'Mon', count: 4, val: 40 },
    { name: 'Tue', count: 7, val: 70 },
    { name: 'Wed', count: 3, val: 30 },
    { name: 'Thu', count: 8, val: 80 },
    { name: 'Fri', count: 5, val: 50 },
    { name: 'Sat', count: 2, val: 20 },
    { name: 'Sun', count: 1, val: 10 },
  ];

  const statusData = [
    { name: 'Active', value: hotLeads + viewing, color: '#197fe6' },
    { name: 'Warm', value: clients.filter(c => c.status === LeadStatus.WARM).length, color: '#60a5fa' },
    { name: 'New', value: clients.filter(c => c.status === LeadStatus.NEW).length, color: '#94a3b8' },
    { name: 'Closed', value: closedDeals, color: '#0ea5e9' },
  ];

  return (
    <div className="p-4 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="animate-in fade-in slide-in-from-left duration-500">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">Market Pulse</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 font-medium">Tracking {totalClients} active relationships across 4 territories.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-2 pl-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{user.name}</p>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">Senior Partner</p>
          </div>
          <img src={user.avatar} className="size-11 rounded-2xl object-cover shadow-inner" alt="Agent" />
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 animate-in fade-in slide-in-from-bottom duration-700">
        <StatCard label="Pipeline Size" value={totalClients.toString()} trend="+12%" icon="groups" color="text-primary" />
        <StatCard label="Live Viewings" value={viewing.toString()} trend="In Progress" icon="visibility" color="text-sky-500" />
        <StatCard label="Hot Leads" value={hotLeads.toString()} trend="Priority" icon="local_fire_department" color="text-orange-500" />
        <StatCard label="Closed Deals" value={closedDeals.toString()} trend="Q3 Goal: 10" icon="handshake" color="text-emerald-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none flex flex-col items-center">
          <h3 className="text-xl font-bold mb-8 dark:text-white w-full text-left font-display">Status Mix</h3>
          <div className="relative h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%" cy="50%"
                  innerRadius={70} outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">{totalClients}</span>
              <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-1">Total</span>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-y-4 mt-8 px-2">
            {statusData.map(s => (
              <div key={s.name} className="flex items-center gap-3">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold dark:text-white font-display tracking-tight">Lead Velocity</h3>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 px-4 py-2 rounded-2xl text-primary font-bold text-xs cursor-pointer hover:bg-slate-100 transition-colors">
              <span>Past 7 Days</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                <YAxis hide />
                <RechartsTooltip 
                   cursor={{ fill: 'transparent' }}
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#197fe6" radius={[6, 6, 6, 6]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Peak Performance</p>
              <p className="text-lg font-black dark:text-white leading-tight">8 New Leads <span className="text-xs font-bold text-emerald-500 ml-1">Thursday</span></p>
            </div>
            <button className="bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              View Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, trend, icon, color }: any) => (
  <div className="group flex flex-col gap-3 rounded-[28px] p-6 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-primary/50 transition-all duration-300">
    <div className="flex justify-between items-center">
      <div className={`size-10 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center ${color}`}>
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg uppercase">
        {trend}
      </div>
    </div>
    <div>
      <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-[0.1em] mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{value}</p>
    </div>
  </div>
);

export default Dashboard;
