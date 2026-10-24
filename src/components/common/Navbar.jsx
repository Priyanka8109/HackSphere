import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code2, Menu, X, Rocket, LogIn, LogOut, User, ChevronRight } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Experiment 2: useContext via useAuth custom hook
  const { user, isAuthenticated, logout } = useAuth();

  // Experiment 3: useContext via useTasks custom hook for global tasks count
  const { tasks } = useTasks();
  const doneTasksCount = tasks.filter((t) => t.status === 'Done').length;
  const remainingTasksCount = tasks.length - doneTasksCount;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Hackathons', path: '/#hackathons' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Features', path: '/#features' },
  ];

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      const id = path.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                Hack<span className="text-blue-600">Sphere</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
                Hackathon Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => {
                  if (link.path.startsWith('/#')) {
                    e.preventDefault();
                    handleNavClick(link.path);
                  }
                }}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Buttons with useContext dynamic state (Done & Remaining) */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/dashboard" title="View global tasks status in Dashboard">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-900 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors shadow-sm">
                <span>Tasks:</span>
                <strong className="text-emerald-700 font-bold">{doneTasksCount} Done</strong>
                <span className="text-slate-400">•</span>
                <strong className="text-amber-700 font-bold">{remainingTasksCount} Remaining</strong>
              </span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 hover:bg-blue-100 transition-colors">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                      {user.avatar || 'U'}
                    </span>
                    <span>{user.name}</span>
                  </div>
                </Link>
                <Link to="/dashboard">
                  <Button variant="primary" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  icon={LogOut}
                  title="Logout (useContext)"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" icon={LogIn}>
                    Login
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="primary" size="sm" icon={Rocket} iconPosition="right">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.avatar || 'U'}
                </span>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => {
                  if (link.path.startsWith('/#')) {
                    e.preventDefault();
                    handleNavClick(link.path);
                  } else {
                    setMobileMenuOpen(false);
                  }
                }}
                className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </div>

          {/* Mobile Global Tasks Summary Badge */}
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-medium text-slate-800"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-900">Global Tasks State:</span>
              <span className="font-bold">
                <span className="text-emerald-700">{doneTasksCount} Done</span> • <span className="text-amber-700">{remainingTasksCount} Remaining</span>
              </span>
            </div>
          </Link>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                <Button variant="secondary" size="md" className="w-full" onClick={handleLogout} icon={LogOut}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="md" className="w-full" icon={LogIn}>
                    Login
                  </Button>
                </Link>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full" icon={Rocket} iconPosition="right">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
