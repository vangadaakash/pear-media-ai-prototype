import React, { useState } from 'react';
import { getEnhancedPrompt, generateImage } from '../utils/apiHelpers';
import { Wand2, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function WorkflowText() {
  const [prompt, setPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Input, 2: Approval, 3: Result

  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const result = await getEnhancedPrompt(prompt);
      setEnhancedPrompt(result);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!enhancedPrompt.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const url = await generateImage(enhancedPrompt);
      setImageUrl(url);
      setStep(3);
    } catch (err) {
      setError("Failed to create image URL.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setEnhancedPrompt('');
    setImageUrl('');
    setStep(1);
    setError('');
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-slate-200/50 border border-white p-6 sm:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl"></div>

      <h2 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center relative z-10">
        <span className="bg-indigo-100 p-2 rounded-xl mr-3 text-indigo-600">
          <Wand2 size={28} />
        </span>
        Creative Studio
      </h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50/80 backdrop-blur border border-red-200 text-red-600 rounded-2xl text-sm flex items-center shadow-sm relative z-10">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
          {error}
        </div>
      )}

      <div className="relative z-10">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 ml-1">What would you like to see?</label>
              <textarea
                className="w-full p-5 bg-slate-50/50 border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none h-40 text-slate-800 text-lg shadow-sm placeholder:text-slate-400"
                placeholder="E.g., A sprawling futuristic city under a neon sunset..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleEnhance}
              disabled={isLoading || !prompt.trim()}
              className="w-full sm:w-auto py-4 px-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-1"
            >
              {isLoading ? <Loader2 className="animate-spin mr-3" size={22} /> : <Wand2 className="mr-3" size={22} />}
              {isLoading ? 'Enhancing your idea...' : 'Enhance Prompt Magic'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 ml-1">Review Enhanced Prompt</label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-500 opacity-5 rounded-2xl"></div>
                <textarea
                  className="w-full p-5 bg-white/50 backdrop-blur-sm border border-indigo-200/60 rounded-2xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none resize-none h-48 text-slate-800 text-lg shadow-sm"
                  value={enhancedPrompt}
                  onChange={(e) => setEnhancedPrompt(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-2xl transition-all duration-300 shadow-sm hover:shadow active:scale-95"
                disabled={isLoading}
              >
                Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={isLoading || !enhancedPrompt.trim()}
                className="flex-1 py-4 px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:-translate-y-1 disabled:opacity-50 active:scale-95"
              >
                <ImageIcon className="mr-3" size={22} />
                Generate Masterpiece
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="relative aspect-square w-full sm:w-[512px] mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-indigo-900/20 border-4 border-white bg-slate-100 group">
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50">
                  <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
                  <p className="text-sm sm:text-base text-slate-500 font-medium animate-pulse">Painting with pixels...</p>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img 
                    src={imageUrl} 
                    alt="Generated output" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onLoad={() => setIsLoading(false)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                     <p className="text-white text-sm line-clamp-2 drop-shadow-md">{enhancedPrompt}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-800 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 font-semibold rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md flex items-center active:scale-95"
              >
                <Wand2 className="mr-3" size={20} />
                Start New Creation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
