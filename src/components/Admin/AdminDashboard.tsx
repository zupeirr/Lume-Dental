import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, Clock, LogOut, CheckCircle, XCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface Stats {
  totalUsers: number;
  totalAppointments: number;
  pendingAppointments: number;
  totalServices: number;
  appointmentsByDate: any[];
  serviceStats: any[];
  statusStats: any[];
  recentAppointments: any[];
}

const PIE_COLORS = ['#F97316', '#22C55E', '#EF4444']; // pending, confirmed, cancelled

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStats = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [navigate]);

  const updateStatus = async (id: number, status: string) => {
    const token = localStorage.getItem("adminToken");
    try {
      await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      fetchStats(); // Refresh data
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-bg-deep p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/50 text-sm">Overview of Lume Dental operations</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-brand-blue/20 text-brand-blue rounded-full flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <p className="text-white/50 text-sm font-bold">Total Users</p>
                <h3 className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-white/50 text-sm font-bold">Total Bookings</p>
                <h3 className="text-2xl font-bold text-white">{stats?.totalAppointments || 0}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-white/50 text-sm font-bold">Pending Requests</p>
                <h3 className="text-2xl font-bold text-white">{stats?.pendingAppointments || 0}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointments Over Time */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl h-[400px]">
            <h2 className="text-xl font-bold text-white mb-6">Appointments Over Time</h2>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.appointmentsByDate || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#ffffff50" 
                  tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#ffffff50" allowDecimals={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#131316', borderColor: '#ffffff1a', borderRadius: '12px' }}
                  labelFormatter={(val) => new Date(val).toLocaleDateString()}
                />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-6">
            {/* Services Popularity */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl h-[188px]">
              <h2 className="text-xl font-bold text-white mb-2">Services Popularity</h2>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.serviceStats || []} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" horizontal={false} />
                  <XAxis type="number" stroke="#ffffff50" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" stroke="#ffffff50" width={120} tick={{ fontSize: 12 }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#131316', borderColor: '#ffffff1a', borderRadius: '12px' }}
                    cursor={{ fill: '#ffffff0a' }}
                  />
                  <Bar dataKey="total" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl h-[188px] flex items-center">
              <div className="w-1/2">
                <h2 className="text-xl font-bold text-white mb-2">Status Breakdown</h2>
                <ul className="space-y-2 mt-4 text-sm text-white/70">
                  {stats?.statusStats?.map((stat: any, index: number) => (
                    <li key={stat.status} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                      <span className="capitalize">{stat.status}</span>: <span className="font-bold text-white">{stat.total}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.statusStats || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="total"
                    >
                      {stats?.statusStats?.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: '#131316', borderColor: '#ffffff1a', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Recent Appointments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="bg-white/5 text-white/50 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {stats?.recentAppointments?.map((apt: any) => (
                  <tr key={apt.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{apt.name}</div>
                      <div className="text-xs text-white/50">{apt.email || apt.phone}</div>
                    </td>
                    <td className="px-6 py-4">{apt.service_name}</td>
                    <td className="px-6 py-4">
                      {new Date(apt.appointment_date).toLocaleString(undefined, {
                        dateStyle: 'medium', timeStyle: 'short'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        apt.status === 'pending' ? 'bg-orange-500/20 text-orange-500' :
                        apt.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {apt.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => updateStatus(apt.id, 'confirmed')}
                            className="p-2 text-green-500 hover:bg-green-500/10 rounded-full transition"
                            title="Confirm"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => updateStatus(apt.id, 'cancelled')}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition"
                            title="Cancel"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {stats?.recentAppointments?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-white/50">
                      No recent appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
