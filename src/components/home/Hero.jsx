import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Trophy, Users, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';

export default function Hero({ searchTerm, setSearchTerm }) {
  const scrollToHackathons = () => {
    const el = document.getElementById('hackathons');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-b from-blue-50/50 to-white py-14 sm:py-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-6">
            <Trophy className="w-3.5 h-3.5 text-blue-600" />
            <span>Hackathon Management Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            BUILD. INNOVATE. COMPETE.
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
            Manage your hackathon journey, collaborate with your team, connect with mentors, submit projects, and compete on a live leaderboard.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Button
              variant="primary"
              size="lg"
              onClick={scrollToHackathons}
              className="w-full sm:w-auto"
            >
              Explore Hackathons
            </Button>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Search Input powered by React State & useDebounce */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search challenges (e.g. AI, Web3, Cloud)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-medium"
              >
                Clear
              </button>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
