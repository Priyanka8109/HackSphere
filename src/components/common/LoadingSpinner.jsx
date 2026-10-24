import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading data...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}
