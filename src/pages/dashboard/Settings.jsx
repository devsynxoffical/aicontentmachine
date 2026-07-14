import { useState, useEffect } from "react";
import {
  User, Bell, Lock, Globe, CreditCard, Sparkles, Check,
  Eye, EyeOff, Save, ChevronRight, Trash2, Upload,
  Moon, Sun, Monitor, Zap, Shield, AlertTriangle,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

// ── Sidebar nav sections ──────────────────────────────────────────────────────
const NAV = [
  { id:"profile",      label:"Profile",          icon: User },
  { id:"notifications",label:"Notifications",    icon: Bell },
  { id:"security",     label:"Security",         icon: Lock },
  { id:"language",     label:"Language & Region",icon: Globe },
  { id:"billing",      label:"Billing & Credits",icon: CreditCard },
  { id:"ai",           label:"AI Preferences",   icon: Sparkles },
];

const LANGUAGES = ["English","Spanish","French","German","Arabic","Chinese (Simplified)","Japanese","Portuguese"];
const TIMEZONES  = ["(UTC-08:00) Pacific Time","(UTC-05:00) Eastern Time","(UTC+00:00) London","(UTC+01:00) Paris","(UTC+05:00) Islamabad","(UTC+05:30) Mumbai","(UTC+08:00) Singapore","(UTC+09:00) Tokyo"];
const TONES      = ["Professional","Friendly","Casual","Bold","Witty","Authoritative","Empathetic"];

// ── helpers ──────────────────────────────────────────────────────────────────
function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#02A3B1] focus:ring-offset-1 ${checked ? "bg-[#02A3B1]" : "bg-gray-200"}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function SaveBar({ onSave, saved }) {
  return (
    <div className="flex items-center justify-end pt-4 border-t border-gray-100 gap-3">
      {saved && (
        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
          <Check className="w-3.5 h-3.5" /> Changes saved
        </span>
      )}
      <button onClick={onSave}
        className="px-5 py-2 rounded-xl bg-[#02A3B1] hover:bg-[#017A85] text-white text-sm font-semibold transition flex items-center gap-1.5 shadow-sm">
        <Save className="w-4 h-4" /> Save Changes
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h4>
      {children}
    </div>
  );
}

