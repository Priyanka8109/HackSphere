import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">
                Hack<span className="text-blue-400">Sphere</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hackathon management platform for participants, mentors, and organizers.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <a href="#hackathons" className="hover:text-white transition-colors">Hackathons</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Participant Login</Link>
              </li>
            </ul>
          </div>

          {/* Experiments Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Course Experiments
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5 text-blue-400 font-medium">
                <span>✓ Exp 1: Tailwind CSS Pages</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span>✓ Exp 2: React Hooks & Forms</span>
              </li>
              <li className="text-slate-500">
                <span>○ Exp 3-10: Upcoming Milestones</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Support
            </h4>
            <p className="text-xs text-slate-400">
              Questions or issues regarding HackSphere?
            </p>
            <div className="text-xs text-blue-400 font-medium">
              support@hacksphere.edu
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © {currentYear} HackSphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
