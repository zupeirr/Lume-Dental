import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, Clock, LogOut, CheckCircle, XCircle, LayoutDashboard, Settings, Pencil, Plus, Trash2, Save, Upload, Printer, FileText, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface Stats {
  totalUsers: number; totalAppointments: number; pendingAppointments: number;
  totalServices: number; totalRevenue: number; pendingPayments: number;
  appointmentsByDate: any[]; serviceStats: any[];
  statusStats: any[]; recentAppointments: any[];
}

const PIE_COLORS = ['#F97316', '#22C55E', '#EF4444'];
const API = (import.meta as any).env.VITE_API_URL || "http://localhost:5000";

// ─── tiny helpers ────────────────────────────────────────────────────────────
const token = () => localStorage.getItem("adminToken") ?? "";
const authHeader = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

export default function AdminDashboard() {
  const [tab, setTab] = useState<"overview" | "appointments" | "content">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<"patient" | "booking" | null>(null);
  const [dentists, setDentists] = useState<any[]>([]);
  const [workload, setWorkload] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const fetchStats = async () => {
    if (!token()) { navigate("/admin/login"); return; }
    try {
      const res = await fetch(`${API}/api/dashboard/stats`, { headers: authHeader() });
      if (res.status === 401 || res.status === 403) { localStorage.removeItem("adminToken"); navigate("/admin/login"); return; }
      setStats(await res.json());
      
      // Also get user info
      const meRes = await fetch(`${API}/api/auth/me`, { headers: authHeader() });
      const me = await meRes.json();
      setUser(me);
      if (me.role === 'dentist') setTab('appointments');
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API}/api/notifications`, { headers: authHeader() });
      setNotifications(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${API}/api/staff`, { headers: authHeader() });
      setDentists(await res.json());
      const res2 = await fetch(`${API}/api/staff/workload`, { headers: authHeader() });
      setWorkload(await res2.json());
    } catch (e) { console.error(e); }
  };

  const refreshAll = () => {
    fetchStats();
    fetchNotifications();
    fetchStaff();
  };

  useEffect(() => { 
    refreshAll();
    const interval = setInterval(refreshAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${API}/api/appointments/${id}`, { method: "PATCH", headers: authHeader(), body: JSON.stringify({ status }) });
    fetchStats();
  };

  const handleLogout = () => { localStorage.removeItem("adminToken"); navigate("/admin/login"); };

  const deleteNotification = async (id: number) => {
    await fetch(`${API}/api/notifications/${id}`, { method: "DELETE", headers: authHeader() });
    fetchNotifications();
  };

  const downloadReport = () => {
    if (!stats?.recentAppointments) return;
    const header = "ID,Patient,Email,Phone,Service,Date,Amount,Payment,Status\n";
    const csv = stats.recentAppointments.map(a => 
      `${a.id},${a.name},${a.email},${a.phone},${a.service_name},${a.appointment_date},${a.amount},${a.payment_status},${a.status}`
    ).join("\n");
    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LumeDental_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-bg-deep p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-white/50 text-sm">Lume Dental — Enterprise Control Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white transition relative">
                <LayoutDashboard size={20} />
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-blue rounded-full" />
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-[#131316] border border-white/10 rounded-2xl shadow-2xl z-50 p-4 max-h-96 overflow-y-auto">
                  <h3 className="text-sm font-bold text-white mb-4 flex justify-between items-center">
                    Notifications
                    <span className="text-[10px] text-brand-blue uppercase tracking-widest">{notifications.length} Total</span>
                  </h3>
                  <div className="space-y-3">
                    {notifications.length === 0 ? (
                      <p className="text-white/30 text-center py-8 text-xs italic">No new alerts</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-3 rounded-xl border relative group/notif ${n.is_read ? 'bg-transparent border-white/5 opacity-50' : 'bg-white/5 border-white/10'} transition`}>
                          <button onClick={() => deleteNotification(n.id)} className="absolute top-2 right-2 p-1 text-white/20 hover:text-red-500 opacity-0 group-hover/notif:opacity-100 transition"><Trash2 size={10} /></button>
                          <p className="text-xs font-bold text-white mb-1">{n.title}</p>
                          <p className="text-[11px] text-white/50 line-clamp-2">{n.message}</p>
                          <p className="text-[9px] text-white/20 mt-2">{new Date(n.created_at).toLocaleString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition text-sm font-bold">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => setActiveModal("booking")} className="bg-brand-blue/10 border border-brand-blue/20 p-4 rounded-2xl flex items-center gap-3 hover:bg-brand-blue/20 transition group text-left">
            <div className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition"><Plus size={18} /></div>
            <div><p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">New</p><p className="text-sm font-bold text-white">Booking</p></div>
          </button>
          <button onClick={() => setActiveModal("patient")} className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-center gap-3 hover:bg-green-500/20 transition group text-left">
            <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition"><Users size={18} /></div>
            <div><p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Add</p><p className="text-sm font-bold text-white">Patient</p></div>
          </button>
          <button onClick={() => setTab("appointments")} className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex items-center gap-3 hover:bg-orange-500/20 transition group text-left">
            <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition"><Settings size={18} /></div>
            <div><p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Create</p><p className="text-sm font-bold text-white">Invoice</p></div>
          </button>
          <button onClick={downloadReport} className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl flex items-center gap-3 hover:bg-purple-500/20 transition group text-left">
            <div className="w-10 h-10 bg-purple-500 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition"><LayoutDashboard size={18} /></div>
            <div><p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">Download</p><p className="text-sm font-bold text-white">Report</p></div>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-1">
          {([
            { id: "overview", label: "Overview", Icon: LayoutDashboard, roles: ['admin', 'receptionist'] },
            { id: "appointments", label: "Schedule", Icon: Calendar, roles: ['admin', 'dentist', 'receptionist'] },
            { id: "staff", label: "Staff", Icon: Users, roles: ['admin'] },
            { id: "content", label: "Content", Icon: Pencil, roles: ['admin'] },
          ] as const).filter(t => !user || t.roles.includes(user.role)).map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-bold transition-all ${tab === id ? "bg-white/10 text-white border border-white/10 border-b-0" : "text-white/40 hover:text-white/70"}`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Bookings", value: stats?.totalAppointments, color: "brand-blue", Icon: Calendar, roles: ['admin', 'receptionist'] },
                { label: "Pending Requests", value: stats?.pendingAppointments, color: "orange-500", Icon: Clock, roles: ['admin', 'receptionist'] },
                { label: "Total Revenue", value: `$${stats?.totalRevenue?.toLocaleString()}`, color: "green-500", Icon: Save, roles: ['admin'] },
                { label: "Pending Payments", value: `$${stats?.pendingPayments?.toLocaleString()}`, color: "red-500", Icon: Users, roles: ['admin'] },
              ].filter(c => !user || c.roles.includes(user.role)).map(({ label, value, color, Icon }) => (
                <div key={label} className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-white/20 transition">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}/10 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-${color}/20 transition`} />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-12 h-12 bg-${color}/20 text-${color} rounded-2xl flex items-center justify-center`}><Icon size={24} /></div>
                    <div><p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{label}</p><h3 className="text-xl font-bold text-white">{value ?? 0}</h3></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl h-[400px]">
                <h2 className="text-xl font-bold text-white mb-6">Appointments Over Time</h2>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.appointmentsByDate || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
                    <XAxis dataKey="date" stroke="#ffffff50" tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                    <YAxis stroke="#ffffff50" allowDecimals={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#131316', borderColor: '#ffffff1a', borderRadius: '12px' }} labelFormatter={(v) => new Date(v).toLocaleDateString()} />
                    <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl h-[188px]">
                  <h2 className="text-xl font-bold text-white mb-2">Services Popularity</h2>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.serviceStats || []} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" horizontal={false} />
                      <XAxis type="number" stroke="#ffffff50" allowDecimals={false} />
                      <YAxis dataKey="name" type="category" stroke="#ffffff50" width={120} tick={{ fontSize: 12 }} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#131316', borderColor: '#ffffff1a', borderRadius: '12px' }} cursor={{ fill: '#ffffff0a' }} />
                      <Bar dataKey="total" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl h-[188px] flex items-center">
                  <div className="w-1/2">
                    <h2 className="text-xl font-bold text-white mb-2">Status Breakdown</h2>
                    <ul className="space-y-2 mt-4 text-sm text-white/70">
                      {stats?.statusStats?.map((s: any, i: number) => (
                        <li key={s.status} className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span className="capitalize">{s.status}</span>: <span className="font-bold text-white">{s.total}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-1/2 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={stats?.statusStats || []} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="total">
                          {stats?.statusStats?.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <RechartsTooltip contentStyle={{ backgroundColor: '#131316', borderColor: '#ffffff1a', borderRadius: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── STAFF TAB ── */}
        {tab === "staff" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                 <h3 className="text-xl font-bold text-white mb-6">Medical Staff Management</h3>
                 <div className="space-y-4">
                   {dentists.map((d: any) => (
                     <div key={d.id} className="flex justify-between items-center p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/[0.07] transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-brand-blue/20 text-brand-blue rounded-2xl flex items-center justify-center font-bold">{d.name.split(' ').map((n:any)=>n[0]).join('')}</div>
                           <div>
                              <p className="text-sm font-bold text-white">{d.name}</p>
                              <p className="text-[10px] text-white/40 uppercase tracking-widest">{d.specialty}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full inline-block">Active</p>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                 <h3 className="text-xl font-bold text-white mb-6">Workload Allocation</h3>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={workload}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                          <XAxis dataKey="name" stroke="#ffffff30" fontSize={10} tickFormatter={(v)=>v.split(' ')[1]} />
                          <YAxis stroke="#ffffff30" fontSize={10} />
                          <Bar dataKey="appointment_count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
                 <p className="text-center text-[10px] text-white/30 uppercase tracking-widest mt-4">Total Appointments per Specialist</p>
              </div>
            </div>
          </div>
        )}
        {tab === "appointments" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
               <h2 className="text-xl font-bold text-white tracking-tight">Clinical Schedule</h2>
               <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 shadow-inner">
                  <button onClick={() => setViewMode("list")} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${viewMode === 'list' ? 'bg-brand-blue text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}>List View</button>
                  <button onClick={() => setViewMode("grid")} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${viewMode === 'grid' ? 'bg-brand-blue text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}>Time Grid</button>
               </div>
            </div>

            {viewMode === "grid" ? (
               <div className="bg-[#0f0f12] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <div className="grid grid-cols-[140px_1fr] border-b border-white/10 bg-white/[0.02]">
                     <div className="p-8 border-r border-white/10 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Schedule</div>
                     <div className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Specialist Assignment & Procedures</div>
                  </div>
                  <div className="divide-y divide-white/5">
                     {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map(time => {
                        const apps = (stats?.recentAppointments || []).filter((a: any) => a.appointment_date.includes(time));
                        return (
                           <div key={time} className="grid grid-cols-[140px_1fr] min-h-[120px] group">
                              <div className="p-10 border-r border-white/10 text-lg font-black text-white/20 flex items-start justify-center bg-white/[0.01] group-hover:bg-white/[0.03] transition-all tabular-nums">{time}</div>
                              <div className="p-6 flex gap-6 flex-wrap items-start">
                                 {apps.map((a: any) => (
                                    <button key={a.id} onClick={() => setActiveAppointment(a)} className="bg-[#17171c] border border-white/5 rounded-[2rem] p-6 text-left hover:border-brand-blue/40 hover:bg-[#1c1c24] transition-all min-w-[280px] shadow-xl group/card relative overflow-hidden">
                                       <div className="absolute top-0 left-0 w-1 h-full bg-brand-blue opacity-50" />
                                       <div className="flex justify-between items-start mb-4">
                                          <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest">{a.service_name}</p>
                                          <div className={`w-2 h-2 rounded-full ${a.payment_status === 'paid' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'} transition-all`} />
                                       </div>
                                       <p className="text-sm font-bold text-white mb-1 group-hover/card:translate-x-1 transition-transform">{a.name}</p>
                                       <div className="flex items-center gap-2 text-[10px] text-white/30 mt-4 pt-4 border-t border-white/5 font-medium italic">
                                          <Users size={12} className="text-brand-blue/40" />
                                          <span className="uppercase tracking-tighter">{a.dentist_name || 'Awaiting Assignment'}</span>
                                       </div>
                                    </button>
                                 ))}
                                 {apps.length === 0 && <div className="h-full flex items-center px-4 text-[10px] text-white/5 italic font-black uppercase tracking-[0.2em] select-none">Clinically Available</div>}
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stats?.recentAppointments?.map((a: any) => (
                    <div key={a.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.08] transition-all cursor-pointer group hover:border-brand-blue/30 shadow-lg" onClick={() => setActiveAppointment(a)}>
                        <div className="flex justify-between items-start mb-6">
                            <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] ${a.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                {a.status}
                            </div>
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">{new Date(a.appointment_date).toLocaleDateString()}</p>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-1">{a.name}</h4>
                        <p className="text-brand-blue text-xs font-black mb-8 uppercase tracking-[0.15em]">{a.service_name}</p>
                        <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-tight">
                               <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-blue/10 group-hover:text-brand-blue transition-colors"><Users size={16} /></div>
                               {a.dentist_name || 'Unassigned'}
                            </div>
                            <p className="text-white font-black text-base tabular-nums">${a.amount || 0}</p>
                        </div>
                    </div>
                  ))}
               </div>
            )}
          </div>
        )}

        {/* ── CONTENT EDITOR TAB ── */}
        {tab === "content" && <ContentEditor />}
      </div>

      {/* Modals */}
      {activeAppointment && (
        <PatientManagementModal 
          appointment={activeAppointment} 
          onClose={() => setActiveAppointment(null)} 
          onUpdate={fetchStats} 
        />
      )}
      {activeModal === "patient" && (
        <AddPatientModal onClose={() => setActiveModal(null)} onUpdate={fetchStats} />
      )}
      {activeModal === "booking" && (
        <NewBookingModal onClose={() => setActiveModal(null)} onUpdate={fetchStats} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Add Patient Modal
// ─────────────────────────────────────────────────────────────────────────────
function AddPatientModal({ onClose, onUpdate }: any) {
  const [form, setForm] = useState({ 
    name: '', phone: '', patient_no: '', preferred_service: 'General Checkup',
    appointment_date: '', appointment_time: '', service_id: '1'
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate Patient Info
    if (!form.name || !form.phone || !form.patient_no) {
      return setError("Name, Phone, and Patient ID are mandatory.");
    }
    // Validate Quick Booking if any booking field is touched
    if (form.appointment_date || form.appointment_time) {
       if (!form.appointment_date || !form.appointment_time || !form.service_id) {
          return setError("Please complete all appointment fields for Quick Booking.");
       }
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users/patients`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert(`Success! Patient ${form.name} registered and booking confirmed.`);
      onUpdate();
      onClose();
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[110] p-6 overflow-y-auto">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#131316] border border-white/10 rounded-[2.5rem] w-full max-w-lg p-10 space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue to-green-500" />
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Quick Registration</h2>
            <p className="text-xs text-white/40 mt-1">Add patient and schedule appointment instantly.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition text-white/30 hover:text-white"><XCircle size={24} /></button>
        </div>

        {error && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="text-red-400 text-xs bg-red-400/5 p-4 rounded-2xl border border-red-400/10 font-medium">
            ⚠️ {error}
          </motion.div>
        )}

        <form onSubmit={submit} className="space-y-8">
          {/* Patient Info Section */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                <Users size={12} /> Patient Information
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                   <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-brand-blue/50 transition-all" placeholder="Full Name" />
                </div>
                <div>
                   <input value={form.patient_no} onChange={e => setForm({...form, patient_no: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-brand-blue/50 transition-all" placeholder="ID / Patient No" />
                </div>
                <div>
                   <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-brand-blue/50 transition-all" placeholder="Phone Number" />
                </div>
             </div>
          </div>

          {/* Quick Booking Section */}
          <div className="space-y-4 pt-4 border-t border-white/5">
             <div className="flex items-center gap-2 text-[10px] font-bold text-brand-blue/50 uppercase tracking-[0.2em]">
                <Calendar size={12} /> Quick Booking (Optional)
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-[9px] text-white/30 uppercase font-bold px-1 mb-1 block">Appointment Date</label>
                   <input type="date" value={form.appointment_date} onChange={e => setForm({...form, appointment_date: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-brand-blue/50 transition-all [color-scheme:dark]" />
                </div>
                <div>
                   <label className="text-[9px] text-white/30 uppercase font-bold px-1 mb-1 block">Time Slot</label>
                   <input type="time" value={form.appointment_time} onChange={e => setForm({...form, appointment_time: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-brand-blue/50 transition-all [color-scheme:dark]" />
                </div>
                <div className="col-span-2">
                   <label className="text-[9px] text-white/30 uppercase font-bold px-1 mb-1 block">Selected Treatment</label>
                   <select value={form.service_id} onChange={e => setForm({...form, service_id: e.target.value})} className="w-full bg-[#131316] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-brand-blue/50 appearance-none cursor-pointer">
                       <option value="1">Comprehensive Checkup</option>
                       <option value="2">Teeth Whitening</option>
                       <option value="3">Dental Implants</option>
                       <option value="4">Root Canal Treatment</option>
                       <option value="5">Emergency Care</option>
                   </select>
                </div>
             </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-5 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-[1.25rem] font-bold text-sm hover:shadow-2xl hover:shadow-brand-blue/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? "Processing..." : (form.appointment_date ? "Register & Book Appointment" : "Register Patient Only")}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// New Booking Modal
// ─────────────────────────────────────────────────────────────────────────────
function NewBookingModal({ onClose, onUpdate }: any) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service_id: '1', date: '', time: '', comments: '' });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.time) return setError("Missing required fields");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/appointments`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ ...form, appointment_date: `${form.date}T${form.time}` })
      });
      if (!res.ok) throw new Error("Booking failed");
      onUpdate();
      onClose();
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#131316] border border-white/10 rounded-3xl w-full max-w-lg p-8 space-y-6 shadow-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Manual Booking</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition text-white/30 hover:text-white"><XCircle size={20} /></button>
        </div>
        {error && <p className="text-red-500 text-xs bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>}
        <form onSubmit={submit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Patient Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50" /></div>
          <div><label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Phone</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50" /></div>
          <div><label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Service ID</label><input value={form.service_id} onChange={e => setForm({...form, service_id: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50" /></div>
          <div><label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Date</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50" /></div>
          <div><label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Time</label><input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50" /></div>
          <div className="col-span-2"><button type="submit" disabled={loading} className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all">{loading ? "Booking..." : "Create Appointment"}</button></div>
        </form>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Patient & Billing Management Modal (Detailed View)
// ─────────────────────────────────────────────────────────────────────────────
function PatientManagementModal({ appointment, onClose, onUpdate }: any) {
  const [activeTab, setActiveTab] = useState<"details" | "profile" | "invoice">("details");
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  // States for Editing
  const [amt, setAmt] = useState(appointment.amount || 0);
  const [pStatus, setPStatus] = useState(appointment.payment_status || "unpaid");
  const [notes, setNotes] = useState(appointment.notes || "");
  const [status, setStatus] = useState(appointment.status || "pending");
  const [medHistory, setMedHistory] = useState("");
  const [allergies, setAllergies] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (appointment.user_id) {
      setLoadingProfile(true);
      fetch(`${API}/api/users/patients/${appointment.user_id}`, { headers: authHeader() })
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          setMedHistory(data.record?.medical_history || "");
          setAllergies(data.record?.allergies || "");
        })
        .finally(() => setLoadingProfile(false));
    }
  }, [appointment.user_id]);

  const saveDetails = async () => {
    setSaving(true);
    try {
      // Update appointment
      await fetch(`${API}/api/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: authHeader(),
        body: JSON.stringify({ amount: amt, payment_status: pStatus, notes, status })
      });
      // Update medical record if patient is registered
      if (appointment.user_id) {
        await fetch(`${API}/api/users/patients/${appointment.user_id}/record`, {
          method: "PUT",
          headers: authHeader(),
          body: JSON.stringify({ medical_history: medHistory, allergies })
        });
      }
      onUpdate();
      onClose();
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handlePrint = () => { window.print(); };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6 overflow-y-auto">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#131316] border border-white/10 rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[850px]">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 bg-white/5 border-r border-white/10 p-8 space-y-8 flex-shrink-0 print:hidden">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white leading-tight">Patient Management</h2>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Lume Clinical Suite</p>
          </div>

          <nav className="space-y-2">
            {[
              { id: "details", label: "Billing & Status", Icon: Settings },
              { id: "profile", label: "Patient Profile", Icon: Users },
              { id: "invoice", label: "View Invoice", Icon: FileText },
            ].map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setActiveTab(id as any)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === id ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20" : "text-white/40 hover:text-white/60 hover:bg-white/5"}`}>
                <Icon size={18} /> {label}
              </button>
            ))}
          </nav>

          <div className="pt-8 border-t border-white/10 space-y-4">
             <div className="bg-white/5 rounded-2xl p-4">
                <p className="text-[9px] font-bold text-white/30 uppercase mb-1">Appointment</p>
                <p className="text-xs text-white font-medium">{new Date(appointment.appointment_date).toLocaleDateString()}</p>
                <p className="text-[10px] text-brand-blue font-bold mt-1">{appointment.service_name}</p>
             </div>
             <button onClick={onClose} className="w-full flex items-center justify-center gap-2 py-3 text-white/30 hover:text-red-400 transition text-sm font-bold">
               <XCircle size={16} /> Close Panel
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-10 overflow-y-auto bg-gradient-to-br from-transparent to-white/[0.02]">
          
          {/* TAB: BILLING & DETAILS */}
          {activeTab === "details" && (
            <div className="space-y-10">
              <header className="flex justify-between items-center">
                <div><h3 className="text-2xl font-bold text-white">Billing & Workflow</h3><p className="text-white/40 text-sm">Update financial data and clinical status for this visit.</p></div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${pStatus === 'paid' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>{pStatus}</div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Consultation Fee</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 font-bold">$</span>
                    <input type="number" value={amt} onChange={e => setAmt(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-3xl pl-10 pr-6 py-4 text-white outline-none focus:border-brand-blue/50 transition-all font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Payment Status</label>
                  <select value={pStatus} onChange={e => setPStatus(e.target.value)} className="w-full bg-[#131316] border border-white/10 rounded-3xl px-6 py-4 text-white outline-none focus:border-brand-blue/50 appearance-none transition-all cursor-pointer">
                    <option value="unpaid">Awaiting Payment</option>
                    <option value="paid">Payment Received</option>
                    <option value="refunded">Refund Issued</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Workflow Status</label>
                <div className="flex gap-3">
                  {['pending', 'confirmed', 'cancelled', 'completed'].map(s => (
                    <button key={s} onClick={() => setStatus(s)} className={`flex-1 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider border transition-all ${status === s ? 'bg-white/10 border-white/30 text-white shadow-xl' : 'bg-transparent border-white/5 text-white/20 hover:text-white/40'}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Visit & Treatment Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-5 text-white outline-none focus:border-brand-blue/50 resize-none" placeholder="Enter findings, treatment provided, or billing internal notes..." />
              </div>

              <div className="pt-6">
                <button onClick={saveDetails} disabled={saving} className="w-full py-5 bg-brand-blue text-white rounded-[1.5rem] font-bold shadow-2xl shadow-brand-blue/20 hover:scale-[1.02] transition-all disabled:opacity-50">
                  {saving ? "Processing..." : "Commit Changes to Database"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: PATIENT PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-10">
               <header>
                <h3 className="text-2xl font-bold text-white">Clinical Record: {appointment.name}</h3>
                <p className="text-white/40 text-sm">Full history of medical background and previous treatments.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1 flex items-center gap-2"><Activity size={12} className="text-red-400" /> Allergies & Alerts</label>
                  <textarea value={allergies} onChange={e => setAllergies(e.target.value)} rows={3} className="w-full bg-red-400/5 border border-red-400/10 rounded-[1.5rem] px-5 py-4 text-white text-sm outline-none focus:border-red-400/50 resize-none" placeholder="Penicillin, Latex, etc..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1 flex items-center gap-2"><FileText size={12} className="text-brand-blue" /> Chronic Conditions</label>
                  <textarea value={medHistory} onChange={e => setMedHistory(e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-5 py-4 text-white text-sm outline-none focus:border-brand-blue/50 resize-none" placeholder="Diabetes, Hypertension, etc..." />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Previous Treatments</h4>
                <div className="space-y-3">
                  {profile?.history?.map((h: any) => (
                    <div key={h.id} className="bg-white/5 border border-white/10 rounded-[1.25rem] p-5 flex justify-between items-center group hover:bg-white/[0.07] transition-all">
                      <div>
                        <p className="text-sm font-bold text-white">{h.service_name}</p>
                        <p className="text-[10px] text-white/40">{new Date(h.appointment_date).toLocaleDateString()} — {h.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white/60">${h.amount}</p>
                        <p className={`text-[9px] font-bold uppercase tracking-widest ${h.payment_status === 'paid' ? 'text-green-500' : 'text-red-500'}`}>{h.payment_status}</p>
                      </div>
                    </div>
                  ))}
                  {(!profile?.history || profile.history.length === 0) && (
                    <div className="bg-white/2 border border-white/5 border-dashed rounded-3xl p-10 text-center text-white/20 text-xs italic">No previous history recorded for this patient identifier.</div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button onClick={saveDetails} disabled={saving} className="w-full py-4 border border-white/10 text-white/60 rounded-2xl font-bold hover:text-white hover:bg-white/5 transition-all">
                  Update Clinical Records
                </button>
              </div>
            </div>
          )}

          {/* TAB: INVOICE PREVIEW */}
          {activeTab === "invoice" && (
            <div className="space-y-8 animate-in fade-in zoom-in duration-300">
               <div className="bg-white border border-black/5 rounded-[2rem] p-12 text-black shadow-2xl relative print:border-0 print:shadow-none print:p-0">
                  <div className="flex justify-between items-start mb-12">
                    <div className="space-y-2">
                       <h1 className="text-3xl font-black tracking-tighter text-brand-blue italic">LUME<span className="text-black not-italic font-bold">DENTAL</span></h1>
                       <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Beverly Hills • Clinical Center</div>
                    </div>
                    <div className="text-right">
                       <h2 className="text-2xl font-bold uppercase tracking-tighter">Invoice</h2>
                       <p className="text-xs text-black/40">#{appointment.id.toString().padStart(6, '0')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-12 mb-12">
                    <div className="space-y-4">
                       <p className="text-[10px] font-black uppercase text-black/30 border-b border-black/5 pb-2">Patient Details</p>
                       <div>
                          <p className="font-bold text-lg">{appointment.name}</p>
                          <p className="text-sm text-black/60">{appointment.email}</p>
                          <p className="text-sm text-black/60">{appointment.phone}</p>
                       </div>
                    </div>
                    <div className="space-y-4 text-right">
                       <p className="text-[10px] font-black uppercase text-black/30 border-b border-black/5 pb-2">Treatment Date</p>
                       <div>
                          <p className="font-bold text-lg">{new Date(appointment.appointment_date).toLocaleDateString()}</p>
                          <p className="text-sm text-black/60">Issued: {new Date().toLocaleDateString()}</p>
                       </div>
                    </div>
                  </div>

                  <table className="w-full mb-12">
                    <thead>
                       <tr className="text-[10px] font-black uppercase text-black/30 border-b border-black/10">
                          <th className="text-left py-4">Procedure / Service</th>
                          <th className="text-right py-4">Total Amount</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                       <tr>
                          <td className="py-6">
                             <p className="font-bold">{appointment.service_name}</p>
                             <p className="text-xs text-black/50 italic">{notes || "Consultation and procedure fees."}</p>
                          </td>
                          <td className="py-6 text-right font-bold text-xl">${amt.toLocaleString()}</td>
                       </tr>
                    </tbody>
                  </table>

                  <div className="flex justify-end pt-8 border-t-2 border-black">
                     <div className="text-right space-y-1">
                        <p className="text-[10px] font-black uppercase text-black/30">Balance Due</p>
                        <p className="text-4xl font-black text-brand-blue">${pStatus === 'paid' ? '0.00' : amt.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-black/40">{pStatus === 'paid' ? 'Transaction Completed' : 'Payment Required'}</p>
                     </div>
                  </div>

                  <div className="mt-20 pt-8 border-t border-black/5 flex justify-between items-end italic text-black/30 text-[10px]">
                     <p>Thank you for choosing Lume Dental for your oral health needs.</p>
                     <p>www.lumedental.com</p>
                  </div>
               </div>

               <button onClick={handlePrint} className="w-full py-5 bg-black text-white rounded-[1.5rem] font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all print:hidden">
                  <Printer size={20} /> Print Formal Invoice
               </button>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tiny Upload Helper Component
// ─────────────────────────────────────────────────────────────────────────────
function ImageInput({ value, onChange }: { value: string, onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(`${API}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}` },
        body: fd
      });
      const d = await res.json();
      if (d.url) onChange(d.url);
    } catch (e) { console.error(e); } finally { setUploading(false); }
  };

  return (
    <div className="flex gap-2">
      <input value={value} onChange={e => onChange(e.target.value)}
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50"
        placeholder="Image URL or upload..." />
      <label className={`flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-all ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
        <Upload size={18} className={`${uploading ? "animate-bounce" : "text-white/50"}`} />
        <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
      </label>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Editor — self-contained sub-component
// ─────────────────────────────────────────────────────────────────────────────
function ContentEditor() {
  const [section, setSection] = useState<"services" | "pricing" | "gallery">("services");
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async (s: string) => {
    setLoading(true); setData(null);
    try {
      const res = await fetch(`${API}/api/content/${s}`);
      let json = await res.json();
      // Migration: if the content is still in the old array format, wrap it
      if (Array.isArray(json)) {
        console.warn(`Migrating section ${s} from array to object format`);
        json = {
          title: s === 'services' ? 'Specialized Dental Care' : s === 'pricing' ? 'Pricing' : 'Gallery',
          description: '',
          items: json,
          ...(s === 'services' ? { buttonText: 'View All' } : {}),
          ...(s === 'gallery' ? { label: 'Results' } : {}),
        };
      }
      setData(json);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(section); }, [section]);

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`${API}/api/content/${section}`, { method: "PUT", headers: authHeader(), body: JSON.stringify(data) });
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  if (loading) return <div className="text-white/50 text-sm px-2">Loading content...</div>;

  return (
    <div className="space-y-6">
      {/* Section Picker */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Pencil size={18} /> Content Editor</h2>
        <p className="text-white/50 text-sm mb-6">Edit the content displayed on the public website. Changes are saved instantly to the database.</p>
        <div className="flex gap-3">
          {(["services", "pricing", "gallery"] as const).map(s => (
            <button key={s} onClick={() => setSection(s)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all capitalize ${section === s ? "bg-brand-blue text-white" : "bg-white/5 text-white/50 hover:text-white border border-white/10"}`}>
              {s === "gallery" ? "Clinical Results" : s === "pricing" ? "Pricing" : "Services"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Services Editor ── */}
      {section === "services" && data && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Section Headers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Section Title</label>
                <input value={data.title} onChange={e => setData({ ...data, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Description</label>
                <textarea value={data.description} onChange={e => setData({ ...data, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50 resize-none" rows={2} />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Button Text</label>
                <input value={data.buttonText} onChange={e => setData({ ...data, buttonText: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {data.items?.map((svc: any, i: number) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Service {i + 1}</span>
                  <button onClick={() => { const d = { ...data }; d.items.splice(i, 1); setData(d); }} className="p-1.5 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"><Trash2 size={14} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Title</label>
                    <input value={svc.title} onChange={e => { const d = { ...data }; d.items[i].title = e.target.value; setData(d); }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Image URL</label>
                    <ImageInput value={svc.image} onChange={url => { const d = { ...data }; d.items[i].image = url; setData(d); }} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Description</label>
                  <textarea rows={2} value={svc.description} onChange={e => { const d = { ...data }; d.items[i].description = e.target.value; setData(d); }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50 resize-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Bullet Points</label>
                  <div className="space-y-2">
                    {svc.bullets?.map((b: string, bi: number) => (
                      <div key={bi} className="flex gap-2">
                        <input value={b} onChange={e => { const d = { ...data }; d.items[i].bullets[bi] = e.target.value; setData(d); }}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-brand-blue/50" />
                        <button onClick={() => { const d = { ...data }; d.items[i].bullets.splice(bi, 1); setData(d); }} className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"><Trash2 size={13} /></button>
                      </div>
                    ))}
                    <button onClick={() => { const d = { ...data }; d.items[i].bullets.push("New bullet"); setData(d); }}
                      className="flex items-center gap-1 text-xs text-brand-blue hover:text-blue-300 transition"><Plus size={13} /> Add bullet</button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setData({ ...data, items: [...data.items, { title: "New Service", description: "", image: "", bullets: [] }] })}
              className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/10 transition w-full justify-center">
              <Plus size={16} /> Add Service Item
            </button>
          </div>
        </div>
      )}

      {/* ── Pricing Editor ── */}
      {section === "pricing" && data && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Section Headers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Section Title</label>
                <input value={data.title} onChange={e => setData({ ...data, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Description</label>
                <textarea value={data.description} onChange={e => setData({ ...data, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50 resize-none" rows={2} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {data.items?.map((cat: any, i: number) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Category {i + 1}</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                      <input type="checkbox" checked={cat.highlight || false} onChange={e => { const d = { ...data }; d.items[i].highlight = e.target.checked; setData(d); }} className="accent-blue-500" />
                      Most Popular
                    </label>
                    <button onClick={() => { const d = { ...data }; d.items.splice(i, 1); setData(d); }} className="p-1.5 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Category Title</label>
                    <input value={cat.title} onChange={e => { const d = { ...data }; d.items[i].title = e.target.value; setData(d); }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Description</label>
                    <input value={cat.description} onChange={e => { const d = { ...data }; d.items[i].description = e.target.value; setData(d); }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Services &amp; Prices</label>
                  <div className="space-y-2">
                    {cat.services?.map((svc: any, si: number) => (
                      <div key={si} className="flex gap-2">
                        <input value={svc.name} placeholder="Service name" onChange={e => { const d = { ...data }; d.items[i].services[si].name = e.target.value; setData(d); }}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-brand-blue/50" />
                        <input value={svc.price} placeholder="Price" onChange={e => { const d = { ...data }; d.items[i].services[si].price = e.target.value; setData(d); }}
                          className="w-36 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-brand-blue/50" />
                        <button onClick={() => { const d = { ...data }; d.items[i].services.splice(si, 1); setData(d); }} className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"><Trash2 size={13} /></button>
                      </div>
                    ))}
                    <button onClick={() => { const d = { ...data }; d.items[i].services.push({ name: "New Service", price: "from $0" }); setData(d); }}
                      className="flex items-center gap-1 text-xs text-brand-blue hover:text-blue-300 transition"><Plus size={13} /> Add service row</button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setData({ ...data, items: [...data.items, { title: "New Category", description: "", highlight: false, services: [] }] })}
              className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/10 transition w-full justify-center">
              <Plus size={16} /> Add Category
            </button>
          </div>
        </div>
      )}

      {/* ── Gallery Editor ── */}
      {section === "gallery" && data && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Section Headers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Section Label</label>
                <input value={data.label} onChange={e => setData({ ...data, label: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Section Title</label>
                <input value={data.title} onChange={e => setData({ ...data, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Description</label>
                <textarea value={data.description} onChange={e => setData({ ...data, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50 resize-none" rows={2} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {data.items?.map((item: any, i: number) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Transformation {i + 1}</span>
                  <button onClick={() => { const d = { ...data }; d.items.splice(i, 1); setData(d); }} className="p-1.5 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"><Trash2 size={14} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Title</label>
                    <input value={item.title} onChange={e => { const d = { ...data }; d.items[i].title = e.target.value; setData(d); }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Description</label>
                    <input value={item.description} onChange={e => { const d = { ...data }; d.items[i].description = e.target.value; setData(d); }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-blue/50" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Before Image URL</label>
                    <ImageInput value={item.before} onChange={url => { const d = { ...data }; d.items[i].before = url; setData(d); }} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">After Image URL</label>
                    <ImageInput value={item.after} onChange={url => { const d = { ...data }; d.items[i].after = url; setData(d); }} />
                  </div>
                </div>
                {/* Preview */}
                <div className="flex gap-4 mt-2">
                  {item.before && <div className="flex-1"><p className="text-[10px] text-white/30 font-bold uppercase mb-1">Before Preview</p><img src={item.before} alt="before" className="h-24 w-full object-cover rounded-xl grayscale opacity-60" referrerPolicy="no-referrer" /></div>}
                  {item.after && <div className="flex-1"><p className="text-[10px] text-white/30 font-bold uppercase mb-1">After Preview</p><img src={item.after} alt="after" className="h-24 w-full object-cover rounded-xl" referrerPolicy="no-referrer" /></div>}
                </div>
              </div>
            ))}
            <button onClick={() => setData({ ...data, items: [...data.items, { id: Date.now(), title: "New Case", description: "", before: "", after: "" }] })}
              className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/10 transition w-full justify-center">
              <Plus size={16} /> Add Transformation Case
            </button>
          </div>
        </div>
      )}

      {/* Save Button */}
      {data && (
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={save} disabled={saving}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all ${saved ? "bg-green-500/20 text-green-400 border border-green-500/30" : "btn-primary"} disabled:opacity-50`}>
          <Save size={16} />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </motion.button>
      )}
    </div>
  );
}
