import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Hero from '../components/home/Hero';
import HackathonCard from '../components/home/HackathonCard';
import HowItWorks from '../components/home/HowItWorks';
import FeatureCard from '../components/home/FeatureCard';
import CallToAction from '../components/home/CallToAction';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import { useTasks } from '../context/TaskContext';
import { fetchHackathonsAsync } from '../data/mockData';
import { RefreshCw, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Experiment 2: useFetch custom hook for data fetching
  const { data: hackathons, loading, error, refetch } = useFetch(fetchHackathonsAsync);

  // Experiment 2: useMemo hook for filtering data
  const filteredHackathons = useMemo(() => {
    if (!hackathons) return [];
    if (!debouncedSearch.trim()) return hackathons;

    const query = debouncedSearch.toLowerCase().trim();
    return hackathons.filter(
      (h) =>
        h.title.toLowerCase().includes(query) ||
        h.description.toLowerCase().includes(query) ||
        h.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [hackathons, debouncedSearch]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero with Search */}
        <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Active Hackathons Section */}
        <section id="hackathons" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Active Hackathons
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Explore open challenges and register with your squad.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span>
                Showing {filteredHackathons.length} of {hackathons?.length || 0}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={refetch}
                icon={RefreshCw}
                title="Refetch data with useFetch hook"
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading && <LoadingSpinner message="Fetching hackathon challenges (useFetch)..." />}

          {/* Error State */}
          {error && (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <p className="text-sm font-semibold text-red-800">{error}</p>
              <Button variant="danger" size="sm" onClick={refetch}>
                Retry Loading
              </Button>
            </div>
          )}

          {/* Hackathons Grid */}
          {!loading && !error && (
            <>
              {filteredHackathons.length === 0 ? (
                <div className="p-10 text-center bg-white rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-600 mb-2">No hackathons match "{debouncedSearch}"</p>
                  <Button variant="secondary" size="sm" onClick={() => setSearchTerm('')}>
                    Reset Search Filter
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHackathons.map((hackathon) => (
                    <HackathonCard key={hackathon.id} hackathon={hackathon} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* How It Works */}
        <HowItWorks />

        {/* Features */}
        <FeatureCard />

        {/* Call to Action */}
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}
