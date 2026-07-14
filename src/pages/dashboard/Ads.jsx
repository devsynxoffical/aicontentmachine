import { useState } from "react";
import api from "../../services/api";
import {
  Sparkles, RefreshCw, Copy, Check, ChevronRight,
  Globe, Target, Users, Megaphone, Plus, Minus,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

// ── helpers ──────────────────────────────────────────────────────────────────
const MAX_GOOGLE = { h: 30, d: 90 };

function CharCount({ value, max }) {
  const len = (value || "").length;
  const over = len > max;
  return (
    <span className={`text-[10px] font-bold tabular-nums ${over ? "text-red-500" : "text-gray-400"}`}>
      {len}/{max}
    </span>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button onClick={handle} className="flex items-center gap-1 text-xs font-semibold text-[#02A3B1] hover:text-[#017A85] transition">
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ── Mock generator ────────────────────────────────────────────────────────────
function generateGoogleAds(form) {
  const p = form.product || "Your Product";
  const k = form.keyword || "top solution";
  const a = form.audience || "professionals";
  return [
    {
      h1: `${p} – Best ${k}`, h2: `Trusted by ${a}`, h3: "Start Free Today",
      d1: `Discover why thousands choose ${p} to ${form.goal || "grow their business"}. No commitments.`,
      d2: `Award-winning ${k} platform. Fast setup. Cancel anytime. Try risk-free.`,
    },
    {
      h1: `#1 Rated ${k}`, h2: `${p} for ${a}`, h3: "Limited Time Offer",
      d1: `${p} is the leading ${k} loved by ${a} worldwide. Get started in minutes.`,
      d2: `Join 50,000+ users. Powerful features, simple interface. See results in 24 hrs.`,
    },
    {
      h1: `Save 30% on ${p}`, h2: `Premium ${k} Solution`, h3: "Claim Your Discount",
      d1: `Don't miss our exclusive deal. ${p} gives ${a} the edge they need to scale.`,
      d2: `Rated 4.9 stars. Dedicated support. No hidden fees. Try ${p} today.`,
    },
  ];
}

function generateMetaAds(form) {
  const p = form.product || "Your Product";
  const o = form.offer || "exclusive deal";
  const a = form.audience || "everyone";
  return [
    {
      primary: `🚀 Attention ${a}! ${p} is changing the game. ${o} — don't wait!`,
      headline: `${p}: The Smart Choice`,
      description: `Join thousands who already trust ${p}. Claim your ${o} today.`,
      cta: form.cta || "Shop Now",
      imageHint: form.image || "Product lifestyle photo with bright background",
    },
    {
      primary: `✨ Ready to level up? ${p} gives ${a} the tools to succeed. ${o} available now.`,
      headline: `Transform Your Results with ${p}`,
      description: `Proven by real users. Start seeing results today. ${o}.`,
      cta: form.cta || "Learn More",
      imageHint: form.image || "Happy customer using the product",
    },
  ];
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Ads() {
  const [tab, setTab] = useState("google"); // "google" | "meta"

  // Google form
  const [gForm, setGForm] = useState({ product: "", url: "", audience: "", goal: "", keyword: "" });
  const [gAds, setGAds] = useState([]);
  const [gLoading, setGLoading] = useState(false);

  // Meta form
  const [mForm, setMForm] = useState({ product: "", audience: "", offer: "", cta: "Shop Now", image: "" });
  const [mAds, setMAds] = useState([]);
  const [mLoading, setMLoading] = useState(false);

  const handleGenGoogle = async () => {
    setGLoading(true);
    setGAds([]);
    try {
      const { data } = await api.post("/content", {
        type: "ad_copy",
        platform: "WEBSITE",
        topic: gForm.product,
        keywords: gForm.keyword,
        tone: "Persuasive",
        details: `Audience: ${gForm.audience}. Goal: ${gForm.goal}. URL: ${gForm.url || "N/A"}.`,
      });
      // Parse AI content into Google Ads format (3 headlines + 2 descriptions)
      const raw = data.data.content || "";
      const lines = raw.split("\n").filter(l => l.trim());
      const ads = [0, 1, 2].map((i) => ({
        h1: lines[i * 5 + 0]?.replace(/^H1[:\-]?\s*/i, "") || `${gForm.product} – Best ${gForm.keyword}`,
        h2: lines[i * 5 + 1]?.replace(/^H2[:\-]?\s*/i, "") || `Trusted by ${gForm.audience}`,
        h3: lines[i * 5 + 2]?.replace(/^H3[:\-]?\s*/i, "") || "Get Started Today",
        d1: lines[i * 5 + 3]?.replace(/^D1[:\-]?\s*/i, "") || `Discover why thousands choose ${gForm.product}.`,
        d2: lines[i * 5 + 4]?.replace(/^D2[:\-]?\s*/i, "") || `Powerful features, simple interface. Try risk-free.`,
      }));
      setGAds(ads);
    } catch (err) {
      console.error("Google Ads generation failed:", err);
      // Fall back to mock
      setGAds(generateGoogleAds(gForm));
    } finally {
      setGLoading(false);
    }
  };

  const handleGenMeta = async () => {
    setMLoading(true);
    setMAds([]);
    try {
      const { data } = await api.post("/content", {
        type: "ad_copy",
        platform: "FACEBOOK",
        topic: mForm.product,
        tone: "Persuasive",
        details: `Audience: ${mForm.audience}. Offer: ${mForm.offer}. CTA: ${mForm.cta}.`,
      });
      const raw = data.data.content || "";
      const lines = raw.split("\n").filter(l => l.trim());
      const ads = [0, 1, 2].map((i) => ({
        headline: lines[i * 4 + 0]?.replace(/^Headline[:\-]?\s*/i, "") || `${mForm.product}: ${mForm.offer}`,
        primaryText: lines[i * 4 + 1]?.replace(/^Primary[:\-]?\s*/i, "") || `Discover ${mForm.product} today. Perfect for ${mForm.audience}.`,
        description: lines[i * 4 + 2]?.replace(/^Description[:\-]?\s*/i, "") || `Exclusive offer for ${mForm.audience}.`,
        cta: mForm.cta || "Shop Now",
      }));
      setMAds(ads);
    } catch (err) {
      console.error("Meta Ads generation failed:", err);
      // Fall back to mock
      setMAds(generateMetaAds(mForm));
    } finally {
      setMLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm bg-white";
  const labelCls = "text-xs font-bold text-gray-500 uppercase tracking-wider";

  return (
    <DashboardLayout title="Ad Copy">
      <div className="space-y-6 text-left pb-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A2E]">Ad Copy Generator</h1>
            <p className="text-gray-500 mt-1.5">Generate high-converting ad copy for Google Ads and Meta Ads.</p>
          </div>
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 self-start">
            {[["google","Google Ads"], ["meta","Meta Ads"]].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${tab === id ? "bg-[#02A3B1] text-white shadow-sm" : "text-gray-500 hover:text-[#1A1A2E]"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Google Ads Tab ── */}
        {tab === "google" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Input form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-[#1A1A2E] text-base border-b border-gray-100 pb-2">Campaign Details</h3>

              {[
                { label: "Product / Service Name", key: "product", placeholder: "e.g. DevSynx Pro" },
                { label: "Landing Page URL (optional)", key: "url", placeholder: "https://devsynx.com/pricing" },
                { label: "Target Audience", key: "audience", placeholder: "e.g. SaaS founders, marketers" },
                { label: "Campaign Goal", key: "goal", placeholder: "e.g. drive free trial signups" },
                { label: "Main Keyword", key: "keyword", placeholder: "e.g. AI content generator" },
              ].map(({ label, key, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <label className={labelCls}>{label}</label>
                  <input type="text" placeholder={placeholder} value={gForm[key]}
                    onChange={(e) => setGForm(p => ({ ...p, [key]: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              ))}

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#02A3B1]" /> 1 AI Credit
                </span>
                <button
                  disabled={!gForm.product || gLoading}
                  onClick={handleGenGoogle}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition flex items-center gap-1.5 ${!gForm.product || gLoading ? "bg-gray-300 cursor-not-allowed" : "bg-[#02A3B1] hover:bg-[#017A85] shadow-sm"}`}
                >
                  {gLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {gLoading ? "Generating..." : "Generate Ads"}
                </button>
              </div>
            </div>

            {/* Output */}
            <div className="lg:col-span-3 space-y-4">
              {gLoading && (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center gap-4 shadow-sm">
                  <RefreshCw className="w-8 h-8 text-[#02A3B1] animate-spin" />
                  <p className="text-sm font-semibold text-gray-500">Writing your ad variations...</p>
                </div>
              )}

              {!gLoading && gAds.length === 0 && (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 flex flex-col items-center gap-3 shadow-sm">
                  <Megaphone className="w-10 h-10 text-gray-200" />
                  <p className="text-sm font-semibold text-gray-400">Fill in the form and click Generate Ads to see your variations here.</p>
                </div>
              )}

              {!gLoading && gAds.map((ad, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#02A3B1] bg-[#E0F7FA] px-2.5 py-1 rounded-full">Ad Variation {i + 1}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setGAds(p => { const c=[...p]; c[i]=generateGoogleAds(gForm)[i]||c[i]; return c; })}
                        className="text-xs text-gray-400 hover:text-[#02A3B1] flex items-center gap-1 font-semibold transition">
                        <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                      </button>
                      <CopyBtn text={`H1: ${ad.h1}\nH2: ${ad.h2}\nH3: ${ad.h3}\nD1: ${ad.d1}\nD2: ${ad.d2}`} />
                    </div>
                  </div>

                  {/* Google Ads preview structure */}
                  <div className="bg-gray-50 rounded-xl p-4 text-xs space-y-2 border border-gray-100">
                    <div className="text-[10px] text-green-700 font-semibold">Ad · devsynx.com</div>
                    <div className="text-blue-700 font-bold text-sm">{ad.h1} | {ad.h2} | {ad.h3}</div>
                    <div className="text-gray-600 leading-relaxed">{ad.d1}</div>
                    <div className="text-gray-600 leading-relaxed">{ad.d2}</div>
                  </div>

                  {/* Field breakdown with char counts */}
                  <div className="space-y-2 pt-1">
                    {[["Headline 1",ad.h1,MAX_GOOGLE.h],["Headline 2",ad.h2,MAX_GOOGLE.h],["Headline 3",ad.h3,MAX_GOOGLE.h],
                      ["Description 1",ad.d1,MAX_GOOGLE.d],["Description 2",ad.d2,MAX_GOOGLE.d]].map(([lbl,val,max]) => (
                      <div key={lbl} className="flex items-center justify-between gap-3 text-xs">
                        <span className="font-semibold text-gray-500 w-24 shrink-0">{lbl}</span>
                        <span className="flex-1 text-[#1A1A2E] truncate">{val}</span>
                        <CharCount value={val} max={max} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Meta Ads Tab ── */}
        {tab === "meta" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Input form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-[#1A1A2E] text-base border-b border-gray-100 pb-2">Ad Details</h3>

              {[
                { label: "Product / Service Name", key: "product", placeholder: "e.g. DevSynx Pro" },
                { label: "Audience Description", key: "audience", placeholder: "e.g. small business owners aged 25-45" },
                { label: "Offer or Promotion", key: "offer", placeholder: "e.g. 30% off first month" },
                { label: "Image Description", key: "image", placeholder: "e.g. person smiling at laptop in bright office" },
              ].map(({ label, key, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <label className={labelCls}>{label}</label>
                  <input type="text" placeholder={placeholder} value={mForm[key]}
                    onChange={(e) => setMForm(p => ({ ...p, [key]: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              ))}

              <div className="space-y-1.5">
                <label className={labelCls}>Call to Action</label>
                <select value={mForm.cta} onChange={(e) => setMForm(p => ({ ...p, cta: e.target.value }))} className={inputCls}>
                  {["Shop Now","Learn More","Sign Up","Get Offer","Book Now","Download","Subscribe","Contact Us"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#02A3B1]" /> 1 AI Credit
                </span>
                <button
                  disabled={!mForm.product || mLoading}
                  onClick={handleGenMeta}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition flex items-center gap-1.5 ${!mForm.product || mLoading ? "bg-gray-300 cursor-not-allowed" : "bg-[#02A3B1] hover:bg-[#017A85] shadow-sm"}`}
                >
                  {mLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {mLoading ? "Generating..." : "Generate Ads"}
                </button>
              </div>
            </div>

            {/* Output */}
            <div className="lg:col-span-3 space-y-6">
              {mLoading && (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center gap-4 shadow-sm">
                  <RefreshCw className="w-8 h-8 text-[#02A3B1] animate-spin" />
                  <p className="text-sm font-semibold text-gray-500">Writing your Meta ad copy...</p>
                </div>
              )}

              {!mLoading && mAds.length === 0 && (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 flex flex-col items-center gap-3 shadow-sm">
                  <Megaphone className="w-10 h-10 text-gray-200" />
                  <p className="text-sm font-semibold text-gray-400">Fill in the form and click Generate Ads.</p>
                </div>
              )}

              {!mLoading && mAds.map((ad, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <span className="text-xs font-bold text-[#02A3B1] bg-[#E0F7FA] px-2.5 py-1 rounded-full">Variation {i + 1}</span>
                    <div className="flex gap-3">
                      <button onClick={() => setMAds(p => { const c=[...p]; c[i]=generateMetaAds(mForm)[i]||c[i]; return c; })}
                        className="text-xs text-gray-400 hover:text-[#02A3B1] flex items-center gap-1 font-semibold transition">
                        <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                      </button>
                      <CopyBtn text={`Primary: ${ad.primary}\nHeadline: ${ad.headline}\nDescription: ${ad.description}\nCTA: ${ad.cta}`} />
                    </div>
                  </div>

                  {/* Facebook mock preview */}
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Fields */}
                    <div className="space-y-3 text-sm">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Primary Text</span>
                        <p className="text-gray-700 leading-relaxed text-xs">{ad.primary}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Headline</span>
                          <p className="font-bold text-[#1A1A2E] text-xs mt-0.5">{ad.headline}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Description</span>
                          <p className="text-gray-600 text-xs mt-0.5">{ad.description}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">CTA Button</span>
                        <div className="mt-1">
                          <span className="bg-[#1877F2] text-white text-xs font-bold px-3 py-1.5 rounded-lg inline-block">{ad.cta}</span>
                        </div>
                      </div>
                    </div>

                    {/* Facebook card mock */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden text-xs bg-white shadow-sm">
                      <div className="bg-gray-100 h-24 flex items-center justify-center text-gray-400 text-[10px] p-3 text-center italic">
                        {ad.imageHint}
                      </div>
                      <div className="p-3 bg-[#f0f2f5]">
                        <div className="text-[10px] text-gray-500">devsynx.com</div>
                        <div className="font-bold text-[#1A1A2E] mt-0.5">{ad.headline}</div>
                        <div className="text-gray-500 text-[10px]">{ad.description}</div>
                      </div>
                      <div className="px-3 py-2 bg-[#f0f2f5] border-t border-gray-200">
                        <button className="w-full bg-[#e4e6eb] text-[#1A1A2E] text-xs font-bold py-1.5 rounded-lg">{ad.cta}</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}