import React, { useState } from 'react';
import Navbar from './components/Navbar';
import WorkflowText from './components/WorkflowText';
import WorkflowImage from './components/WorkflowImage';

export default function App() {
  const [activeTab, setActiveTab] = useState('text');

  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Main Content Container - Glassmorphism */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl shadow-indigo-500/10 rounded-3xl p-4 sm:p-8">
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 p-1 bg-slate-100/50 rounded-2xl w-fit mx-auto lg:mx-0 border border-white/40 shadow-inner">
            <button
              onClick={() => setActiveTab('text')}
              className={`py-3 px-6 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 relative ${
                activeTab === 'text' 
                  ? 'text-indigo-700 bg-white shadow-sm ring-1 ring-slate-900/5' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
              }`}
            >
              Creative Studio
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`py-3 px-6 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 relative ${
                activeTab === 'image' 
                  ? 'text-indigo-700 bg-white shadow-sm ring-1 ring-slate-900/5' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
              }`}
            >
              Style Lab (Image)
            </button>
          </div>

          {/* Tab Content */}
          <div className="transition-all duration-500">
            {activeTab === 'text' ? <WorkflowText /> : <WorkflowImage />}
          </div>
        </div>
      </main>
    </div>
  );
}
