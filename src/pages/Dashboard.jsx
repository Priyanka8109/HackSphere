import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  Search, 
  Calendar, 
  UploadCloud, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import StatCard from '../components/dashboard/StatCard';
import TeamSection from '../components/dashboard/TeamSection';
import TaskList from '../components/TaskList';
import DeadlineCard from '../components/dashboard/DeadlineCard';
import AnnouncementList from '../components/dashboard/AnnouncementList';
import ProjectSubmitModal from '../components/dashboard/ProjectSubmitModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import useFetch from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { fetchDashboardDataAsync } from '../data/mockData';
import { API_ENDPOINTS } from '../config/api';

export default function Dashboard() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Experiment 2: useContext via useAuth custom hook
  const { user } = useAuth();

  // Experiment 3: useContext(TaskContext) - Access Global Task State
  const { tasks } = useTasks();

  // Experiment 6: Admin Users state and fetch handler
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');

  const fetchAdminUsers = async () => {
    setAdminLoading(true);
    setAdminError('');
    try {
      const token = localStorage.getItem('hacksphere_token') || user?.token;
      const res = await fetch(API_ENDPOINTS.ADMIN_USERS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const resData = await res.json();
      if (!res.ok) {
        setAdminError(resData.message || 'Access denied or failed to fetch admin users');
        return;
      }
      setAdminUsers(resData.users || []);
    } catch (err) {
      setAdminError('Failed to connect to backend server');
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'admin-users') {
      fetchAdminUsers();
    }
  }, [activeTab]);

  // Experiment 2 – useEffect: runs when the component first mounts
  useEffect(() => {
    alert("Dashboard loaded successfully!");
    document.title = "Dashboard – Hacker | HackSphere";

    // Cleanup: restore default title when leaving this page
    return () => {
      document.title = "HackSphere";
    };
  }, [user?.name]);

  // Experiment 2: useFetch custom hook to fetch initial dashboard data
  const { data, loading, error, refetch, setData } = useFetch(fetchDashboardDataAsync);

  // Experiment 3: Calculate dynamic statistics from the global tasks state
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Done').length;
  const taskProgressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Dynamic stats array derived from global Context API state
  const dynamicStats = useMemo(() => {
    return [
      {
        id: 'stat-team',
        title: 'Team Members',
        value: '4 / 4',
        subtitle: 'Squad Full (Team Alpha)',
        icon: 'Users',
        color: 'blue',
        percent: 100
      },
      {
        id: 'stat-tasks',
        title: 'Tasks Completed',
        value: `${completedTasks} / ${totalTasks}`,
        subtitle: `${taskProgressPercent}% tasks completed`,
        icon: 'CheckSquare',
        color: 'emerald',
        percent: taskProgressPercent
      },
      {
        id: 'stat-sub',
        title: 'Submission Progress',
        value: `${taskProgressPercent}%`,
        subtitle: `${completedTasks} of ${totalTasks} milestones completed`,
        icon: 'UploadCloud',
        color: 'indigo',
        percent: taskProgressPercent
      },
      {
        id: 'stat-time',
        title: 'Days Remaining',
        value: '2 Days',
        subtitle: 'Submission deadline soon',
        icon: 'Clock',
        color: 'amber',
        percent: 40
      }
    ];
  }, [totalTasks, completedTasks, taskProgressPercent]);

  const handleProjectSubmitted = (formData) => {
    if (data) {
      setData({
        ...data,
        currentHackathon: {
          ...data.currentHackathon,
          progressPercentage: 100
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      
      {/* Sidebar Navigation */}
      <DashboardSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shadow-sm">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative hidden sm:block w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search dashboard..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>{user?.team || 'Team Alpha'} (Online)</span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={refetch}
              icon={RefreshCw}
              title="Refetch data with useFetch"
            >
              Sync
            </Button>

            <Link to="/">
              <Button variant="ghost" size="sm">
                Exit to Home
              </Button>
            </Link>
          </div>

        </header>

        {/* Dashboard Body */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {loading && <LoadingSpinner message="Loading participant dashboard (useFetch)..." />}

          {error && (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <p className="text-sm font-semibold text-red-800">{error}</p>
              <Button variant="danger" size="sm" onClick={refetch}>
                Retry Loading
              </Button>
            </div>
          )}

          {/* Experiment 6: Admin Users Management Tab (Role-based UI) */}
          {activeTab === 'admin-users' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                        Admin Protected Route
                      </span>
                      <span className="text-xs text-slate-500 font-mono">GET /api/admin/users</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mt-2">Registered Users Directory</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Demonstrating JWT Role-Based Authorization (Experiment 6). Accessible exclusively by accounts with role = 'admin'.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={fetchAdminUsers} disabled={adminLoading}>
                    {adminLoading ? 'Refreshing...' : 'Refresh List'}
                  </Button>
                </div>

                {adminError && (
                  <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
                    {adminError}
                  </div>
                )}

                {adminLoading ? (
                  <div className="py-12 text-center text-xs text-slate-500 font-medium">
                    Loading users from MongoDB via protected JWT route...
                  </div>
                ) : (
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">User Name</th>
                          <th className="py-3 px-4">Email Address</th>
                          <th className="py-3 px-4">Role</th>
                          <th className="py-3 px-4">User ID</th>
                          <th className="py-3 px-4">Registration Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {adminUsers.map((u) => (
                          <tr key={u._id} className="hover:bg-slate-50/70">
                            <td className="py-3 px-4 font-semibold text-slate-900">{u.name}</td>
                            <td className="py-3 px-4 text-slate-600 font-mono">{u.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                u.role === 'admin' 
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{u._id}</td>
                            <td className="py-3 px-4 text-slate-500">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {!loading && !error && data && activeTab !== 'admin-users' && (
            <>
              {/* Welcome Section */}
              <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    Participant Dashboard
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Welcome back, {user?.name || 'Priyanka'}! 👋
                  </h1>
                  <p className="text-sm text-slate-600 mt-1">
                    Current Event: <strong className="text-slate-800 font-bold">{data.currentHackathon.title}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Oct 24 - 26, 2026</span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsSubmitModalOpen(true)}
                    icon={UploadCloud}
                  >
                    Submit Project
                  </Button>
                </div>
              </div>

              {/* Statistics Cards derived from Global TaskContext */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dynamicStats.map((stat) => (
                  <StatCard key={stat.id} stat={stat} />
                ))}
              </div>

              {/* Grid 1: Team & Tasks (TaskList accesses TaskContext directly) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TeamSection team={data.team} />
                <TaskList />
              </div>

              {/* Grid 2: Deadline & Announcements */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DeadlineCard
                  currentHackathon={{
                    ...data.currentHackathon,
                    progressPercentage: taskProgressPercent
                  }}
                  onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
                />
                <AnnouncementList announcements={data.announcements} />
              </div>
            </>
          )}

        </main>

        {/* Submission Modal */}
        <ProjectSubmitModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmitSuccess={handleProjectSubmitted}
        />

        {/* Dashboard Footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HackSphere Platform • Experiments 1, 2 & 3</span>
          <span className="text-slate-400">React 18 + Context API (TaskContext) + Tailwind CSS</span>
        </footer>

      </div>
    </div>
  );
}
