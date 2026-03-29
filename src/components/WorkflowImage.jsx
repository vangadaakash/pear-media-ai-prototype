import React, { useState, useRef } from 'react';
import { analyzeImage, generateImage } from '../utils/apiHelpers';
import { Upload, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function WorkflowImage() {
  const [imagePreview, setImagePreview] = useState('');
  const [base64Image, setBase64Image] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [variationUrl, setVariationUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setError("Image size should be below 4MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setBase64Image(reader.result);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeAndGenerate = async () => {
    if (!base64Image) return;
    setIsLoading(true);
    setError('');

    try {
      // Step 1: Vision Analysis
      const imgAnalysis = await analyzeImage(base64Image);
      setAnalysis(imgAnalysis);

      // Step 2: Build new prompt
      const newPrompt = `A stunning variation of an image featuring: ${imgAnalysis}. Maintain the core subject but reimagine the composition creatively.`;

      // Step 3: Trigger Generation
      const generatedUrl = await generateImage(newPrompt);
      setVariationUrl(generatedUrl);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImagePreview('');
    setBase64Image('');
    setAnalysis('');
    setVariationUrl('');
    setStep(1);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-slate-200/50 border border-white p-6 sm:p-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-64 h-64 rounded-full bg-fuchsia-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl"></div>

      <h2 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center relative z-10">
        <span className="bg-violet-100 p-2 rounded-xl mr-3 text-violet-600">
          <Sparkles size={28} />
        </span>
        Style Lab
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
            <div
              className={`border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden ${imagePreview
                  ? 'border-violet-300 bg-white/50 p-4 shadow-inner'
                  : 'border-slate-300 hover:border-violet-400 bg-slate-50/50 p-12 hover:bg-white/60 cursor-pointer shadow-sm'
                }`}
              onClick={() => !imagePreview && fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative w-full sm:w-2/3 max-h-[350px] mx-auto rounded-2xl overflow-hidden group border border-slate-200 shadow-md">
                  <img src={imagePreview} alt="Upload preview" className="w-full h-full object-contain bg-slate-50/50 backdrop-blur-sm" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); setImagePreview(''); setBase64Image(''); }}
                      className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white px-6 py-2 text-sm font-semibold rounded-full transition-all hover:scale-105"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center mx-auto mb-5 text-violet-500 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-3">
                    <Upload size={32} strokeWidth={2} />
                  </div>
                  <p className="text-slate-700 font-semibold mb-2 text-lg">Click here to upload</p>
                  <p className="text-slate-500 font-medium text-sm">Supports JPG, PNG (Max 4MB)</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <button
              onClick={handleAnalyzeAndGenerate}
              disabled={isLoading || !base64Image}
              className="w-full sm:w-auto py-4 px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:-translate-y-1 mx-auto block w-full"
            >
              {isLoading ? <Loader2 className="animate-spin mr-3" size={22} /> : <Sparkles className="mr-3" size={22} />}
              {isLoading ? 'Analyzing & Reimagining...' : 'Reverse Engineer & Reimagine'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-in fade-in zoom-in-95 duration-700">
            {/* Original Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 flex items-center text-lg"><ImageIcon className="mr-2 text-violet-500" size={20} /> Original Analysis</h3>
              <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-3 border border-slate-200/60 aspect-square flex items-center justify-center overflow-hidden shadow-inner">
                <img src={imagePreview} className="max-h-full object-contain rounded-xl hover:scale-105 transition-transform duration-500" alt="Original" />
              </div>
              <div className="bg-gradient-to-br from-violet-50/80 to-fuchsia-50/80 backdrop-blur-md border border-violet-100/50 rounded-2xl p-5 shadow-sm">
                <p className="text-sm text-violet-900 leading-relaxed font-medium">
                  <span className="opacity-80 block mb-1 uppercase tracking-wider text-xs font-bold text-violet-600">Detected Elements</span>
                  {analysis}
                </p>
              </div>
            </div>

            {/* New Variation */}
            <div className="space-y-4 flex flex-col">
              <h3 className="font-semibold text-slate-800 flex items-center text-lg"><Sparkles className="mr-2 text-fuchsia-600" size={20} /> AI Variation</h3>
              <div className="relative bg-white rounded-2xl p-2 border-2 border-fuchsia-100 aspect-square flex items-center justify-center overflow-hidden shadow-2xl shadow-fuchsia-900/10 group">
                {isLoading ? (
                  <div className="flex flex-col items-center bg-slate-50 absolute inset-0 justify-center">
                    <Loader2 className="animate-spin text-fuchsia-500 mb-4" size={40} />
                    <span className="text-sm font-medium text-slate-500 animate-pulse">Generating variation...</span>
                  </div>
                ) : (
                  <img src={variationUrl} className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105" alt="Generated Variation" />
                )}
              </div>
              <button
                onClick={handleReset}
                className="w-full py-4 mt-auto bg-white border border-slate-200/80 text-slate-700 hover:text-fuchsia-600 hover:border-fuchsia-200 hover:bg-fuchsia-50 font-semibold rounded-2xl transition-all duration-300 shadow-sm hover:shadow active:scale-95 flex items-center justify-center"
              >
                <Sparkles className="mr-2" size={18} />
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
