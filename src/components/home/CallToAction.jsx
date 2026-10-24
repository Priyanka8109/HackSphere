import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

export default function CallToAction() {
  return (
    <section className="py-14 sm:py-16 bg-blue-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Ready to Start Hacking?
        </h2>
        <p className="text-sm sm:text-base text-blue-100 mb-8 max-w-xl mx-auto">
          Join active hackathons, form your team, build projects, and compete on the live leaderboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/login" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto text-blue-700 font-bold bg-white hover:bg-blue-50 border-transparent shadow-md"
              icon={Rocket}
              iconPosition="right"
            >
              Start Hacking
            </Button>
          </Link>
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-white text-white hover:bg-blue-700"
              icon={ArrowRight}
              iconPosition="right"
            >
              View Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
