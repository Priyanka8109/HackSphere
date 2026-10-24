import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  UploadCloud, 
  MessageSquare, 
  Trophy, 
  User, 
  LogOut, 
  Code2, 
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardSidebar({ 
  mobileOpen, 
  setMobileOpen, 
  activeTab, 
  setActiveTab 
}) {
  const navigate = useNavigate();
  // Experiment 2 & 6: useContext via useAuth custom hook
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-team', label: 'My Team', icon: Users, badge: '4' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: '3/4' },
    { id: 'submission', label: 'Submission', icon: UploadCloud },
    { id: 'chat', label: 'Chat', icon: MessageSquare, badge: 'Live' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
    // Experiment 6: Show/hide Admin Portal based on user role
    ...(user?.role === 'admin' ? [{ id: 'admin-users', label: 'Admin Portal', icon: ShieldCheck, badge: 'ADMIN' }] : []),
  ];

  const handleItemClick = (id) => {
    if (id === 'chat') {
      // Navigate to Chat page route
      navigate('/chat');
    } else {
      setActiveTab(id);
    }
    if (setMobileOpen) setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    if (setMobileOpen) setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800">
      
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Code2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-white tracking-tight">
              Hack<span className="text-blue-400">Sphere</span>
            </span>
            <span className="text-[10px] text-slate-400 -mt-0.5">Workspace</span>
          </div>
        </Link>

        {/* Mobile close button */}
        {setMobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Active Sprint Mini Card */}
      <div className="p-3 mx-3 my-3 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
        <span className="text-[10px] font-semibold uppercase text-blue-400 tracking-wider block">
          Current Event
        </span>
        <div className="font-bold text-white mt-0.5 truncate">AI Innovation 2026</div>
        <div className="text-[11px] text-slate-400 mt-0.5">Team Alpha • Track #1</div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Info from AuthContext (useContext) & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 font-bold text-white flex items-center justify-center text-xs">
            {user?.avatar || 'P'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white truncate">
                {user?.name || 'Priyanka'}
              </span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                user?.role === 'admin' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {user?.role || 'user'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 truncate">
              {user?.email || 'priyanka@hacksphere.com'}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-3 py-1.5 text-xs font-medium rounded-md text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-red-900/30 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Workspace (Logout)</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-60 h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full shadow-xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
