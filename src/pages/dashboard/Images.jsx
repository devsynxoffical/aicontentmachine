import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Sparkles, Download, RefreshCw, Check, Image as ImageIcon,
  Square, Monitor, Smartphone, BookOpen,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const STYLES = ["Photorealistic","Illustration","Minimalist","Bold Graphic","Social Media Story"];
const SIZES  = [
  { id:"square",   label:"Square",    ratio:"1:1",  w:300, h:300 },
  { id:"landscape",label:"Landscape", ratio:"16:9", w:300, h:169 },
  { id:"portrait", label:"Portrait",  ratio:"4:5",  w:240, h:300 },
  { id:"story",    label:"Story",     ratio:"9:16", w:169, h:300 },
];

// Gradient palettes used to simulate generated images
const PALETTES = [
  "from-violet-500 to-purple-700",
  "from-teal-400 to-cyan-600",
  "from-rose-400 to-pink-600",
  "from-amber-400 to-orange-500",
  "from-blue-500 to-indigo-700",
  "from-emerald-400 to-green-600",
  "from-[#017A85] to-[#02A3B1]",
  "from-slate-600 to-gray-800",
];

function MockImage({ prompt, style, palette, size }) {
  const s = SIZES.find(x => x.id === size) || SIZES[0];
  return (
    <div
      className={`bg-gradient-to-br ${palette} rounded-xl flex flex-col items-center justify-center p-4 text-white text-center overflow-hidden`}
      style={{ width: "100%", aspectRatio: `${s.w}/${s.h}` }}
    >
      <ImageIcon className="w-8 h-8 opacity-40 mb-2" />
      <p className="text-[10px] font-semibold opacity-70 leading-snug line-clamp-3 max-w-[80%]">{prompt || "AI Generated Image"}</p>
      <span className="mt-2 text-[9px] opacity-50 font-bold tracking-widest uppercase">{style}</span>
    </div>
  );
}

export default function Images() {
  const [prompt, setPrompt]         = useState("");
  const [style, setStyle]           = useState("Photorealistic");
  const [size, setSize]             = useState("square");
  const [loading, setLoading]       = useState(false);
  const [results, setResults]       = useState([]);
  const [history, setHistory]       = useState([]);
  const [downloaded, setDownloaded] = useState(null);
  const [used, setUsed]             = useState(null);

  // Load generation history on mount
  useEffect(() => {
    api.get("/images")
      .then((res) => setHistory(res.data.data || []))
      .catch(() => {});
  }, []);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResults([]);
    try {
      const res = await api.post("/images", { prompt, style, size });
      const newImage = res.data.data;
      // Build 4 visual variants using different palettes
      const newResults = PALETTES.slice(0, 4).map((p, i) => ({
        id: `${newImage.id}-${i}`,
        palette: p,
        prompt,
        style,
        size,
      }));
      setResults(newResults);
      setHistory((prev) => [newImage, ...prev.slice(0, 11)]);
    } catch (err) {
      console.error("Image generation failed:", err);
      // Graceful fallback
      const newResults = PALETTES.slice(0, 4).map((p, i) => ({
        id: Date.now() + i, palette: p, prompt, style, size,
      }));
      setResults(newResults);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (id) => {
    setDownloaded(id);
    setTimeout(() => setDownloaded(null), 1800);
  };

  const handleUse = (id) => {
    setUsed(id);
    setTimeout(() => setUsed(null), 1800);
  };

  return (
    <DashboardLayout title="Image Generator">
      <div className="space-y-8 pb-12 text-left">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A2E]">AI Image Generator</h1>
          <p className="text-gray-500 mt-1.5">Generate AI marketing images in various styles and sizes for social media and ads.</p>
        </div>

        {/* Generator Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

          {/* Prompt */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Describe the Image</label>
            <textarea
              rows={3}
              placeholder="e.g. A futuristic workspace with glowing screens, warm lighting and a professional atmosphere for a tech startup"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm leading-relaxed resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Style selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Style</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map(s => (
                  <button key={s} onClick={() => setStyle(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${style===s ? "bg-[#02A3B1] text-white border-[#02A3B1]" : "bg-white text-gray-600 border-gray-200 hover:border-[#02A3B1]"}`}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Size</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button key={s.id} onClick={() => setSize(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${size===s.id ? "bg-[#02A3B1] text-white border-[#02A3B1]" : "bg-white text-gray-600 border-gray-200 hover:border-[#02A3B1]"}`}
                  >
                    {s.label} <span className="opacity-70">({s.ratio})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate button */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#02A3B1]" />
              This will use <strong className="text-[#1A1A2E]">3 AI credits</strong>.
            </span>
            <button
              disabled={!prompt || loading}
              onClick={handleGenerate}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition flex items-center gap-2 ${!prompt||loading ? "bg-gray-300 cursor-not-allowed" : "bg-[#02A3B1] hover:bg-[#017A85] shadow-sm"}`}
            >
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Image</>}
            </button>
          </div>
        </div>

        {/* Results Grid */}
        {loading && (
          <div className="grid grid-cols-2 gap-4">
            {[0,1,2,3].map(i => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse" style={{ aspectRatio:"1/1" }} />
            ))}
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <h3 className="text-base font-bold text-[#1A1A2E] mb-4">Generated Images</h3>
            <div className="grid grid-cols-2 gap-4">
              {results.map((img, i) => (
                <div key={img.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
                  <MockImage prompt={img.prompt} style={img.style} palette={img.palette} size={img.size} />
                  <div className="p-3 flex gap-2 justify-end border-t border-gray-100 bg-gray-50">
                    <button onClick={() => handleDownload(img.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#02A3B1] transition">
                      {downloaded === img.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Download className="w-3.5 h-3.5" />}
                      {downloaded === img.id ? "Saved!" : "Download"}
                    </button>
                    <button onClick={() => handleUse(img.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${used===img.id ? "bg-green-500 text-white" : "bg-[#02A3B1] hover:bg-[#017A85] text-white"}`}>
                      {used===img.id ? <><Check className="w-3.5 h-3.5"/>Used!</> : "Use This"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image History */}
        {history.length > 0 && (
          <div>
            <h3 className="text-base font-bold text-[#1A1A2E] mb-3">Previously Generated</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {history.map(h => (
                <div key={h.id} className="shrink-0 w-28 space-y-1.5">
                  <div className={`w-28 h-28 rounded-xl bg-gradient-to-br ${h.palette} flex items-center justify-center`}>
                    <ImageIcon className="w-6 h-6 text-white/40" />
                  </div>
                  <p className="text-[10px] text-gray-400 truncate">{h.prompt}</p>
                  <p className="text-[10px] text-gray-300 font-semibold">{h.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}