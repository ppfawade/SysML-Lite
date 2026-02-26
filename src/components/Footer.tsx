import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center text-xs text-slate-500 z-20">
      <div>
        &copy; 2026 Prashant Fawade. All rights reserved.
      </div>
      <div className="flex items-center gap-1">
        Built with <span className="font-medium text-slate-700">Gemini</span> and <span className="font-medium text-slate-700">Vercel</span>
      </div>
    </footer>
  );
}
