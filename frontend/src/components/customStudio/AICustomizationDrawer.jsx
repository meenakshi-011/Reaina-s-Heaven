import React, { useState } from "react";
import { Sparkles, X, Send, CheckCircle2, ArrowRight, Lightbulb, Package, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { analyzeCustomizationWithAI } from "../../services/api";

const SAMPLE_PROMPTS = [
  "A romantic blush pink floral bouquet with Dutch roses, eucalyptus, and a luxury Korean wrapping for my 2nd anniversary.",
  "Birthday hamper for my best friend who loves skincare, dark chocolates, lavender aesthetics and cute stationery under ₹1500.",
  "2-tier minimalist botanical cake with Belgian dark chocolate, pastel sage frosting, edible pansies, and eggless sponge.",
  "Custom high-tea savory platter with vegetarian momos and artisan dips for an intimate family gathering.",
];

const AICustomizationDrawer = ({
  isOpen,
  onClose,
  onApplyBrief,
  initialCategory = "",
}) => {
  const [prompt, setPrompt] = useState("");
  const [budget, setBudget] = useState(1500);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe your custom vision.");
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeCustomizationWithAI({
        prompt,
        budget: Number(budget) || null,
        category: initialCategory || undefined,
      });

      setAnalysisResult(result);
      toast.success("AI Design Brief crafted!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to analyze requirements");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!analysisResult) return;
    onApplyBrief(analysisResult);
    onClose();
    toast.success("AI brief loaded into your Custom Studio!");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 border-l border-[#e8dfd5]">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#e8dfd5] bg-white flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#a67c52] to-[#c99a6b] flex items-center justify-center text-white shadow-xs">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-gray-900">AI Customization Consultant</h2>
              <p className="text-xs text-gray-500">Gemini-powered creative design assistance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Natural Language Prompt Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>Tell Us Your Dream Creation</span>
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. I want an anniversary hamper with roses, scented soy candle, and Belgian brownies. My budget is ₹2000. I want it to look warm and luxurious..."
              className="w-full p-3.5 rounded-2xl border border-[#ded5cb] bg-white focus:outline-none focus:border-[#a67c52] text-sm text-gray-800 placeholder-gray-400 shadow-inner resize-none"
            />
          </div>

          {/* Quick Inspiration Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
              <Lightbulb size={12} className="text-[#a67c52]" /> Tap for Inspiration:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(p)}
                  className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-[#a67c52] text-gray-600 hover:text-gray-900 transition-colors shadow-2xs"
                >
                  "{p.slice(0, 48)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Budget Setting */}
          <div className="space-y-2 bg-white p-4 rounded-2xl border border-[#e8dfd5]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-700">Target Budget</span>
              <span className="text-base font-serif font-bold text-[#a67c52]">₹{budget}</span>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={100}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-[#a67c52] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>₹500 (Modest)</span>
              <span>₹5,000 (Grand)</span>
              <span>₹10,000+ (Lavish)</span>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading || !prompt.trim()}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#a67c52] hover:bg-[#926941] text-white font-medium text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Analyzing Your Vision...
              </span>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate Structured AI Design Brief</span>
              </>
            )}
          </button>

          {/* Structured Output Card */}
          {analysisResult && (
            <div className="bg-white rounded-2xl p-5 border border-[#e0d6cb] shadow-sm space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-1.5 text-green-700 text-xs font-bold">
                  <CheckCircle2 size={16} />
                  <span>Structured Brief Generated</span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#a67c52]/10 text-[#a67c52] font-semibold uppercase">
                  {analysisResult.category}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Design Theme</span>
                  <p className="font-semibold text-gray-800">{analysisResult.theme || "Luxury Botanical"}</p>
                </div>

                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Occasion</span>
                  <p className="font-semibold text-gray-800">{analysisResult.occasion}</p>
                </div>

                {analysisResult.preferences && analysisResult.preferences.length > 0 && (
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold mb-1">Extracted Preferences</span>
                    <div className="flex flex-wrap gap-1">
                      {analysisResult.preferences.map((pref, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px]">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Artisan Creative Direction</span>
                  <p className="text-gray-600 italic bg-[#fbf9f6] p-2.5 rounded-xl border border-gray-100 mt-1">
                    "{analysisResult.designDescription}"
                  </p>
                </div>

                {analysisResult.suggestedProducts && analysisResult.suggestedProducts.length > 0 && (
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold mb-1.5">
                      Suggested Real Catalogue Products
                    </span>
                    <div className="space-y-1.5">
                      {analysisResult.suggestedProducts.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                          <div className="flex items-center gap-2">
                            <Package size={14} className="text-[#a67c52]" />
                            <span className="font-semibold text-gray-800">{p.name}</span>
                          </div>
                          <span className="font-bold text-[#a67c52]">₹{p.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResult.missingDetails && analysisResult.missingDetails.length > 0 && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-amber-900">
                    <span className="text-[10px] font-bold uppercase block mb-1 flex items-center gap-1">
                      <AlertCircle size={12} /> Questions for perfection:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {analysisResult.missingDetails.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Apply to Studio Action */}
              <button
                type="button"
                onClick={handleApply}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#2d3a2d] to-[#3a4d3a] hover:from-[#232e23] hover:to-[#2d3a2d] text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Load Brief Into Interactive Studio</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AICustomizationDrawer;

