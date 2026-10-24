import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle2, AlertCircle, Github, Globe } from 'lucide-react';
import Button from '../common/Button';
import useForm from '../../hooks/useForm';

export default function ProjectSubmitModal({ isOpen, onClose, onSubmitSuccess }) {
  const [success, setSuccess] = useState(false);

  // Form validation function
  const validate = (values) => {
    const errors = {};
    if (!values.projectTitle?.trim()) {
      errors.projectTitle = 'Project title is required';
    }
    if (!values.githubRepo?.trim()) {
      errors.githubRepo = 'GitHub repository URL is required';
    } else if (!values.githubRepo.includes('github.com')) {
      errors.githubRepo = 'Please enter a valid GitHub URL (e.g. https://github.com/user/repo)';
    }
    if (!values.description?.trim()) {
      errors.description = 'Please provide a short project summary';
    } else if (values.description.length < 20) {
      errors.description = 'Description should be at least 20 characters';
    }
    return errors;
  };

  // Submission handler using useForm hook
  const handleFormSubmit = async (formData) => {
    // Simulate async network submission
    await new Promise(resolve => setTimeout(resolve, 600));
    setSuccess(true);
    if (onSubmitSuccess) {
      onSubmitSuccess(formData);
    }
    setTimeout(() => {
      setSuccess(false);
      resetForm();
      onClose();
    }, 1200);
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm
  } = useForm(
    {
      projectTitle: '',
      track: 'AI Innovation',
      githubRepo: '',
      liveDemo: '',
      description: ''
    },
    validate,
    handleFormSubmit
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Submit Project</h3>
            <p className="text-xs text-slate-500">React Form powered by custom <code className="text-blue-600 font-mono">useForm</code> hook</p>
          </div>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Project Submitted Successfully!</h4>
            <p className="text-xs text-slate-500">Your project package has been recorded for review.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Project Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="projectTitle"
                value={values.projectTitle}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Autonomous AI Agent"
                className={`w-full px-3 py-2 text-sm bg-white rounded-lg border focus:outline-none focus:ring-2 ${
                  touched.projectTitle && errors.projectTitle
                    ? 'border-rose-300 focus:ring-rose-400'
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {touched.projectTitle && errors.projectTitle && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.projectTitle}
                </p>
              )}
            </div>

            {/* Track Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Challenge Track
              </label>
              <select
                name="track"
                value={values.track}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="AI Innovation">AI & Machine Learning Track</option>
                <option value="Web3">Web3 & Decentralized Track</option>
                <option value="Cloud Native">Cloud Native & DevOps Track</option>
              </select>
            </div>

            {/* GitHub Repo */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                GitHub Repository URL <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Github className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="url"
                  name="githubRepo"
                  value={values.githubRepo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://github.com/username/project"
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-white rounded-lg border focus:outline-none focus:ring-2 ${
                    touched.githubRepo && errors.githubRepo
                      ? 'border-rose-300 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
              </div>
              {touched.githubRepo && errors.githubRepo && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.githubRepo}
                </p>
              )}
            </div>

            {/* Live Demo URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Live Demo / Video Link (Optional)
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="url"
                  name="liveDemo"
                  value={values.liveDemo}
                  onChange={handleChange}
                  placeholder="https://my-demo-app.vercel.app"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Project Summary <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                rows={3}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Briefly explain what problem your hackathon project solves..."
                className={`w-full px-3 py-2 text-sm bg-white rounded-lg border focus:outline-none focus:ring-2 ${
                  touched.description && errors.description
                    ? 'border-rose-300 focus:ring-rose-400'
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {touched.description && errors.description && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button type="button" variant="secondary" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                icon={UploadCloud}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Project'}
              </Button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