function SettingRow({ label, description, action }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <div className="text-sm font-semibold text-[#1A1A2E]">{label}</div>
        {description && <div className="text-xs text-gray-400 mt-0.5">{description}</div>}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Settings() {
  const { user, getCurrentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Saved feedback per tab
  const [savedTabs, setSavedTabs] = useState({});

  const save = async () => {
    try {
      if (activeTab === "profile") {
        await api.put("/settings/profile", {
          fullName: profile.name,
          companyName: profile.company,
          jobTitle: profile.jobTitle,
        });
        await getCurrentUser(); // refresh user in AuthContext
      } else if (activeTab === "ai") {
        await api.put("/settings/preferences", aiPrefs);
      } else if (activeTab === "security" && passForm.current && passForm.newPass) {
        await api.put("/auth/change-password", {
          currentPassword: passForm.current,
          newPassword: passForm.newPass,
        });
        setPassForm({ current: "", newPass: "", confirm: "" });
      }
      setSavedTabs((p) => ({ ...p, [activeTab]: true }));
      setTimeout(() => setSavedTabs((p) => ({ ...p, [activeTab]: false })), 2500);
    } catch (err) {
      console.error("Settings save error:", err);
    }
  };

  // Profile — initialise from real user, fall back to placeholders
  const [profile, setProfile] = useState({
    name: "", email: "",
    company: "", jobTitle: "", bio: "",
    avatar: null,
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.fullName || "",
        email: user.email || "",
        company: user.companyName || "",
        jobTitle: user.jobTitle || "",
        bio: "",
        avatar: user.avatar || null,
      });
    }
  }, [user]);

  // Notifications
  const [notifs, setNotifs] = useState({
    emailPublish:true, emailWeekly:true, emailAI:false,
    browserPublish:true, browserAI:true, browserBilling:false,
    mobileAll:true,
  });

  // Security
  const [showPass, setShowPass]  = useState(false);
  const [passForm, setPassForm]  = useState({ current:"", newPass:"", confirm:"" });
  const [twoFA, setTwoFA]        = useState(false);
  const [sessions] = useState([
    { device:"Chrome on Windows 11", location:"Islamabad, PK", current:true,  time:"Just now" },
    { device:"Safari on iPhone 15",  location:"Lahore, PK",    current:false, time:"2 hours ago" },
    { device:"Firefox on macOS",     location:"Karachi, PK",   current:false, time:"3 days ago" },
  ]);

  // Language & Region
  const [language, setLanguage]   = useState("English");
  const [timezone, setTimezone]   = useState("(UTC+05:00) Islamabad");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [theme, setTheme]         = useState("light");

  // AI Preferences
  const [aiPrefs, setAiPrefs] = useState({
    defaultTone:"Professional", defaultLanguage:"English",
    addEmoji:true, addHashtags:true, addCTA:true,
    seoOptimize:true, autoSuggest:false, contentLength:"Medium",
  });

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm bg-white";
  const labelCls = "text-xs font-bold text-gray-500 uppercase tracking-wider";

  // ── Panels ──────────────────────────────────────────────────────────────────
  const panels = {
    profile: (
      <div className="space-y-6">
        <Section title="Personal Information">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#017A85] to-[#02A3B1] flex items-center justify-center text-white text-2xl font-bold shadow-inner shrink-0">
              {profile.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-[#1A1A2E]">Profile Photo</p>
              <p className="text-xs text-gray-400">JPG, PNG or GIF. Max 5MB.</p>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-[#02A3B1] hover:text-[#02A3B1] transition">
                <Upload className="w-3.5 h-3.5" /> Upload Photo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label:"Full Name", key:"name", placeholder:"Your full name" },
              { label:"Email Address", key:"email", placeholder:"email@example.com", type:"email" },
              { label:"Company", key:"company", placeholder:"Your company name" },
              { label:"Job Title", key:"jobTitle", placeholder:"e.g. Marketing Manager" },
            ].map(({ label, key, placeholder, type="text" }) => (
              <div key={key} className="space-y-1.5">
                <label className={labelCls}>{label}</label>
                <input type={type} placeholder={placeholder} value={profile[key]}
                  onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                  className={inputCls}
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className={labelCls}>Bio</label>
            <textarea rows={3} value={profile.bio}
              onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
              className={inputCls + " resize-none"}
              placeholder="Write a short bio..."
            />
          </div>
        </Section>

        <SaveBar onSave={save} saved={savedTabs.profile} />
      </div>
    ),

    notifications: (
      <div className="space-y-6">
        <Section title="Email Notifications">
          {[
            { key:"emailPublish", label:"Content Published", desc:"When a post or campaign is published" },
            { key:"emailWeekly",  label:"Weekly Analytics Report", desc:"Summary emailed every Monday" },
            { key:"emailAI",      label:"AI Tips & Updates", desc:"Product improvements and AI writing tips" },
          ].map(({ key, label, desc }) => (
            <SettingRow key={key} label={label} description={desc}
              action={<ToggleSwitch checked={notifs[key]} onChange={v => setNotifs(p=>({...p,[key]:v}))} />}
            />
          ))}
        </Section>

        <div className="border-t border-gray-100" />

        <Section title="Browser Push Notifications">
          {[
            { key:"browserPublish", label:"Publish & Schedule Alerts", desc:"Notify when content goes live" },
            { key:"browserAI",      label:"AI Generation Complete", desc:"Alert when AI finishes writing" },
            { key:"browserBilling", label:"Billing & Credit Alerts", desc:"Low credit & payment notifications" },
          ].map(({ key, label, desc }) => (
            <SettingRow key={key} label={label} description={desc}
              action={<ToggleSwitch checked={notifs[key]} onChange={v => setNotifs(p=>({...p,[key]:v}))} />}
            />
          ))}
        </Section>

        <div className="border-t border-gray-100" />

        <Section title="Mobile Notifications">
          <SettingRow label="All Mobile Notifications" description="Enable/disable all push notifications on mobile devices"
            action={<ToggleSwitch checked={notifs.mobileAll} onChange={v => setNotifs(p=>({...p,mobileAll:v}))} />}
          />
        </Section>

        <SaveBar onSave={save} saved={savedTabs.notifications} />
      </div>
    ),

    security: (
      <div className="space-y-6">
        <Section title="Change Password">
          <div className="space-y-3">
            {[
              { label:"Current Password", key:"current", placeholder:"Enter current password" },
              { label:"New Password", key:"newPass", placeholder:"Min 8 characters" },
              { label:"Confirm New Password", key:"confirm", placeholder:"Re-enter new password" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className={labelCls}>{label}</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} placeholder={placeholder}
                    value={passForm[key]}
                    onChange={e => setPassForm(p => ({ ...p, [key]: e.target.value }))}
                    className={inputCls + " pr-10"}
                  />
                  <button onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            <button className="px-5 py-2 rounded-xl bg-[#1A1A2E] hover:bg-[#2A2A4E] text-white text-sm font-semibold transition">
              Update Password
            </button>
          </div>
        </Section>

        <div className="border-t border-gray-100" />

        <Section title="Two-Factor Authentication">
          <SettingRow label="Enable 2FA" description="Add an extra layer of security with authenticator app or SMS OTP."
            action={<ToggleSwitch checked={twoFA} onChange={setTwoFA} />}
          />
          {twoFA && (
            <div className="bg-[#E0F7FA]/30 border border-[#b2ebf2] rounded-xl p-4 text-sm text-[#017A85] flex items-start gap-2">
              <Shield className="w-4 h-4 mt-0.5 shrink-0" />
              Two-factor authentication is <strong>active</strong>. Scan the QR code with your authenticator app or enter the setup key manually.
            </div>
          )}
        </Section>

        <div className="border-t border-gray-100" />

        <Section title="Active Sessions">
          <div className="space-y-3">
            {sessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-[#1A1A2E] flex items-center gap-2">
                      {s.device}
                      {s.current && <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Current</span>}
                    </div>
                    <div className="text-xs text-gray-400">{s.location} · {s.time}</div>
                  </div>
                </div>
                {!s.current && (
                  <button className="text-xs font-semibold text-red-500 hover:text-red-700 transition flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </Section>
      </div>
    ),

    language: (
      <div className="space-y-6">
        <Section title="Language & Display">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelCls}>Interface Language</label>
              <select value={language} onChange={e=>setLanguage(e.target.value)} className={inputCls}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Timezone</label>
              <select value={timezone} onChange={e=>setTimezone(e.target.value)} className={inputCls}>
                {TIMEZONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Date Format</label>
              <select value={dateFormat} onChange={e=>setDateFormat(e.target.value)} className={inputCls}>
                {["DD/MM/YYYY","MM/DD/YYYY","YYYY-MM-DD"].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </Section>

        <div className="border-t border-gray-100" />

        <Section title="Appearance Theme">
          <div className="flex gap-3">
            {[
              { id:"light", label:"Light", icon: Sun },
              { id:"dark",  label:"Dark",  icon: Moon },
              { id:"system",label:"System",icon: Monitor },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTheme(id)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${theme===id ? "border-[#02A3B1] bg-[#E0F7FA]/20" : "border-gray-200 bg-white hover:border-gray-300"}`}
              >
                <Icon className={`w-5 h-5 ${theme===id ? "text-[#02A3B1]" : "text-gray-400"}`} />
                <span className={`text-xs font-bold ${theme===id ? "text-[#02A3B1]" : "text-gray-500"}`}>{label}</span>
              </button>
            ))}
          </div>
        </Section>

        <SaveBar onSave={save} saved={savedTabs.language} />
      </div>
    ),

    billing: (
      <div className="space-y-6">
        {/* Current Plan */}
        <div className="bg-gradient-to-br from-[#017A85] to-[#02A3B1] rounded-2xl p-5 text-white flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Current Plan</div>
            <div className="text-2xl font-bold">Pro Plan</div>
            <div className="text-sm opacity-80 mt-0.5">Billed annually · $49/month</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-70 mb-1">Next renewal</div>
            <div className="font-bold text-lg">Aug 6, 2026</div>
            <button className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg font-semibold transition">Manage Plan</button>
          </div>
        </div>

        {/* AI Credits */}
        <Section title="AI Credits">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#1A1A2E]">Monthly Credits Used</span>
              <span className="text-sm font-bold text-[#02A3B1]">742 / 1,000</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div className="h-2.5 rounded-full bg-gradient-to-r from-[#017A85] to-[#02A3B1]" style={{ width:"74.2%" }} />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>258 credits remaining</span>
              <span>Resets Aug 6, 2026</span>
            </div>
            <button className="px-4 py-2 rounded-xl border border-[#02A3B1] text-[#02A3B1] text-xs font-bold hover:bg-[#E0F7FA]/20 transition">
              <Zap className="w-3.5 h-3.5 inline mr-1.5" />Buy More Credits
            </button>
          </div>
        </Section>

        {/* Payment Method */}
        <Section title="Payment Method">
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded">VISA</div>
              <div>
                <div className="text-sm font-semibold text-[#1A1A2E]">Visa ending in 4242</div>
                <div className="text-xs text-gray-400">Expires 09/2028</div>
              </div>
            </div>
            <button className="text-xs font-semibold text-[#02A3B1] hover:text-[#017A85] transition">Update</button>
          </div>
        </Section>

        {/* Invoices */}
        <Section title="Recent Invoices">
          <div className="space-y-2">
            {[
              { month:"July 2026",  amount:"$49.00", status:"Paid" },
              { month:"June 2026",  amount:"$49.00", status:"Paid" },
              { month:"May 2026",   amount:"$49.00", status:"Paid" },
            ].map((inv) => (
              <div key={inv.month} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                <div className="text-sm font-semibold text-[#1A1A2E]">{inv.month}</div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{inv.status}</span>
                  <span className="text-sm font-bold text-[#1A1A2E]">{inv.amount}</span>
                  <button className="text-xs font-semibold text-gray-400 hover:text-[#02A3B1] transition">PDF</button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    ),

    ai: (
      <div className="space-y-6">
        <Section title="Default Writing Style">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelCls}>Default Tone</label>
              <select value={aiPrefs.defaultTone} onChange={e=>setAiPrefs(p=>({...p,defaultTone:e.target.value}))} className={inputCls}>
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Default Output Language</label>
              <select value={aiPrefs.defaultLanguage} onChange={e=>setAiPrefs(p=>({...p,defaultLanguage:e.target.value}))} className={inputCls}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className={labelCls}>Preferred Content Length</label>
              <div className="flex gap-2">
                {["Short","Medium","Long","Comprehensive"].map(len => (
                  <button key={len} onClick={() => setAiPrefs(p=>({...p,contentLength:len}))}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition ${aiPrefs.contentLength===len ? "border-[#02A3B1] bg-[#E0F7FA]/20 text-[#02A3B1]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                  >{len}</button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <div className="border-t border-gray-100" />

        <Section title="AI Output Preferences">
          {[
            { key:"addEmoji",     label:"Include Emojis",          desc:"Automatically add contextual emojis to generated content" },
            { key:"addHashtags",  label:"Auto-Generate Hashtags",   desc:"Include relevant hashtags in social posts" },
            { key:"addCTA",       label:"Include Call-to-Action",   desc:"Always append a CTA at the end of marketing content" },
            { key:"seoOptimize",  label:"SEO-Optimize Blog Content",desc:"Apply SEO best practices when generating blog articles" },
            { key:"autoSuggest",  label:"Auto-Suggest Improvements",desc:"Proactively suggest rewrites and improvements" },
          ].map(({ key, label, desc }) => (
            <SettingRow key={key} label={label} description={desc}
              action={<ToggleSwitch checked={aiPrefs[key]} onChange={v=>setAiPrefs(p=>({...p,[key]:v}))} />}
            />
          ))}
        </Section>

        <div className="border-t border-gray-100" />

        <Section title="Danger Zone">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-red-700">Reset All AI Preferences</div>
              <div className="text-xs text-red-400 mt-0.5">This will revert all AI writing settings to their factory defaults. This cannot be undone.</div>
              <button className="mt-3 px-4 py-1.5 rounded-lg border border-red-300 text-red-600 text-xs font-bold hover:bg-red-100 transition">
                Reset to Defaults
              </button>
            </div>
          </div>
        </Section>

        <SaveBar onSave={save} saved={savedTabs.ai} />
      </div>
    ),
  };

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6 pb-12 text-left">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A2E]">Settings</h1>
          <p className="text-gray-500 mt-1.5">Manage your profile, preferences, billing, and AI behaviour.</p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

          {/* Sidebar */}
          <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 space-y-1 lg:sticky lg:top-24">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition ${activeTab===id ? "bg-[#E0F7FA]/30 text-[#02A3B1] border border-[#b2ebf2]" : "text-gray-600 hover:bg-gray-50 hover:text-[#1A1A2E]"}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {activeTab===id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </button>
            ))}
          </nav>

          {/* Panel */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[400px]">
            {panels[activeTab]}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}