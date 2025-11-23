import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Layout,
  Wand2,
  Bot,
  Printer,
  Briefcase,
  GraduationCap,
  User,
  MapPin,
  Phone,
  Mail,
  Globe,
  Plus,
  Trash2,
  ChevronRight,
  Sparkles,
  X,
  Send,
  Loader2,
  Palette,
  FileText,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  MousePointer2,
  Grid,
  PanelLeft,
  Columns,
  LayoutTemplate,
  PaintBucket,
  Shield,
  Leaf,
  Anchor,
  HeartPulse,
  Coffee,
  TrendingUp,
  Building2,
  Gavel,
  Users,
  Truck,
  PartyPopper,
  SearchCheck,
  PenTool,
  Type,
  Sliders,
  Code2,
  Terminal,
  Database,
  Cpu,
  GitBranch,
  Braces,
  RotateCcw,
  Calendar,
  Trophy
} from 'lucide-react';

// --- TYPES ---

type TemplateKey = string;

interface Experience {
  id: string;
  role: string;
  company: string;
  date: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

interface ResumeFormData {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  portfolio: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
}

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  score?: number;
}

interface Recommendation {
  id: string;
  category: 'impact' | 'content' | 'ats';
  type: 'warning' | 'success' | 'info';
  message: string;
  action?: string;
}

interface AuditResult {
  score: number;
  recommendations: Recommendation[];
}

interface TemplateConfig {
  label: string;
  category: 'Modern' | 'Professional' | 'Creative' | 'Technical' | 'Minimalist' | 'Classic' | 'Industry' | 'Iconic' | 'Coder';
  layout: 'standard' | 'sidebar' | 'compact';
  container: string;
  headerWrapper?: string;
  name: string;
  role: string;
  sectionHeader?: string;
  sectionHeaderMain?: string;
  sectionHeaderSide?: string;
  itemTitle: string;
  itemSubtitle: string;
  itemDate: string;
  text: string;
  skillBadge: string;
  sidebarStyle?: string;
  mainStyle?: string;
  contactItem?: string;
  defaultColors: {
    titleColor: string;
    headingColor: string;
    textColor: string;
    accentColor: string;
  };
}

interface DesignSettings {
  fontFamily: string;
  accentColor: string;
  titleColor: string;
  headingColor: string;
  textColor: string;
  nameSize: number;
  headingSize: number;
  textSize: number;
  lineHeight: number;
  letterSpacing: number;
}

// --- CONFIGURATION & STYLES ---

const FONTS = [
  { name: 'Inter', label: 'Inter (Modern Sans)', family: "'Inter', sans-serif" },
  { name: 'Roboto', label: 'Roboto (Clean Sans)', family: "'Roboto', sans-serif" },
  { name: 'Open Sans', label: 'Open Sans (Friendly)', family: "'Open Sans', sans-serif" },
  { name: 'Lato', label: 'Lato (Neutral)', family: "'Lato', sans-serif" },
  { name: 'Montserrat', label: 'Montserrat (Geometric)', family: "'Montserrat', sans-serif" },
  { name: 'Raleway', label: 'Raleway (Elegant)', family: "'Raleway', sans-serif" },
  { name: 'Oswald', label: 'Oswald (Bold Condensed)', family: "'Oswald', sans-serif" },
  { name: 'Merriweather', label: 'Merriweather (Readable Serif)', family: "'Merriweather', serif" },
  { name: 'Playfair Display', label: 'Playfair Display (Luxury)', family: "'Playfair Display', serif" },
  { name: 'Roboto Mono', label: 'Roboto Mono (Code)', family: "'Roboto Mono', monospace" },
  { name: 'Source Code Pro', label: 'Source Code Pro (Tech)', family: "'Source Code Pro', monospace" },
  { name: 'Space Grotesk', label: 'Space Grotesk (Trendy)', family: "'Space Grotesk', sans-serif" },
  { name: 'DM Serif Display', label: 'DM Serif (Headline)', family: "'DM Serif Display', serif" },
  { name: 'Nunito', label: 'Nunito (Rounded)', family: "'Nunito', sans-serif" },
  { name: 'Poppins', label: 'Poppins (Geometric)', family: "'Poppins', sans-serif" },
  { name: 'Work Sans', label: 'Work Sans (Clean)', family: "'Work Sans', sans-serif" },
  { name: 'Quicksand', label: 'Quicksand (Soft)', family: "'Quicksand', sans-serif" },
  { name: 'PT Serif', label: 'PT Serif (Formal)', family: "'PT Serif', serif" },
  { name: 'Noto Sans', label: 'Noto Sans (Global)', family: "'Noto Sans', sans-serif" },
  { name: 'Fira Sans', label: 'Fira Sans (Readable)', family: "'Fira Sans', sans-serif" },
  { name: 'Crimson Text', label: 'Crimson Text (Book)', family: "'Crimson Text', serif" },
  { name: 'Karla', label: 'Karla (Quirky)', family: "'Karla', sans-serif" },
  { name: 'Inconsolata', label: 'Inconsolata (Terminal)', family: "'Inconsolata', monospace" },
  { name: 'Anton', label: 'Anton (Impact)', family: "'Anton', sans-serif" },
  { name: 'Cabin', label: 'Cabin (Humanist)', family: "'Cabin', sans-serif" },
  { name: 'Zilla Slab', label: 'Zilla Slab (Journalism)', family: "'Zilla Slab', serif" },
  { name: 'Bitter', label: 'Bitter (Contemporary)', family: "'Bitter', serif" },
  { name: 'Ubuntu', label: 'Ubuntu (Modern)', family: "'Ubuntu', sans-serif" }
];

const DEFAULT_DESIGN_SETTINGS: DesignSettings = {
  fontFamily: "'Inter', sans-serif",
  accentColor: '#3b82f6',
  titleColor: '#0f172a',
  headingColor: '#334155',
  textColor: '#475569',
  nameSize: 32,
  headingSize: 14,
  textSize: 10,
  lineHeight: 1.6,
  letterSpacing: 0
};

const COLOR_PRESETS = [
  { name: 'Ocean', colors: { titleColor: '#0c4a6e', headingColor: '#0369a1', textColor: '#334155', accentColor: '#0ea5e9' } },
  { name: 'Forest', colors: { titleColor: '#14532d', headingColor: '#15803d', textColor: '#3f6212', accentColor: '#22c55e' } },
  { name: 'Sunset', colors: { titleColor: '#7c2d12', headingColor: '#c2410c', textColor: '#431407', accentColor: '#f97316' } },
  { name: 'Berry', colors: { titleColor: '#831843', headingColor: '#be185d', textColor: '#500724', accentColor: '#ec4899' } },
  { name: 'Slate', colors: { titleColor: '#1e293b', headingColor: '#475569', textColor: '#64748b', accentColor: '#94a3b8' } },
  { name: 'Midnight', colors: { titleColor: '#000000', headingColor: '#1e1e1e', textColor: '#3f3f46', accentColor: '#6366f1' } },
  { name: 'Corporate', colors: { titleColor: '#111827', headingColor: '#374151', textColor: '#4b5563', accentColor: '#2563eb' } },
];

const TEMPLATES: Record<string, TemplateConfig> = {
  iconicBoard: {
    label: "Iconic Dashboard",
    category: "Iconic",
    layout: "standard",
    container: "bg-white text-slate-900 font-sans p-10 border-t-[20px] border-indigo-600",
    headerWrapper: "flex items-center justify-between mb-10 border-b border-slate-200 pb-6",
    name: "text-5xl font-black tracking-tighter text-indigo-900",
    role: "text-xl font-medium text-slate-500 mt-1",
    sectionHeader: "text-xl font-bold text-indigo-600 mb-6 flex items-center gap-2",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-600 font-medium",
    itemDate: "text-slate-400 text-sm",
    text: "text-slate-600 leading-relaxed text-sm",
    skillBadge: "bg-indigo-600 text-white px-3 py-1 rounded-full font-bold text-xs mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#312e81', headingColor: '#4f46e5', textColor: '#475569', accentColor: '#4f46e5' }
  },
  techOrbit: {
    label: "Tech Orbit",
    category: "Iconic",
    layout: "sidebar",
    container: "bg-slate-50 h-full flex flex-row min-h-[297mm]",
    sidebarStyle: "w-[30%] bg-slate-900 text-white p-8 pt-12 flex flex-col gap-10",
    mainStyle: "w-[70%] p-10 pt-12",
    name: "text-4xl font-bold leading-tight mb-2",
    role: "text-lg text-indigo-400 font-medium",
    sectionHeaderMain: "text-2xl font-bold text-slate-900 mb-6 border-b-2 border-indigo-500 inline-block pb-1",
    sectionHeaderSide: "text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-700 pb-2",
    itemTitle: "text-xl font-bold text-slate-900",
    itemSubtitle: "text-indigo-600 font-medium",
    itemDate: "text-slate-500 text-sm mb-2 block",
    text: "text-slate-600 leading-relaxed text-sm",
    skillBadge: "text-indigo-400 border border-indigo-400/30 px-2 py-1 rounded text-xs mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#ffffff', headingColor: '#0f172a', textColor: '#475569', accentColor: '#6366f1' }
  },
  stackView: {
    label: "Stack View",
    category: "Iconic",
    layout: "standard",
    container: "bg-white text-slate-800 font-sans p-12",
    headerWrapper: "text-center mb-12 bg-slate-50 p-8 rounded-2xl border border-slate-100",
    name: "text-4xl font-bold text-slate-900 tracking-tight",
    role: "text-lg text-slate-500 uppercase tracking-widest mt-2",
    sectionHeader: "text-lg font-bold text-slate-900 uppercase tracking-wide mb-8 text-center relative after:content-[''] after:block after:w-12 after:h-1 after:bg-indigo-500 after:mx-auto after:mt-2",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-600",
    itemDate: "text-slate-400 text-sm italic",
    text: "text-slate-700 text-sm leading-relaxed",
    skillBadge: "bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 text-xs font-medium mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#334155', accentColor: '#6366f1' }
  },
  visualGrid: {
    label: "Visual Grid",
    category: "Iconic",
    layout: "compact",
    container: "bg-white text-slate-900 font-sans p-8",
    headerWrapper: "border-l-8 border-blue-500 pl-6 mb-8",
    name: "text-5xl font-bold text-slate-900",
    role: "text-xl text-blue-600 font-bold mt-1",
    sectionHeader: "text-xl font-bold text-slate-900 mb-4 mt-8",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-600 font-medium",
    itemDate: "text-slate-400 text-sm",
    text: "text-slate-600 text-sm leading-relaxed",
    skillBadge: "text-slate-900 font-bold text-xs border-b-2 border-blue-500 mr-3 mb-2 inline-block",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#475569', accentColor: '#3b82f6' }
  },
  badgePro: {
    label: "Badge Pro",
    category: "Iconic",
    layout: "standard",
    container: "bg-white text-slate-900 font-sans p-10 border-4 border-slate-900",
    headerWrapper: "flex flex-col items-start mb-10",
    name: "text-6xl font-black text-slate-900 tracking-tighter",
    role: "text-2xl font-bold bg-slate-900 text-white px-3 py-1 mt-2 transform -rotate-1",
    sectionHeader: "text-2xl font-black text-slate-900 uppercase mb-6 border-b-4 border-slate-900 pb-2 w-full",
    itemTitle: "text-xl font-bold text-slate-900",
    itemSubtitle: "text-slate-700 font-bold",
    itemDate: "text-slate-500 font-bold text-sm",
    text: "text-slate-700 text-sm font-medium leading-relaxed",
    skillBadge: "bg-slate-900 text-white px-3 py-1 font-black uppercase tracking-wider text-xs mr-2 mb-2 inline-block transform -rotate-2",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#334155', accentColor: '#0f172a' }
  },
  vsCodeDark: {
    label: "VS Code Dark",
    category: "Coder",
    layout: "sidebar",
    container: "bg-[#1e1e1e] text-[#d4d4d4] font-mono h-full flex flex-row min-h-[297mm]",
    sidebarStyle: "w-[25%] bg-[#252526] text-[#cccccc] p-4 pt-8 border-r border-[#333]",
    mainStyle: "w-[75%] p-8 pt-8 bg-[#1e1e1e]",
    name: "text-4xl font-bold text-[#569cd6]",
    role: "text-lg text-[#ce9178] mt-2 italic",
    sectionHeaderMain: "text-xl font-bold text-[#c586c0] mb-4 mt-2 flex items-center gap-2 before:content-['function'] before:text-[#569cd6] before:mr-2 before:text-sm",
    sectionHeaderSide: "text-xs font-bold text-[#858585] uppercase tracking-widest mb-4 mt-6 pl-2",
    itemTitle: "text-lg font-bold text-[#dcdcaa]",
    itemSubtitle: "text-[#4ec9b0]",
    itemDate: "text-[#6a9955] text-xs",
    text: "text-[#9cdcfe] text-sm leading-relaxed",
    skillBadge: "text-[#ce9178] text-xs block mb-1 hover:bg-[#2d2d2d] px-2 py-1 rounded cursor-pointer",
    defaultColors: { titleColor: '#569cd6', headingColor: '#c586c0', textColor: '#9cdcfe', accentColor: '#ce9178' }
  },
  vsCodeLight: {
    label: "VS Code Light",
    category: "Coder",
    layout: "sidebar",
    container: "bg-[#ffffff] text-[#000000] font-mono h-full flex flex-row min-h-[297mm]",
    sidebarStyle: "w-[25%] bg-[#f3f3f3] text-[#333] p-4 pt-8 border-r border-[#e1e1e1]",
    mainStyle: "w-[75%] p-8 pt-8 bg-[#ffffff]",
    name: "text-4xl font-bold text-[#0451a5]",
    role: "text-lg text-[#a31515] mt-2",
    sectionHeaderMain: "text-xl font-bold text-[#795e26] mb-4 mt-2",
    sectionHeaderSide: "text-xs font-bold text-[#6f6f6f] uppercase tracking-widest mb-4 mt-6",
    itemTitle: "text-lg font-bold text-[#0000ff]",
    itemSubtitle: "text-[#098658]",
    itemDate: "text-[#008000] text-xs",
    text: "text-[#001080] text-sm leading-relaxed",
    skillBadge: "text-[#a31515] text-xs block mb-1",
    defaultColors: { titleColor: '#0451a5', headingColor: '#795e26', textColor: '#001080', accentColor: '#a31515' }
  },
  gitHubReadme: {
    label: "README.md",
    category: "Coder",
    layout: "standard",
    container: "bg-white text-[#24292f] font-sans p-8 border border-[#d0d7de] rounded-md max-w-[210mm]",
    headerWrapper: "border-b border-[#d0d7de] pb-6 mb-6",
    name: "text-4xl font-bold text-[#24292f]",
    role: "text-xl text-[#57606a] mt-2 font-light",
    sectionHeader: "text-xl font-bold text-[#24292f] border-b border-[#d0d7de] pb-2 mb-4 mt-8 flex gap-2 items-center hover:underline cursor-pointer",
    itemTitle: "text-lg font-bold text-[#0969da]",
    itemSubtitle: "text-[#24292f] font-semibold",
    itemDate: "text-[#57606a] text-sm",
    text: "text-[#24292f] text-sm leading-relaxed",
    skillBadge: "bg-[#ddf4ff] text-[#0969da] px-2 py-1 rounded-full text-xs font-medium mr-2 mb-2 inline-block border border-[#54aeff66]",
    defaultColors: { titleColor: '#24292f', headingColor: '#24292f', textColor: '#24292f', accentColor: '#0969da' }
  },
  terminalZsh: {
    label: "ZSH Terminal",
    category: "Coder",
    layout: "standard",
    container: "bg-[#282c34] text-[#abb2bf] font-mono p-8",
    headerWrapper: "mb-8 pb-4 border-b border-[#3e4451]",
    name: "text-3xl font-bold text-[#98c379] flex items-center gap-2 before:content-['➜'] before:text-[#61afef]",
    role: "text-lg text-[#e06c75] mt-2 pl-6",
    sectionHeader: "text-lg font-bold text-[#61afef] mb-4 mt-6 bg-[#3e4451] inline-block px-2 py-1 rounded",
    itemTitle: "text-lg font-bold text-[#e5c07b]",
    itemSubtitle: "text-[#56b6c2]",
    itemDate: "text-[#5c6370] text-sm",
    text: "text-[#abb2bf] text-sm leading-relaxed pl-2 border-l-2 border-[#3e4451] ml-1",
    skillBadge: "text-[#d19a66] mr-4 mb-1 inline-block before:content-['git:(master)'] before:text-[#5c6370] before:mr-1 before:text-[10px]",
    defaultColors: { titleColor: '#98c379', headingColor: '#61afef', textColor: '#abb2bf', accentColor: '#e06c75' }
  },
  documentationDocs: {
    label: "Docs Theme",
    category: "Coder",
    layout: "sidebar",
    container: "bg-white text-slate-900 font-sans h-full flex flex-row min-h-[297mm]",
    sidebarStyle: "w-[25%] bg-slate-50 border-r border-slate-200 p-6 pt-10 overflow-hidden",
    mainStyle: "w-[75%] p-10 pt-12",
    name: "text-3xl font-extrabold text-slate-900 tracking-tight",
    role: "text-lg text-blue-600 font-medium mt-2",
    sectionHeaderMain: "text-2xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200",
    sectionHeaderSide: "text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 mt-6",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-600 font-medium",
    itemDate: "text-slate-400 text-sm",
    text: "text-slate-600 text-sm leading-7",
    skillBadge: "text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium block mb-2 w-fit",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#475569', accentColor: '#2563eb' }
  },
  jsonSchema: {
    label: "JSON Schema",
    category: "Coder",
    layout: "standard",
    container: "bg-[#2b2b2b] text-[#a9b7c6] font-mono p-8 border-l-[20px] border-[#3c3f41]",
    headerWrapper: "mb-6",
    name: "text-3xl font-bold text-[#cc7832]",
    role: "text-xl text-[#6a8759] mt-1 before:content-['\"'] after:content-['\",']",
    sectionHeader: "text-lg font-bold text-[#9876aa] mb-4 mt-6 before:content-['\"'] after:content-['\":_[']",
    itemTitle: "text-lg font-bold text-[#a9b7c6] before:content-['{_\"role\":_\"'] after:content-['\",']",
    itemSubtitle: "text-[#6a8759] text-sm before:content-['\"company\":_\"'] after:content-['\",'] block",
    itemDate: "text-[#808080] text-xs before:content-['//_']",
    text: "text-[#6a8759] text-sm leading-relaxed mt-1 before:content-['\"desc\":_\"'] after:content-['\"_},'] block pl-4",
    skillBadge: "text-[#cc7832] mr-2 mb-1 inline-block after:content-[',']",
    defaultColors: { titleColor: '#cc7832', headingColor: '#9876aa', textColor: '#6a8759', accentColor: '#cc7832' }
  },
  sqlQuery: {
    label: "SQL Query",
    category: "Coder",
    layout: "standard",
    container: "bg-[#f0f0f0] text-[#333] font-mono p-10",
    headerWrapper: "mb-8 border-b-2 border-[#ccc] pb-6",
    name: "text-4xl font-bold text-[#333] before:content-['SELECT_'] before:text-blue-600 before:text-xl before:align-middle",
    role: "text-xl text-[#333] mt-2 before:content-['AS_'] before:text-blue-600 before:text-sm before:align-middle",
    sectionHeader: "text-lg font-bold text-blue-600 mb-4 mt-8 border-b border-[#ccc] uppercase",
    itemTitle: "text-lg font-bold text-[#333]",
    itemSubtitle: "text-[#555] italic",
    itemDate: "text-[#777] text-sm",
    text: "text-[#444] text-sm leading-relaxed",
    skillBadge: "bg-white border border-[#ccc] px-2 py-1 text-xs mr-2 mb-2 inline-block text-blue-600 font-bold",
    defaultColors: { titleColor: '#333333', headingColor: '#2563eb', textColor: '#444444', accentColor: '#2563eb' }
  },
  matrixCode: {
    label: "The Matrix",
    category: "Coder",
    layout: "standard",
    container: "bg-black text-[#00ff41] font-mono p-8 shadow-[0_0_20px_rgba(0,255,65,0.2)]",
    headerWrapper: "mb-8 border-b border-[#008f11] pb-6",
    name: "text-4xl font-bold text-[#00ff41] tracking-widest uppercase shadow-[#00ff41] drop-shadow-md",
    role: "text-xl text-[#008f11] mt-2 tracking-[0.2em]",
    sectionHeader: "text-lg font-bold text-[#00ff41] mb-4 mt-6 border-l-4 border-[#00ff41] pl-4 uppercase",
    itemTitle: "text-lg font-bold text-[#e0ffe5]",
    itemSubtitle: "text-[#008f11]",
    itemDate: "text-[#003b00] text-sm font-bold",
    text: "text-[#00ff41] text-sm leading-relaxed opacity-80",
    skillBadge: "border border-[#00ff41] px-2 py-1 text-xs mr-2 mb-2 inline-block hover:bg-[#003b00] transition-colors",
    defaultColors: { titleColor: '#00ff41', headingColor: '#00ff41', textColor: '#00ff41', accentColor: '#008f11' }
  },
  cleanRepo: {
    label: "Clean Repo",
    category: "Coder",
    layout: "standard",
    container: "bg-white text-slate-800 font-sans p-12",
    headerWrapper: "flex items-center gap-4 mb-10 border-b border-slate-200 pb-8",
    name: "text-3xl font-bold text-slate-900",
    role: "text-sm font-mono bg-slate-100 px-3 py-1 rounded text-slate-600",
    sectionHeader: "text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 mt-2 flex items-center gap-2",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-600",
    itemDate: "text-slate-400 text-sm font-mono",
    text: "text-slate-700 text-sm leading-relaxed",
    skillBadge: "bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded text-xs font-mono mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#334155', accentColor: '#0f172a' }
  },
  devOpsBlueprint: {
    label: "DevOps Blueprint",
    category: "Coder",
    layout: "standard",
    container: "bg-[#002b36] text-[#839496] font-mono p-10 bg-[linear-gradient(#073642_1px,transparent_1px),linear-gradient(90deg,#073642_1px,transparent_1px)] bg-[size:20px_20px]",
    headerWrapper: "mb-8 border-2 border-[#586e75] p-6 bg-[#002b36]",
    name: "text-3xl font-bold text-[#b58900]",
    role: "text-lg text-[#2aa198] mt-2",
    sectionHeader: "text-lg font-bold text-[#cb4b16] mb-4 mt-6 uppercase tracking-widest border-b border-[#586e75] pb-2",
    itemTitle: "text-lg font-bold text-[#268bd2]",
    itemSubtitle: "text-[#6c71c4]",
    itemDate: "text-[#586e75] text-sm",
    text: "text-[#839496] text-sm leading-relaxed",
    skillBadge: "border border-[#2aa198] text-[#2aa198] px-2 py-1 text-xs mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#b58900', headingColor: '#cb4b16', textColor: '#839496', accentColor: '#2aa198' }
  },
  modernExecutive: {
    label: "Modern Executive",
    category: "Modern",
    layout: "standard",
    container: "bg-white text-slate-900 font-sans",
    headerWrapper: "bg-slate-900 text-white p-10 -mx-12 -mt-12 mb-10",
    name: "text-5xl font-bold tracking-tight",
    role: "text-xl text-blue-400 font-medium mt-2 uppercase tracking-wide",
    sectionHeader: "text-2xl font-bold text-slate-900 mb-6 border-l-4 border-blue-600 pl-4 uppercase tracking-tight",
    itemTitle: "text-xl font-bold text-slate-900",
    itemSubtitle: "text-slate-600 font-medium uppercase tracking-wide text-sm",
    itemDate: "text-blue-600 font-bold text-sm",
    text: "text-slate-600 leading-relaxed text-sm mt-2",
    skillBadge: "bg-slate-100 text-slate-900 px-3 py-1 text-sm font-bold mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#475569', accentColor: '#2563eb' }
  },
  silicon: {
    label: "Silicon Valley",
    category: "Modern",
    layout: "standard",
    container: "bg-white text-slate-900 font-sans",
    headerWrapper: "border-b-4 border-blue-600 pb-6 mb-6",
    name: "text-4xl font-bold tracking-tight text-slate-900 uppercase",
    role: "text-xl text-blue-600 font-medium mt-1",
    sectionHeader: "text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-100 pb-1",
    itemTitle: "text-lg font-bold text-slate-800",
    itemSubtitle: "text-slate-600 font-medium",
    itemDate: "text-slate-400 text-sm",
    text: "text-slate-600 leading-relaxed text-sm",
    skillBadge: "px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#0f172a', headingColor: '#94a3b8', textColor: '#475569', accentColor: '#2563eb' }
  },
  amsterdam: {
    label: "Amsterdam",
    category: "Modern",
    layout: "standard",
    container: "bg-white text-slate-800 font-sans",
    headerWrapper: "flex flex-col items-center pb-6 mb-6 bg-slate-50 pt-8 -mx-12 px-12 border-b border-slate-200",
    name: "text-4xl font-black tracking-tighter text-slate-900",
    role: "text-lg font-medium text-indigo-600 mt-2 tracking-wide uppercase",
    sectionHeader: "text-xl font-bold text-slate-900 mb-4 relative pl-4 border-l-4 border-indigo-500",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-indigo-600 font-medium",
    itemDate: "text-slate-400 text-sm font-mono",
    text: "text-slate-600 leading-relaxed text-sm",
    skillBadge: "px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-xs font-bold mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#475569', accentColor: '#4f46e5' }
  },
  stockholm: {
    label: "Stockholm",
    category: "Modern",
    layout: "standard",
    container: "bg-[#f8f9fa] text-slate-800 font-sans p-10",
    headerWrapper: "pb-8 mb-8 border-b-2 border-slate-200",
    name: "text-5xl font-light tracking-tight text-slate-900",
    role: "text-xl text-slate-500 font-light mt-2",
    sectionHeader: "text-sm font-bold text-slate-900 uppercase tracking-[0.2em] mb-6 mt-8",
    itemTitle: "text-lg font-medium text-slate-900",
    itemSubtitle: "text-slate-500",
    itemDate: "text-slate-400 text-xs uppercase tracking-wide",
    text: "text-slate-600 font-light leading-7 text-sm",
    skillBadge: "text-slate-500 border-b border-slate-300 pb-0.5 mr-4 mb-2 inline-block text-xs uppercase tracking-wider",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#475569', accentColor: '#64748b' }
  },
  tokyo: {
    label: "Tokyo",
    category: "Modern",
    layout: "sidebar",
    container: "bg-white h-full flex flex-row min-h-[297mm]",
    sidebarStyle: "w-[30%] bg-red-600 text-white p-6 flex flex-col gap-6",
    mainStyle: "w-[70%] p-8 pt-12",
    name: "text-3xl font-bold leading-tight",
    role: "text-sm bg-white text-red-600 inline-block px-2 py-1 font-bold mt-2 mb-6",
    sectionHeaderMain: "text-2xl font-bold text-slate-900 mb-6 border-b-2 border-red-600 pb-2 inline-block",
    sectionHeaderSide: "text-sm font-bold text-white/80 uppercase tracking-widest mb-4 border-b border-white/20 pb-2",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-red-600 font-bold",
    itemDate: "text-slate-400 text-sm mb-1 block",
    text: "text-slate-600 leading-relaxed text-sm",
    skillBadge: "block mb-2 text-white text-sm font-medium bg-white/10 px-2 py-1 rounded",
    defaultColors: { titleColor: '#ffffff', headingColor: '#0f172a', textColor: '#475569', accentColor: '#dc2626' }
  },
  berlin: {
    label: "Berlin Startup",
    category: "Modern",
    layout: "standard",
    container: "bg-slate-50 text-slate-900 font-sans",
    headerWrapper: "bg-slate-900 text-white p-10 -mx-12 -mt-12 mb-8",
    name: "text-5xl font-bold tracking-tighter",
    role: "text-xl text-yellow-400 font-medium mt-2",
    sectionHeader: "text-2xl font-bold text-slate-900 mb-4 border-l-8 border-yellow-400 pl-4",
    itemTitle: "text-xl font-bold text-slate-900",
    itemSubtitle: "text-slate-600 font-medium",
    itemDate: "text-slate-400 text-sm",
    text: "text-slate-700 leading-relaxed text-sm font-medium",
    skillBadge: "bg-yellow-400 text-black px-3 py-1 text-xs font-bold mr-2 mb-2 inline-block transform -rotate-1",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#334155', accentColor: '#facc15' }
  },
  austin: {
    label: "Austin Tech",
    category: "Modern",
    layout: "standard",
    container: "bg-white text-slate-800 font-sans border-t-8 border-orange-500",
    headerWrapper: "pb-6 mb-6 border-b border-slate-200",
    name: "text-4xl font-bold text-slate-900",
    role: "text-lg text-orange-500 font-bold uppercase tracking-wider mt-1",
    sectionHeader: "text-sm font-bold text-orange-500 uppercase tracking-widest mb-4",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-600",
    itemDate: "text-slate-400 text-sm",
    text: "text-slate-600 leading-relaxed text-sm",
    skillBadge: "border border-orange-200 text-orange-600 px-2 py-1 rounded text-xs font-medium mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#0f172a', headingColor: '#f97316', textColor: '#475569', accentColor: '#f97316' }
  },
  melbourne: {
    label: "Melbourne",
    category: "Modern",
    layout: "sidebar",
    container: "bg-white h-full flex flex-row min-h-[297mm]",
    sidebarStyle: "w-[35%] bg-slate-100 p-8 pt-12 border-r border-slate-200",
    mainStyle: "w-[65%] p-8 pt-12",
    name: "text-3xl font-black uppercase tracking-wide text-slate-900",
    role: "text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mt-2 mb-8",
    sectionHeaderMain: "text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide",
    sectionHeaderSide: "text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-300 pb-2",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-600 italic",
    itemDate: "text-slate-400 text-xs uppercase mb-1 block",
    text: "text-slate-600 leading-relaxed text-sm",
    skillBadge: "block mb-2 text-slate-600 text-sm border-b border-slate-200 pb-1",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#475569', accentColor: '#64748b' }
  },
  wallStreet: {
    label: "Wall Street",
    category: "Professional",
    layout: "standard",
    container: "bg-white text-black font-serif",
    headerWrapper: "border-b border-black pb-6 mb-6 text-center",
    name: "text-3xl font-bold tracking-wide uppercase text-black",
    role: "text-lg italic text-gray-800 mt-2",
    sectionHeader: "text-center text-lg font-bold uppercase border-b border-black mb-4 pb-1 tracking-widest",
    itemTitle: "text-lg font-bold text-black",
    itemSubtitle: "italic text-gray-900",
    itemDate: "text-gray-800 text-sm",
    text: "text-gray-900 leading-relaxed text-sm text-justify",
    skillBadge: "mr-4 mb-1 inline-block italic border-b border-gray-300 pb-0.5",
    defaultColors: { titleColor: '#000000', headingColor: '#000000', textColor: '#111827', accentColor: '#000000' }
  },
  executive: {
    label: "The Executive",
    category: "Professional",
    layout: "standard",
    container: "bg-white text-gray-900 font-serif",
    headerWrapper: "border-b-2 border-gray-800 pb-6 mb-8 flex justify-between items-end",
    name: "text-4xl font-bold text-gray-900",
    role: "text-xl text-gray-700 italic",
    sectionHeader: "text-lg font-bold text-gray-900 uppercase border-b border-gray-300 mb-4 pb-1 mt-6",
    itemTitle: "text-lg font-bold text-gray-900",
    itemSubtitle: "font-medium text-gray-700 italic",
    itemDate: "text-gray-600 text-sm font-medium",
    text: "text-gray-800 text-sm leading-relaxed",
    skillBadge: "text-gray-800 text-sm mr-4 mb-1 inline-block font-medium",
    defaultColors: { titleColor: '#111827', headingColor: '#111827', textColor: '#1f2937', accentColor: '#1f2937' }
  },
  legal: {
    label: "Legal Counsel",
    category: "Professional",
    layout: "standard",
    container: "bg-[#fffff0] text-slate-900 font-serif p-12 border-l-[12px] border-double border-slate-800",
    headerWrapper: "mb-8 pb-4 border-b border-slate-400",
    name: "text-3xl font-bold text-slate-900 uppercase tracking-widest",
    role: "text-sm font-bold text-slate-600 uppercase mt-1",
    sectionHeader: "text-sm font-bold text-slate-800 uppercase border-b border-slate-800 mb-3 pb-1",
    itemTitle: "text-base font-bold text-slate-900",
    itemSubtitle: "text-slate-700 italic",
    itemDate: "text-slate-600 text-xs",
    text: "text-slate-800 text-sm leading-6 text-justify",
    skillBadge: "mr-3 mb-1 inline-block text-xs font-bold text-slate-700 uppercase",
    defaultColors: { titleColor: '#0f172a', headingColor: '#1e293b', textColor: '#1e293b', accentColor: '#1e293b' }
  },
  consultant: {
    label: "Global Consultant",
    category: "Professional",
    layout: "standard",
    container: "bg-white text-slate-900 font-sans",
    headerWrapper: "bg-slate-800 text-white p-8 -mx-12 -mt-12 mb-10 shadow-lg",
    name: "text-3xl font-bold uppercase tracking-wider",
    role: "text-sm text-slate-300 uppercase tracking-[0.3em] mt-2",
    sectionHeader: "text-lg font-bold text-slate-800 uppercase mb-4 flex items-center gap-4 before:w-8 before:h-px before:bg-slate-300 after:flex-1 after:h-px after:bg-slate-300",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-600",
    itemDate: "text-slate-500 text-sm italic",
    text: "text-slate-700 text-sm leading-relaxed",
    skillBadge: "bg-slate-100 text-slate-700 px-3 py-1 text-xs uppercase tracking-wider mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#ffffff', headingColor: '#1e293b', textColor: '#334155', accentColor: '#1e293b' }
  },
  finance: {
    label: "Investment Bank",
    category: "Professional",
    layout: "standard",
    container: "bg-white text-slate-900 font-serif",
    headerWrapper: "border-b border-emerald-800 pb-4 mb-6",
    name: "text-4xl font-bold text-emerald-950",
    role: "text-lg text-emerald-800 font-medium mt-1",
    sectionHeader: "text-base font-bold text-emerald-900 uppercase border-b border-emerald-200 mb-3 pb-1",
    itemTitle: "text-base font-bold text-slate-900",
    itemSubtitle: "text-slate-700",
    itemDate: "text-slate-500 text-sm",
    text: "text-slate-800 text-sm leading-snug",
    skillBadge: "text-emerald-900 border border-emerald-200 px-2 py-0.5 text-xs mr-2 mb-2 inline-block bg-emerald-50",
    defaultColors: { titleColor: '#022c22', headingColor: '#064e3b', textColor: '#1e293b', accentColor: '#064e3b' }
  },
  luxury: {
    label: "Luxury Brand",
    category: "Professional",
    layout: "standard",
    container: "bg-neutral-900 text-neutral-200 font-serif p-10",
    headerWrapper: "text-center border-b border-neutral-700 pb-8 mb-8",
    name: "text-4xl text-amber-400 font-medium tracking-[0.1em] uppercase",
    role: "text-xs text-neutral-400 uppercase tracking-[0.3em] mt-3",
    sectionHeader: "text-center text-amber-500/80 text-sm uppercase tracking-[0.2em] mb-6",
    itemTitle: "text-lg text-neutral-100 font-medium",
    itemSubtitle: "text-neutral-400 italic",
    itemDate: "text-neutral-500 text-xs uppercase",
    text: "text-neutral-300 text-sm font-light leading-relaxed",
    skillBadge: "text-amber-500/70 text-xs border border-neutral-800 px-3 py-1 mr-2 mb-2 inline-block uppercase tracking-widest",
    defaultColors: { titleColor: '#fbbf24', headingColor: '#f59e0b', textColor: '#d4d4d4', accentColor: '#fbbf24' }
  },
  chicago: {
    label: "Chicago Law",
    category: "Professional",
    layout: "standard",
    container: "bg-stone-100 text-stone-900 font-serif p-10 border-8 border-stone-300",
    headerWrapper: "border-b-4 border-stone-800 pb-6 mb-8",
    name: "text-4xl font-black text-stone-900 uppercase",
    role: "text-xl text-stone-600 italic mt-1",
    sectionHeader: "text-lg font-bold text-stone-900 uppercase tracking-widest mb-4 border-b border-stone-400 pb-1",
    itemTitle: "text-lg font-bold text-stone-900",
    itemSubtitle: "text-stone-700 font-medium",
    itemDate: "text-stone-500 text-sm italic",
    text: "text-stone-800 text-sm leading-relaxed",
    skillBadge: "text-stone-900 font-bold text-sm mr-4 mb-1 inline-block underline decoration-stone-400",
    defaultColors: { titleColor: '#1c1917', headingColor: '#1c1917', textColor: '#292524', accentColor: '#1c1917' }
  },
  hrTalent: {
    label: "People & Culture",
    category: "Professional",
    layout: "standard",
    container: "bg-white text-slate-800 font-sans",
    headerWrapper: "bg-rose-50 border-b-4 border-rose-400 p-8 -mx-12 -mt-12 mb-8",
    name: "text-4xl font-bold text-rose-900",
    role: "text-lg text-rose-600 font-medium mt-1",
    sectionHeader: "text-lg font-bold text-rose-800 uppercase tracking-wide mb-4",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-600",
    itemDate: "text-slate-400 text-sm",
    text: "text-slate-600 leading-relaxed text-sm",
    skillBadge: "bg-rose-50 text-rose-700 px-2 py-1 rounded text-xs font-bold mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#881337', headingColor: '#9f1239', textColor: '#475569', accentColor: '#e11d48' }
  },
  supplyChain: {
    label: "Logistics Pro",
    category: "Professional",
    layout: "standard",
    container: "bg-white text-slate-900 font-sans",
    headerWrapper: "border-b-2 border-orange-500 pb-6 mb-6 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-1/3 after:h-[2px] after:bg-blue-600",
    name: "text-4xl font-bold text-slate-900",
    role: "text-xl text-blue-700 font-bold uppercase tracking-tighter",
    sectionHeader: "text-lg font-bold text-slate-900 uppercase mb-4 flex items-center gap-2 before:w-3 before:h-3 before:bg-orange-500",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-blue-600 font-medium",
    itemDate: "text-slate-400 text-sm",
    text: "text-slate-700 text-sm leading-relaxed",
    skillBadge: "border-l-4 border-orange-500 bg-slate-50 pl-2 pr-2 py-1 text-xs font-bold text-slate-700 mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#334155', accentColor: '#f97316' }
  },
  nonprofit: {
    label: "Social Impact",
    category: "Professional",
    layout: "standard",
    container: "bg-[#fcf9f0] text-stone-800 font-serif",
    headerWrapper: "border-b border-stone-300 pb-6 mb-8",
    name: "text-4xl font-medium text-stone-900",
    role: "text-lg text-stone-500 italic mt-1",
    sectionHeader: "text-lg font-bold text-stone-700 uppercase tracking-widest mb-4",
    itemTitle: "text-lg font-bold text-stone-900",
    itemSubtitle: "text-stone-600 italic",
    itemDate: "text-stone-400 text-sm",
    text: "text-stone-700 text-sm leading-relaxed",
    skillBadge: "bg-stone-200 text-stone-700 px-2 py-1 text-xs rounded mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#1c1917', headingColor: '#44403c', textColor: '#44403c', accentColor: '#44403c' }
  },
  gallery: {
    label: "Art Gallery",
    category: "Creative",
    layout: "standard",
    container: "bg-white text-black font-sans p-12 border-[20px] border-black",
    headerWrapper: "text-center mb-12",
    name: "text-5xl font-light uppercase tracking-[0.2em]",
    role: "text-xs font-bold uppercase tracking-[0.5em] bg-black text-white inline-block px-2 py-1 mt-4",
    sectionHeader: "text-center text-sm font-bold uppercase tracking-[0.3em] mb-8 border-b border-black pb-4",
    itemTitle: "text-xl font-bold text-black text-center",
    itemSubtitle: "text-sm text-gray-500 uppercase tracking-widest text-center",
    itemDate: "text-xs text-gray-400 text-center mb-2 block",
    text: "text-gray-800 text-sm leading-relaxed text-center max-w-lg mx-auto",
    skillBadge: "border border-black px-4 py-2 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#000000', headingColor: '#000000', textColor: '#1f2937', accentColor: '#000000' }
  },
  studio: {
    label: "Design Studio",
    category: "Creative",
    layout: "sidebar",
    container: "bg-zinc-900 h-full flex flex-row min-h-[297mm] text-white",
    sidebarStyle: "w-[40%] bg-zinc-800 p-10 flex flex-col gap-8 border-r border-zinc-700",
    mainStyle: "w-[60%] p-10 pt-14",
    name: "text-5xl font-black leading-none tracking-tighter",
    role: "text-xl text-yellow-500 font-bold mt-4",
    sectionHeaderMain: "text-2xl font-black text-white mb-6 uppercase tracking-tight border-b-4 border-yellow-500 pb-2 inline-block",
    sectionHeaderSide: "text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4",
    itemTitle: "text-xl font-bold text-white",
    itemSubtitle: "text-yellow-500 font-bold",
    itemDate: "text-zinc-500 text-sm mb-2 block",
    text: "text-zinc-300 leading-relaxed text-sm",
    skillBadge: "block mb-2 text-white text-lg font-bold hover:text-yellow-500 transition-colors cursor-default",
    defaultColors: { titleColor: '#ffffff', headingColor: '#ffffff', textColor: '#d4d4d4', accentColor: '#eab308' }
  },
  architecture: {
    label: "The Architect",
    category: "Creative",
    layout: "standard",
    container: "bg-[#f0f0f0] text-slate-900 font-sans p-10 border-[12px] border-slate-900",
    headerWrapper: "mb-10 text-right",
    name: "text-6xl font-black uppercase tracking-tighter text-slate-900",
    role: "text-2xl font-light text-slate-600 uppercase tracking-[0.2em] -mt-2",
    sectionHeader: "text-xl font-black uppercase mb-6 border-l-[12px] border-slate-900 pl-4",
    itemTitle: "text-xl font-bold text-slate-900",
    itemSubtitle: "text-slate-600 font-bold",
    itemDate: "text-slate-400 font-mono",
    text: "text-slate-700 text-sm font-medium leading-relaxed",
    skillBadge: "bg-slate-900 text-white px-3 py-1 font-bold text-xs mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#334155', accentColor: '#0f172a' }
  },
  brutalist: {
    label: "Neo-Brutalist",
    category: "Creative",
    layout: "standard",
    container: "bg-[#FFFDF5] text-black font-mono border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8",
    headerWrapper: "bg-pink-400 border-4 border-black p-6 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    name: "text-4xl font-black uppercase tracking-tighter",
    role: "text-xl font-bold bg-yellow-300 inline-block px-2 mt-2 border-2 border-black",
    sectionHeader: "text-2xl font-black bg-black text-white inline-block px-3 py-1 mb-4 transform -rotate-1",
    itemTitle: "text-xl font-bold border-b-2 border-black inline-block mb-1",
    itemSubtitle: "font-bold text-pink-600",
    itemDate: "text-xs font-bold bg-gray-200 px-2 py-1 border border-black inline-block ml-2",
    text: "font-medium leading-snug text-sm mt-2",
    skillBadge: "px-2 py-1 bg-white border-2 border-black text-black font-bold text-xs mr-2 mb-2 inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all",
    defaultColors: { titleColor: '#000000', headingColor: '#ffffff', textColor: '#000000', accentColor: '#db2777' }
  },
  creative: {
    label: "The Creative",
    category: "Creative",
    layout: "sidebar",
    container: "bg-white h-full flex flex-row min-h-[297mm]",
    sidebarStyle: "w-[35%] bg-slate-900 text-white p-8 flex flex-col gap-8",
    mainStyle: "w-[65%] p-8 pt-12",
    name: "text-3xl font-bold leading-tight",
    role: "text-lg text-blue-400 font-medium mt-2 mb-6",
    sectionHeaderMain: "text-2xl font-bold text-slate-900 mb-6 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-blue-500 pb-2",
    sectionHeaderSide: "text-sm font-bold text-slate-400 uppercase tracking-widest mb-4",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-blue-600 font-medium",
    itemDate: "text-slate-400 text-sm mb-2 block",
    text: "text-slate-600 leading-relaxed text-sm",
    contactItem: "flex items-center gap-3 text-sm text-slate-300 mb-3",
    skillBadge: "block mb-2 text-slate-300 text-sm border-b border-slate-700 pb-1",
    defaultColors: { titleColor: '#ffffff', headingColor: '#0f172a', textColor: '#475569', accentColor: '#3b82f6' }
  },
  vogue: {
    label: "Vogue Portfolio",
    category: "Creative",
    layout: "standard",
    container: "bg-white text-slate-900 font-serif",
    headerWrapper: "text-center py-12 mb-8 border-b border-slate-200",
    name: "text-6xl font-medium tracking-tighter italic",
    role: "text-sm font-bold uppercase tracking-[0.3em] mt-4 text-slate-900",
    sectionHeader: "text-center text-2xl italic font-medium text-slate-900 mb-8 relative after:content-[''] after:block after:w-8 after:h-px after:bg-black after:mx-auto after:mt-2",
    itemTitle: "text-xl font-bold text-slate-900 text-center",
    itemSubtitle: "text-slate-500 text-center italic block",
    itemDate: "text-slate-400 text-xs text-center block mb-2",
    text: "text-slate-700 text-sm leading-relaxed text-center max-w-lg mx-auto",
    skillBadge: "text-slate-900 border border-slate-900 px-3 py-1 text-xs uppercase tracking-widest mr-2 mb-2 inline-block hover:bg-slate-900 hover:text-white transition-colors",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#334155', accentColor: '#0f172a' }
  },
  bauhaus: {
    label: "Bauhaus Art",
    category: "Creative",
    layout: "standard",
    container: "bg-stone-50 text-slate-900 font-sans p-8 border-8 border-slate-900",
    headerWrapper: "flex flex-col gap-4 mb-10 border-b-8 border-slate-900 pb-8",
    name: "text-5xl font-black uppercase tracking-tighter bg-yellow-400 inline-block p-2 w-fit transform rotate-1 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    role: "text-xl font-bold bg-blue-500 text-white inline-block p-2 w-fit -rotate-1 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    sectionHeader: "text-2xl font-black bg-red-500 text-white inline-block px-4 py-1 mb-6 border-4 border-slate-900",
    itemTitle: "text-xl font-bold text-slate-900",
    itemSubtitle: "text-slate-600 font-bold",
    itemDate: "text-slate-400 font-mono text-xs bg-slate-200 px-1 inline-block",
    text: "text-slate-700 font-medium leading-relaxed border-l-4 border-slate-900 pl-4 mt-2",
    skillBadge: "bg-white border-2 border-slate-900 text-slate-900 px-2 py-1 font-bold text-xs mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#000000', headingColor: '#ffffff', textColor: '#334155', accentColor: '#ef4444' }
  },
  newspaper: {
    label: "The Times",
    category: "Creative",
    layout: "standard",
    container: "bg-[#f4f1ea] text-slate-900 font-serif p-8 columns-1",
    headerWrapper: "text-center border-b-4 border-double border-slate-900 pb-4 mb-8",
    name: "text-6xl font-black uppercase tracking-tight font-serif",
    role: "text-lg font-bold uppercase tracking-widest mt-2 border-t border-b border-slate-900 py-1 inline-block",
    sectionHeader: "text-xl font-bold uppercase text-center border-b-2 border-slate-900 mb-4 pb-1",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-700 italic",
    itemDate: "text-slate-500 text-xs",
    text: "text-slate-800 text-sm leading-snug text-justify",
    skillBadge: "text-slate-900 border border-slate-400 px-1 mr-2 mb-1 inline-block text-xs",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#1e293b', accentColor: '#0f172a' }
  },
  cyberpunk: {
    label: "Night City",
    category: "Creative",
    layout: "standard",
    container: "bg-black text-[#0ff] font-mono p-8 border-2 border-[#f0f]",
    headerWrapper: "mb-8 border-b-2 border-[#f0f] pb-6 relative after:content-['NET_RUNNER_V2.0'] after:absolute after:top-0 after:right-0 after:text-xs after:bg-[#f0f] after:text-black after:px-1",
    name: "text-5xl font-bold text-[#ff0] uppercase tracking-tighter drop-shadow-[2px_2px_0px_rgba(255,0,255,0.8)]",
    role: "text-xl text-[#0ff] mt-2 uppercase tracking-widest",
    sectionHeader: "text-xl font-bold text-[#f0f] uppercase tracking-widest mb-4 border-l-4 border-[#ff0] pl-2",
    itemTitle: "text-lg font-bold text-white",
    itemSubtitle: "text-[#0ff]",
    itemDate: "text-[#f0f] text-xs",
    text: "text-[#0ff] text-sm leading-relaxed opacity-90",
    skillBadge: "border border-[#ff0] text-[#ff0] px-2 py-0.5 text-xs mr-2 mb-2 inline-block hover:bg-[#ff0] hover:text-black transition-colors",
    defaultColors: { titleColor: '#ffff00', headingColor: '#ff00ff', textColor: '#00ffff', accentColor: '#ff00ff' }
  },
  pop: {
    label: "Pop Art",
    category: "Creative",
    layout: "standard",
    container: "bg-white text-slate-900 font-sans p-8 border-8 border-indigo-600 rounded-3xl",
    headerWrapper: "bg-pink-500 text-white p-8 -mx-8 -mt-8 mb-8 rounded-t-xl",
    name: "text-5xl font-black tracking-tight",
    role: "text-xl font-bold text-yellow-300 mt-2",
    sectionHeader: "text-2xl font-black text-indigo-600 mb-4 uppercase",
    itemTitle: "text-xl font-bold text-slate-900",
    itemSubtitle: "text-pink-500 font-bold",
    itemDate: "text-slate-400 font-bold text-sm",
    text: "text-slate-700 font-medium leading-relaxed",
    skillBadge: "bg-yellow-300 text-indigo-900 px-3 py-1 rounded-full text-xs font-black mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#ffffff', headingColor: '#4f46e5', textColor: '#334155', accentColor: '#ec4899' }
  },
  film: {
    label: "Screenplay",
    category: "Creative",
    layout: "standard",
    container: "bg-white text-black font-mono p-12 max-w-[210mm]",
    headerWrapper: "text-center mb-12 uppercase",
    name: "text-2xl font-bold underline underline-offset-4",
    role: "text-sm mt-4",
    sectionHeader: "text-center text-sm font-bold underline underline-offset-4 mb-6 uppercase",
    itemTitle: "text-sm font-bold uppercase",
    itemSubtitle: "text-sm",
    itemDate: "text-sm opacity-60",
    text: "text-sm leading-relaxed mt-2 max-w-xl mx-auto",
    skillBadge: "mr-3 mb-1 inline-block text-sm border border-black px-1",
    defaultColors: { titleColor: '#000000', headingColor: '#000000', textColor: '#000000', accentColor: '#000000' }
  },
  eventPlanner: {
    label: "Event Coordinator",
    category: "Creative",
    layout: "standard",
    container: "bg-white text-slate-900 font-sans p-8 border-8 border-double border-pink-300",
    headerWrapper: "text-center mb-8",
    name: "text-5xl font-serif italic text-pink-600",
    role: "text-sm font-bold uppercase tracking-widest text-slate-500 mt-2",
    sectionHeader: "text-center text-lg font-bold text-pink-500 uppercase tracking-widest mb-6",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-pink-400 italic",
    itemDate: "text-slate-400 text-xs uppercase",
    text: "text-slate-600 text-sm leading-relaxed text-center",
    skillBadge: "bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-xs font-bold mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#db2777', headingColor: '#ec4899', textColor: '#475569', accentColor: '#ec4899' }
  },
  dataScience: {
    label: "Data Scientist",
    category: "Technical",
    layout: "standard",
    container: "bg-slate-900 text-slate-300 font-sans",
    headerWrapper: "border-b border-slate-700 pb-6 mb-6 flex justify-between items-center",
    name: "text-4xl font-mono font-bold text-cyan-400",
    role: "text-xl text-purple-400 font-mono mt-1",
    sectionHeader: "text-sm font-bold text-cyan-500 uppercase tracking-widest mb-4 border-b border-slate-700 pb-1",
    itemTitle: "text-lg font-bold text-white",
    itemSubtitle: "text-purple-300 font-mono text-sm",
    itemDate: "text-slate-500 text-xs",
    text: "text-slate-400 text-sm leading-relaxed",
    skillBadge: "bg-slate-800 text-cyan-400 border border-slate-700 px-2 py-1 text-xs font-mono mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#22d3ee', headingColor: '#06b6d4', textColor: '#94a3b8', accentColor: '#c084fc' }
  },
  qaTesting: {
    label: "QA Engineer",
    category: "Technical",
    layout: "standard",
    container: "bg-slate-50 text-slate-900 font-mono",
    headerWrapper: "bg-emerald-900 text-emerald-400 p-8 -mx-12 -mt-12 mb-8 font-mono",
    name: "text-3xl font-bold",
    role: "text-emerald-200 text-sm uppercase tracking-widest mt-1",
    sectionHeader: "text-lg font-bold text-emerald-800 uppercase mb-4 border-b border-emerald-200 pb-1",
    itemTitle: "text-lg font-bold text-slate-900 flex items-center gap-2 before:content-['✓'] before:text-emerald-600",
    itemSubtitle: "text-slate-600 font-bold",
    itemDate: "text-slate-400 text-xs",
    text: "text-slate-700 text-sm leading-relaxed",
    skillBadge: "text-emerald-700 bg-emerald-100 px-2 py-1 text-xs font-bold mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#022c22', headingColor: '#065f46', textColor: '#334155', accentColor: '#10b981' }
  },
  dev: {
    label: "Dark Mode Dev",
    category: "Technical",
    layout: "standard",
    container: "bg-[#1e1e1e] text-[#d4d4d4] font-mono",
    headerWrapper: "border-b border-[#333] pb-6 mb-6",
    name: "text-4xl font-bold text-[#569cd6]",
    role: "text-xl text-[#ce9178] mt-1",
    sectionHeader: "text-lg font-bold text-[#c586c0] mb-3 mt-6 pl-2 border-l-2 border-[#c586c0]",
    itemTitle: "text-lg font-bold text-[#4ec9b0]",
    itemSubtitle: "text-[#dcdcaa]",
    itemDate: "text-[#6a9955] text-sm",
    text: "text-[#9cdcfe] leading-relaxed text-sm opacity-90",
    skillBadge: "text-[#ce9178] mr-3 mb-1 inline-block before:content-['const'] before:text-[#569cd6] before:mr-1 after:content-[';'] after:text-[#d4d4d4]",
    defaultColors: { titleColor: '#569cd6', headingColor: '#c586c0', textColor: '#9cdcfe', accentColor: '#ce9178' }
  },
  hacker: {
    label: "Terminal",
    category: "Technical",
    layout: "standard",
    container: "bg-black text-[#00ff00] font-mono p-8 border border-[#003300]",
    headerWrapper: "mb-8 border-b border-[#00ff00] pb-4 border-dashed",
    name: "text-3xl font-bold uppercase tracking-widest animate-pulse",
    role: "text-xl mt-2 before:content-['>_'] before:mr-2",
    sectionHeader: "text-lg font-bold bg-[#003300] text-[#00ff00] inline-block px-2 py-1 mb-4",
    itemTitle: "text-lg font-bold text-[#ccffcc]",
    itemSubtitle: "text-[#00cc00]",
    itemDate: "text-[#006600] text-sm",
    text: "text-[#00ff00] text-sm leading-relaxed opacity-90",
    skillBadge: "border border-[#00ff00] px-2 py-0.5 mr-2 mb-2 inline-block text-xs hover:bg-[#003300]",
    defaultColors: { titleColor: '#00ff00', headingColor: '#00ff00', textColor: '#00ff00', accentColor: '#003300' }
  },
  secure: {
    label: "Cyber Shield",
    category: "Technical",
    layout: "standard",
    container: "bg-slate-900 text-cyan-50 font-sans p-8 border-l-4 border-red-500",
    headerWrapper: "mb-8 bg-slate-800 p-6 rounded-r-lg border-l-4 border-cyan-500",
    name: "text-4xl font-bold text-white tracking-wide",
    role: "text-red-400 font-mono text-lg mt-1",
    sectionHeader: "text-cyan-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2 before:w-2 before:h-2 before:bg-red-500 before:rounded-full",
    itemTitle: "text-xl font-bold text-white",
    itemSubtitle: "text-slate-400 font-mono text-sm",
    itemDate: "text-slate-500 text-xs",
    text: "text-slate-300 text-sm leading-relaxed",
    skillBadge: "bg-slate-800 text-cyan-400 border border-cyan-900 px-2 py-1 text-xs font-mono mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#ffffff', headingColor: '#22d3ee', textColor: '#cbd5e1', accentColor: '#22d3ee' }
  },
  blueprint: {
    label: "Blueprint",
    category: "Technical",
    layout: "standard",
    container: "bg-[#0a4b78] text-white font-mono p-8 border-[1px] border-white/30 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]",
    headerWrapper: "border-2 border-white p-6 mb-8 relative after:content-['SPEC_SHEET'] after:absolute after:-top-3 after:left-4 after:bg-[#0a4b78] after:px-2 after:text-xs",
    name: "text-4xl font-bold uppercase tracking-widest",
    role: "text-white/70 text-sm uppercase border-b border-white/30 inline-block pb-1 mt-2",
    sectionHeader: "text-lg font-bold text-white border-b-2 border-white mb-4 inline-block pr-8",
    itemTitle: "text-xl font-bold text-white uppercase",
    itemSubtitle: "text-white/80 text-sm italic",
    itemDate: "text-white/60 text-xs",
    text: "text-white/90 text-sm leading-relaxed",
    skillBadge: "border border-white/50 px-2 py-1 text-xs mr-2 mb-2 inline-block hover:bg-white/10",
    defaultColors: { titleColor: '#ffffff', headingColor: '#ffffff', textColor: '#ffffff', accentColor: '#ffffff' }
  },
  engineer: {
    label: "Civil Engineer",
    category: "Technical",
    layout: "standard",
    container: "bg-white text-slate-900 font-sans p-8 border-t-8 border-orange-600",
    headerWrapper: "grid grid-cols-3 gap-4 border-b-2 border-slate-200 pb-6 mb-6",
    name: "text-3xl font-bold text-slate-900 col-span-2 uppercase",
    role: "text-right col-span-1 text-orange-600 font-bold uppercase tracking-tighter mt-1",
    sectionHeader: "text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 border-l-4 border-orange-600 pl-3",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-600 font-medium",
    itemDate: "text-slate-400 text-sm",
    text: "text-slate-700 text-sm leading-relaxed",
    skillBadge: "bg-slate-100 text-slate-700 px-2 py-1 text-xs font-mono mr-2 mb-2 inline-block border border-slate-200",
    defaultColors: { titleColor: '#0f172a', headingColor: '#64748b', textColor: '#334155', accentColor: '#ea580c' }
  },
  compact: {
    label: "Compact Pro",
    category: "Technical",
    layout: "compact",
    container: "bg-white text-slate-900 font-sans p-6",
    headerWrapper: "border-b border-slate-300 pb-2 mb-4",
    name: "text-2xl font-bold text-slate-900",
    role: "text-sm text-slate-600 font-bold uppercase",
    sectionHeader: "text-sm font-bold bg-slate-200 inline-block px-2 py-0.5 mb-2 rounded",
    itemTitle: "text-sm font-bold text-slate-900 inline mr-2",
    itemSubtitle: "text-sm text-slate-600 inline",
    itemDate: "text-xs text-slate-400 float-right",
    text: "text-slate-700 text-xs leading-tight mt-0.5",
    skillBadge: "text-xs text-slate-700 bg-slate-100 px-1 rounded border border-slate-200 mr-1 mb-1 inline-block",
    defaultColors: { titleColor: '#0f172a', headingColor: '#e2e8f0', textColor: '#334155', accentColor: '#e2e8f0' }
  },
  clinical: {
    label: "Clinical Care",
    category: "Industry",
    layout: "standard",
    container: "bg-white text-slate-800 font-sans",
    headerWrapper: "bg-teal-50 border-b-4 border-teal-500 p-8 -mx-12 -mt-12 mb-8",
    name: "text-4xl font-bold text-teal-900",
    role: "text-xl text-teal-600 font-medium mt-1 flex items-center gap-2",
    sectionHeader: "text-lg font-bold text-teal-800 uppercase tracking-wide mb-4 border-b border-teal-100 pb-2",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-600 font-medium",
    itemDate: "text-slate-400 text-sm font-mono",
    text: "text-slate-600 leading-relaxed text-sm",
    skillBadge: "bg-teal-50 text-teal-800 px-2 py-1 rounded-md text-xs font-bold mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#134e4a', headingColor: '#115e59', textColor: '#475569', accentColor: '#14b8a6' }
  },
  scholar: {
    label: "The Scholar",
    category: "Industry",
    layout: "standard",
    container: "bg-[#fcfcfc] text-slate-900 font-serif p-10 border border-slate-200",
    headerWrapper: "text-center border-b border-slate-300 pb-6 mb-8",
    name: "text-4xl font-bold text-slate-900 tracking-tight",
    role: "text-lg text-slate-600 italic mt-2",
    sectionHeader: "text-base font-bold text-slate-900 uppercase mb-4 border-b border-slate-200 pb-1",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-700 italic",
    itemDate: "text-slate-500 text-sm",
    text: "text-slate-800 text-sm leading-relaxed text-justify",
    skillBadge: "text-slate-600 text-sm italic mr-3 mb-1 inline-block",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#1e293b', accentColor: '#475569' }
  },
  dynamic: {
    label: "Sales Dynamic",
    category: "Industry",
    layout: "standard",
    container: "bg-white text-slate-900 font-sans",
    headerWrapper: "bg-gradient-to-r from-blue-900 to-blue-700 text-white p-10 -mx-12 -mt-12 mb-10 clip-path-polygon",
    name: "text-5xl font-black uppercase italic tracking-tighter",
    role: "text-xl font-bold text-yellow-400 mt-1",
    sectionHeader: "text-2xl font-black text-blue-900 mb-4 uppercase italic",
    itemTitle: "text-xl font-bold text-slate-900",
    itemSubtitle: "text-blue-600 font-bold",
    itemDate: "text-slate-400 font-bold text-sm",
    text: "text-slate-700 font-medium leading-relaxed",
    skillBadge: "bg-blue-100 text-blue-900 px-3 py-1 text-xs font-black uppercase transform -skew-x-12 mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#ffffff', headingColor: '#1e3a8a', textColor: '#334155', accentColor: '#facc15' }
  },
  fresh: {
    label: "Fresh Grad",
    category: "Industry",
    layout: "standard",
    container: "bg-white text-slate-700 font-sans",
    headerWrapper: "bg-emerald-50 rounded-3xl p-8 mb-8 text-center",
    name: "text-3xl font-bold text-emerald-800",
    role: "text-lg text-emerald-600 font-medium mt-2",
    sectionHeader: "text-lg font-bold text-emerald-700 mb-4 flex items-center gap-2 justify-center",
    itemTitle: "text-lg font-bold text-slate-800",
    itemSubtitle: "text-slate-500",
    itemDate: "text-slate-400 text-sm",
    text: "text-slate-600 text-sm leading-relaxed",
    skillBadge: "bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#065f46', headingColor: '#047857', textColor: '#475569', accentColor: '#10b981' }
  },
  hospitality: {
    label: "Hospitality",
    category: "Industry",
    layout: "standard",
    container: "bg-[#fffaf5] text-slate-800 font-sans",
    headerWrapper: "border-b-2 border-orange-200 pb-6 mb-8 text-center",
    name: "text-4xl font-serif text-orange-900",
    role: "text-sm uppercase tracking-widest text-orange-600 mt-2 font-bold",
    sectionHeader: "text-center text-sm font-bold text-orange-400 uppercase tracking-widest mb-6",
    itemTitle: "text-lg font-bold text-slate-800",
    itemSubtitle: "text-orange-600 italic",
    itemDate: "text-slate-400 text-sm",
    text: "text-slate-600 text-sm leading-relaxed",
    skillBadge: "text-orange-800 border border-orange-200 px-2 py-1 rounded text-xs font-medium mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#7c2d12', headingColor: '#fb923c', textColor: '#475569', accentColor: '#ea580c' }
  },
  eco: {
    label: "Eco Sustainability",
    category: "Industry",
    layout: "sidebar",
    container: "bg-[#f1f8f1] h-full flex flex-row min-h-[297mm]",
    sidebarStyle: "w-[30%] bg-[#2e7d32] text-white p-6 pt-10",
    mainStyle: "w-[70%] p-8 pt-10 bg-[#f1f8f1] text-green-900",
    name: "text-3xl font-bold leading-tight text-white",
    role: "text-sm bg-green-800 text-green-100 inline-block px-3 py-1 rounded-full mt-2 mb-6",
    sectionHeaderMain: "text-xl font-bold text-green-900 mb-4 border-b border-green-300 pb-2",
    sectionHeaderSide: "text-sm font-bold text-green-100 uppercase tracking-widest mb-4 border-b border-green-600 pb-1",
    itemTitle: "text-lg font-bold text-green-900",
    itemSubtitle: "text-green-700 font-medium",
    itemDate: "text-green-600 text-sm",
    text: "text-green-800 text-sm leading-relaxed",
    skillBadge: "block mb-2 text-green-50 text-sm",
    defaultColors: { titleColor: '#ffffff', headingColor: '#14532d', textColor: '#166534', accentColor: '#16a34a' }
  },
  chef: {
    label: "Culinary Arts",
    category: "Industry",
    layout: "standard",
    container: "bg-white text-stone-800 font-serif p-10 border-4 border-stone-800",
    headerWrapper: "text-center mb-10",
    name: "text-5xl font-bold text-stone-900 tracking-tighter",
    role: "text-sm font-bold uppercase tracking-[0.3em] text-red-700 mt-2",
    sectionHeader: "text-center text-lg font-bold text-stone-900 uppercase mb-6 flex items-center justify-center gap-4 before:h-px before:w-12 before:bg-stone-300 after:h-px after:w-12 after:bg-stone-300",
    itemTitle: "text-lg font-bold text-stone-900",
    itemSubtitle: "text-stone-600 italic",
    itemDate: "text-stone-400 text-xs uppercase",
    text: "text-stone-700 text-sm leading-relaxed text-center",
    skillBadge: "text-stone-500 text-xs uppercase tracking-widest border-b border-stone-200 pb-1 mr-3 mb-1 inline-block",
    defaultColors: { titleColor: '#1c1917', headingColor: '#1c1917', textColor: '#44403c', accentColor: '#b91c1c' }
  },
  teacher: {
    label: "Education",
    category: "Industry",
    layout: "standard",
    container: "bg-[#fffbf0] text-slate-800 font-sans p-8 border-t-[16px] border-red-500",
    headerWrapper: "pb-6 mb-6 border-b-2 border-red-100",
    name: "text-4xl font-bold text-slate-900",
    role: "text-xl text-red-500 font-bold mt-1",
    sectionHeader: "text-lg font-bold text-red-600 mb-3 flex items-center gap-2",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-600",
    itemDate: "text-slate-500 text-sm",
    text: "text-slate-700 text-sm leading-relaxed",
    skillBadge: "bg-red-50 text-red-800 px-3 py-1 rounded-full text-xs font-bold mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#0f172a', headingColor: '#dc2626', textColor: '#334155', accentColor: '#dc2626' }
  },
  realestate: {
    label: "Real Estate",
    category: "Industry",
    layout: "standard",
    container: "bg-white text-slate-900 font-sans",
    headerWrapper: "bg-slate-900 text-white p-12 -mx-12 -mt-12 mb-12",
    name: "text-4xl font-serif tracking-wide",
    role: "text-sm uppercase tracking-[0.3em] text-amber-400 mt-2",
    sectionHeader: "text-xl font-serif text-slate-900 mb-4 border-b border-amber-400 pb-1 inline-block",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-600",
    itemDate: "text-slate-400 text-sm",
    text: "text-slate-700 text-sm leading-relaxed",
    skillBadge: "text-slate-800 border border-slate-200 px-2 py-1 text-xs uppercase tracking-wider mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#ffffff', headingColor: '#0f172a', textColor: '#334155', accentColor: '#fbbf24' }
  },
  fashion: {
    label: "Fashion Editorial",
    category: "Industry",
    layout: "standard",
    container: "bg-white text-black font-sans p-0",
    headerWrapper: "p-12 bg-stone-100 mb-12 text-center",
    name: "text-5xl font-black uppercase tracking-tighter",
    role: "text-xs font-bold uppercase tracking-[0.4em] mt-3",
    sectionHeader: "text-4xl font-black text-stone-200 uppercase mb-6 -ml-4",
    itemTitle: "text-lg font-bold text-black uppercase",
    itemSubtitle: "text-stone-500 italic",
    itemDate: "text-stone-400 text-xs",
    text: "text-black text-sm font-medium leading-relaxed",
    skillBadge: "text-black font-bold text-xs border-b-2 border-black mr-3 mb-1 inline-block uppercase",
    defaultColors: { titleColor: '#000000', headingColor: '#e7e5e4', textColor: '#000000', accentColor: '#000000' }
  },
  minimalist: {
    label: "Minimalist Mono",
    category: "Minimalist",
    layout: "standard",
    container: "bg-white text-slate-800 font-sans",
    headerWrapper: "text-center pb-8 mb-8",
    name: "text-3xl font-light tracking-[0.2em] uppercase text-slate-900",
    role: "text-sm font-bold tracking-widest uppercase text-slate-400 mt-2",
    sectionHeader: "text-xs font-bold text-slate-900 uppercase tracking-[0.15em] mb-4 text-center",
    itemTitle: "text-base font-semibold text-slate-900",
    itemSubtitle: "text-sm text-slate-500",
    itemDate: "text-xs text-slate-400 uppercase tracking-wide",
    text: "text-slate-600 text-sm leading-7 font-light",
    skillBadge: "px-4 py-1 border border-slate-200 rounded-full text-xs text-slate-500 mr-2 mb-2 inline-block",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#475569', accentColor: '#0f172a' }
  },
  ghost: {
    label: "The Ghost",
    category: "Minimalist",
    layout: "standard",
    container: "bg-white text-slate-500 font-sans",
    headerWrapper: "mb-12",
    name: "text-4xl font-thin text-slate-400 tracking-tight",
    role: "text-lg font-light text-slate-300",
    sectionHeader: "text-sm font-medium text-slate-300 uppercase mb-6",
    itemTitle: "text-base font-normal text-slate-600",
    itemSubtitle: "text-slate-400 font-light",
    itemDate: "text-slate-300 text-xs",
    text: "text-slate-400 text-sm leading-7 font-light",
    skillBadge: "text-slate-400 mr-4 mb-1 inline-block text-sm font-light",
    defaultColors: { titleColor: '#94a3b8', headingColor: '#cbd5e1', textColor: '#94a3b8', accentColor: '#cbd5e1' }
  },
  swiss: {
    label: "Swiss Grid",
    category: "Minimalist",
    layout: "standard",
    container: "bg-white text-black font-sans p-12",
    headerWrapper: "mb-12 grid grid-cols-2 gap-4",
    name: "text-6xl font-bold tracking-tighter leading-none col-span-2",
    role: "text-xl font-bold text-red-600 col-span-2",
    sectionHeader: "text-2xl font-bold text-black mb-4 mt-8",
    itemTitle: "text-xl font-bold text-black leading-tight",
    itemSubtitle: "text-lg font-medium text-slate-600",
    itemDate: "text-slate-500 font-medium",
    text: "text-black text-lg leading-snug font-medium mt-2",
    skillBadge: "text-black font-bold text-lg mr-4 mb-2 inline-block border-b-4 border-black leading-4",
    defaultColors: { titleColor: '#000000', headingColor: '#000000', textColor: '#000000', accentColor: '#dc2626' }
  },
  typography: {
    label: "Pure Type",
    category: "Minimalist",
    layout: "standard",
    container: "bg-white text-slate-900 font-serif",
    headerWrapper: "mb-12",
    name: "text-5xl italic font-bold text-slate-900",
    role: "text-lg text-slate-500 font-sans mt-2",
    sectionHeader: "text-sm font-bold text-slate-400 font-sans uppercase tracking-widest mb-6",
    itemTitle: "text-xl font-bold text-slate-900 italic",
    itemSubtitle: "text-slate-600 font-sans text-sm",
    itemDate: "text-slate-400 font-sans text-xs",
    text: "text-slate-700 font-sans text-sm leading-relaxed",
    skillBadge: "text-slate-500 font-sans text-xs border border-slate-200 rounded px-2 py-1 mr-2 mb-1 inline-block",
    defaultColors: { titleColor: '#0f172a', headingColor: '#94a3b8', textColor: '#334155', accentColor: '#64748b' }
  },
  air: {
    label: "Air & Space",
    category: "Minimalist",
    layout: "standard",
    container: "bg-sky-50 text-slate-700 font-sans p-10",
    headerWrapper: "flex justify-between items-center mb-12 border-b border-sky-200 pb-8",
    name: "text-3xl font-light text-sky-900 uppercase tracking-[0.2em]",
    role: "text-xs font-bold text-sky-500 uppercase tracking-widest",
    sectionHeader: "text-sky-800 font-medium uppercase tracking-widest mb-6 text-sm",
    itemTitle: "text-lg font-medium text-sky-900",
    itemSubtitle: "text-sky-600/70",
    itemDate: "text-sky-400 text-xs",
    text: "text-slate-600 text-sm font-light leading-relaxed",
    skillBadge: "text-sky-600 bg-sky-100 px-2 py-1 rounded text-xs mr-2 mb-1 inline-block",
    defaultColors: { titleColor: '#0c4a6e', headingColor: '#075985', textColor: '#475569', accentColor: '#0ea5e9' }
  },
  mono: {
    label: "Monospaced",
    category: "Minimalist",
    layout: "standard",
    container: "bg-white text-slate-800 font-mono",
    headerWrapper: "border-b border-slate-800 pb-4 mb-8",
    name: "text-2xl font-bold text-slate-900",
    role: "text-sm text-slate-500 mt-1",
    sectionHeader: "text-sm font-bold text-slate-900 uppercase mb-4 underline decoration-slate-300 underline-offset-4",
    itemTitle: "text-base font-bold text-slate-900",
    itemSubtitle: "text-slate-600 text-xs",
    itemDate: "text-slate-400 text-xs",
    text: "text-slate-600 text-xs leading-relaxed",
    skillBadge: "text-slate-600 bg-slate-100 px-1 text-xs mr-2 mb-1 inline-block",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#475569', accentColor: '#0f172a' }
  },
  classic: {
    label: "Traditional",
    category: "Classic",
    layout: "standard",
    container: "bg-white text-slate-900 font-serif",
    headerWrapper: "text-center border-b-2 border-slate-900 pb-4 mb-6",
    name: "text-3xl font-bold text-slate-900 uppercase",
    role: "text-sm font-bold text-slate-600 uppercase tracking-widest mt-2",
    sectionHeader: "text-base font-bold text-slate-900 uppercase border-b border-slate-300 mb-3 pb-1",
    itemTitle: "text-base font-bold text-slate-900",
    itemSubtitle: "text-slate-700 italic",
    itemDate: "text-slate-600 text-sm",
    text: "text-slate-800 text-sm leading-relaxed",
    skillBadge: "text-slate-800 text-sm mr-3 mb-1 inline-block italic",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#1e293b', accentColor: '#0f172a' }
  },
  ivy: {
    label: "Ivy League",
    category: "Classic",
    layout: "standard",
    container: "bg-[#fdfbf7] text-slate-900 font-serif p-10",
    headerWrapper: "mb-8",
    name: "text-4xl font-bold text-slate-900",
    role: "text-lg text-slate-600 italic mt-1",
    sectionHeader: "text-lg font-bold text-slate-900 mb-4 border-b border-slate-300 pb-1",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-700",
    itemDate: "text-slate-500 text-sm",
    text: "text-slate-800 text-sm leading-relaxed",
    skillBadge: "text-slate-700 text-sm mr-3 mb-1 inline-block border-b border-slate-200",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#1e293b', accentColor: '#334155' }
  },
  cambridge: {
    label: "Cambridge",
    category: "Classic",
    layout: "standard",
    container: "bg-white text-slate-900 font-serif",
    headerWrapper: "flex flex-col items-center mb-8",
    name: "text-3xl font-medium uppercase tracking-widest",
    role: "text-xs font-bold uppercase tracking-[0.4em] mt-2 text-slate-500",
    sectionHeader: "text-center text-sm font-bold uppercase tracking-widest mb-6 relative after:content-[''] after:block after:w-8 after:h-px after:bg-slate-300 after:mx-auto after:mt-2",
    itemTitle: "text-lg font-bold text-slate-900 text-center",
    itemSubtitle: "text-slate-600 italic text-center",
    itemDate: "text-slate-400 text-xs text-center",
    text: "text-slate-700 text-sm leading-relaxed text-center max-w-xl mx-auto",
    skillBadge: "text-slate-600 text-xs uppercase tracking-wider mr-2 mb-1 inline-block",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#334155', accentColor: '#0f172a' }
  },
  oxford: {
    label: "Oxford",
    category: "Classic",
    layout: "sidebar",
    container: "bg-white h-full flex flex-row min-h-[297mm]",
    sidebarStyle: "w-[30%] bg-slate-100 p-8 pt-12 border-r border-double border-slate-300",
    mainStyle: "w-[70%] p-8 pt-12",
    name: "text-3xl font-bold text-slate-900",
    role: "text-lg text-slate-600 italic mt-2 mb-8",
    sectionHeaderMain: "text-lg font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-300 pb-1",
    sectionHeaderSide: "text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-300 pb-1",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-600 italic",
    itemDate: "text-slate-500 text-sm",
    text: "text-slate-800 text-sm leading-relaxed",
    skillBadge: "block mb-1 text-slate-700 text-sm italic",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#1e293b', accentColor: '#475569' }
  },
  novel: {
    label: "The Novelist",
    category: "Classic",
    layout: "standard",
    container: "bg-[#fffdf5] text-slate-900 font-serif leading-loose",
    headerWrapper: "text-left mb-10 border-l-4 border-slate-900 pl-6",
    name: "text-4xl font-bold text-slate-900",
    role: "text-lg text-slate-600 italic mt-2",
    sectionHeader: "text-xl font-bold italic text-slate-900 mb-4",
    itemTitle: "text-lg font-bold text-slate-900",
    itemSubtitle: "text-slate-700",
    itemDate: "text-slate-500 text-sm italic",
    text: "text-slate-800 text-sm leading-7",
    skillBadge: "text-slate-800 italic mr-3 mb-1 inline-block",
    defaultColors: { titleColor: '#0f172a', headingColor: '#0f172a', textColor: '#1e293b', accentColor: '#1e293b' }
  }
};

const applyTheme = (config: TemplateConfig, design: DesignSettings): TemplateConfig => {
  if (!design) return config;
  
  if (config.defaultColors && design.accentColor === config.defaultColors.accentColor) {
    return config;
  }
  
  const newConfig = { ...config };
  
  if (design.accentColor) {
    const targetColor = design.accentColor;
    const colorRegex = /(text|bg|border)-(blue|indigo|purple|pink|red|orange|green|teal|sky|cyan|emerald|violet|fuchsia|rose|amber|yellow|lime|slate|gray|zinc|neutral|stone)-(\d+)/g;
    
    const replaceColor = (str?: string) => {
      if (!str) return undefined;
      return str.replace(colorRegex, (match, prefix, color, shade) => {
         if (['slate', 'gray', 'zinc', 'neutral', 'stone', 'black', 'white'].includes(color) && parseInt(shade) > 400) {
           return match; 
         }
         return `${prefix}-${targetColor}-${shade}`;
      });
    };

    newConfig.name = replaceColor(newConfig.name) || newConfig.name;
    newConfig.role = replaceColor(newConfig.role) || newConfig.role;
    newConfig.sectionHeader = replaceColor(newConfig.sectionHeader) || newConfig.sectionHeader;
    newConfig.sectionHeaderMain = replaceColor(newConfig.sectionHeaderMain) || newConfig.sectionHeaderMain;
    newConfig.sectionHeaderSide = replaceColor(newConfig.sectionHeaderSide) || newConfig.sectionHeaderSide;
    newConfig.itemSubtitle = replaceColor(newConfig.itemSubtitle) || newConfig.itemSubtitle;
    newConfig.skillBadge = replaceColor(newConfig.skillBadge) || newConfig.skillBadge;
    newConfig.headerWrapper = replaceColor(newConfig.headerWrapper) || newConfig.headerWrapper;
    newConfig.sidebarStyle = replaceColor(newConfig.sidebarStyle) || newConfig.sidebarStyle;
  }
  
  return newConfig;
};

const INITIAL_STATE: ResumeFormData = {
  fullName: "Jainam Jain",
  role: "Full-Stack Developer",
  email: "jainjainam412@gmail.com",
  phone: "+91 86000-59074",
  location: "Virar, Mumbai, India",
  portfolio: "",
  summary: "I'm a driven B.Sc. IT student at Thakur College of Science & Commerce with a strong foundation in computer science principles, including Data Structures, Algorithms, and OOP. My journey in tech is fueled by a fascination with building robust and efficient software solutions. I enjoy applying my knowledge to practical challenges, from developing full-stack applications to visualizing data with tools like Power BI and Tableau.",
  skills: [
    "Python", "C++", "PHP", "HTML5", "CSS3", "JavaScript", 
    "SQL", "Power BI", "Tableau", "DSA", "Algorithms", "OOP"
  ],
  experience: [
    {
      id: "1",
      role: "Student Ambassador",
      company: "LetsUpgrade",
      date: "Sep 2025 - Present",
      description: "Representing LetsUpgrade on campus, fostering a community of learners through events and workshops. Demonstrating leadership and team coordination skills to promote educational programs."
    },
    {
      id: "2",
      role: "Campus Ambassador (ISP)",
      company: "Internshala",
      date: "Sep 2025",
      description: "Driving brand engagement and awareness on campus through strategic social media and digital marketing initiatives."
    },
    {
      id: "3",
      role: "Exam Proctor",
      company: "EnFuse Solutions",
      date: "Sep 2025",
      description: "Monitored online examinations to ensure compliance with academic integrity standards."
    },
    {
      id: "4",
      role: "Product Management Job Simulation",
      company: "Electronic Arts (Forage)",
      date: "Aug - 2025",
      description: "Successfully completed practical tasks simulating the role of a Product Manager at a leading gaming company."
    },
    {
      id: "5",
      role: "UX Design Job Simulation",
      company: "Lloyds Banking Group (Forage)",
      date: "Aug - 2025",
      description: "Completed a simulation of a UX Designer role, delivering practical work samples."
    },
    {
      id: "6",
      role: "Extension Work Volunteer",
      company: "DLLE, University of Mumbai",
      date: "2024 - 2025",
      description: "Completed over 120 hours of extension activities in fields like Information Technology and Career Guidance."
    }
  ],
  education: [
    {
      id: "1",
      degree: "Bachelor of Science in Information Technology (BSc IT)",
      school: "Thakur College Of Science & Commerce",
      year: "2024 - 2027"
    },
    {
      id: "2",
      degree: "Technical Certificates",
      school: "Google Cloud (Simpli Learn) & Others",
      year: "2025"
    }
  ]
};

const EMPTY_STATE: ResumeFormData = {
  fullName: "",
  role: "",
  email: "",
  phone: "",
  location: "",
  portfolio: "",
  summary: "",
  skills: [],
  experience: [],
  education: []
};

// --- MOCK AI HELPERS ---

const mockSummaries = (role: string) => [
  `The Expert: Seasoned ${role || 'Professional'} with a proven track record of delivering scalable solutions and driving technical excellence in fast-paced environments.`,
  `The Innovator: Forward-thinking ${role || 'Professional'} passionate about leveraging emerging technologies to solve complex business problems and enhance user experiences.`,
  `The Leader: Strategic ${role || 'Professional'} skilled in mentoring teams, optimizing workflows, and aligning technical initiatives with organizational goals.`
];

const enhanceBullet = (text: string) => {
  const lowercaseText = text.toLowerCase();
  
  if (lowercaseText.includes("manage") || lowercaseText.includes("lead") || lowercaseText.includes("coordinate")) {
    return `Orchestrated a cross-functional team of ${Math.floor(Math.random() * 10) + 5} members to drive "${text}", resulting in a ${Math.floor(Math.random() * 20) + 15}% increase in productivity.`;
  }
  
  if (lowercaseText.includes("build") || lowercaseText.includes("create") || lowercaseText.includes("develop") || lowercaseText.includes("design")) {
    return `Engineered a scalable solution for "${text}" using modern best practices, reducing latency by ${Math.floor(Math.random() * 30) + 20}% and enhancing user engagement.`;
  }
  
  if (lowercaseText.includes("fix") || lowercaseText.includes("solve") || lowercaseText.includes("debug") || lowercaseText.includes("resolve")) {
    return `Diagnosed and resolved critical issues regarding "${text}", safeguarding system integrity and preventing potential downtime estimated at $${Math.floor(Math.random() * 50) + 10}k annually.`;
  }

  if (lowercaseText.includes("improve") || lowercaseText.includes("increase") || lowercaseText.includes("optimize")) {
    return `Spearheaded optimization initiatives for "${text}", achieving a ${Math.floor(Math.random() * 40) + 20}% improvement in key performance metrics.`;
  }
  
  // Fallback with strong verbs
  const buzzwords = ["Spearheaded", "Championed", "Optimized", "Revamped", "Accelerated", "Pioneered"];
  const randomBuzz = buzzwords[Math.floor(Math.random() * buzzwords.length)];
  return `${randomBuzz} strategic initiatives focusing on "${text}", yielding measurable improvements in operational efficiency and stakeholder alignment.`;
};

const analyzeResume = (data: ResumeFormData): AuditResult => {
  const recs: Recommendation[] = [];
  let score = 100;
  
  const hasMetrics = data.experience.some(exp => /\d+%|\$\d+/.test(exp.description));
  const weakVerbs = ["worked on", "helped", "responsible for", "handled"];
  const hasWeakVerbs = data.experience.some(exp => weakVerbs.some(v => exp.description.toLowerCase().includes(v)));

  if (!hasMetrics && data.experience.length > 0) {
    recs.push({ 
      id: 'impact-1', 
      category: 'impact',
      type: 'warning', 
      message: 'Quantify your impact.',
      action: 'Add numbers (%, $) to your experience descriptions to prove value.'
    });
    score -= 20;
  } else if (data.experience.length > 0) {
    recs.push({
      id: 'impact-2',
      category: 'impact',
      type: 'success',
      message: 'Great use of metrics!'
    });
  }

  if (hasWeakVerbs) {
    recs.push({
      id: 'impact-3',
      category: 'impact',
      type: 'info',
      message: 'Use stronger action verbs.',
      action: 'Replace "Helped" or "Worked on" with "Spearheaded", "Designed", or "Optimized".'
    });
    score -= 5;
  }

  if (!data.summary || data.summary.length < 50) {
    recs.push({ 
      id: 'content-1', 
      category: 'content',
      type: 'warning', 
      message: 'Summary is too short.',
      action: 'Write 2-3 sentences summarizing your unique value proposition.'
    });
    score -= 15;
  }

  if (data.experience.length === 0) {
     recs.push({ id: 'content-2', category: 'content', type: 'warning', message: 'No experience listed.', action: 'Add at least one role.' });
     score -= 20;
  }

  if (!data.email || !data.phone || !data.location) {
    recs.push({ id: 'content-3', category: 'content', type: 'warning', message: 'Incomplete contact info.', action: 'Recruiters need email, phone, and location.' });
    score -= 15;
  }

  if (data.skills.length < 6) {
    recs.push({ 
      id: 'ats-1', 
      category: 'ats',
      type: 'info', 
      message: 'Low skill count.', 
      action: 'Add at least 6-8 hard skills to match job description keywords.' 
    });
    score -= 10;
  } else {
    recs.push({ id: 'ats-2', category: 'ats', type: 'success', message: 'Good keyword density.' });
  }

  return { score: Math.max(0, score), recommendations: recs };
};

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props} 
    className={`w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 dark:text-white transition-all ${props.className}`} 
  />
);

const SliderControl = ({ label, value, min, max, step, onChange, unit = 'px' }: { label: string, value: number, min: number, max: number, step: number, onChange: (val: number) => void, unit?: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-xs font-medium text-slate-400">{label}</label>
      <span className="text-xs text-slate-500 font-mono">{value}{unit}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
  </div>
);

const ColorControl = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
  <div className="flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg">
    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded border border-slate-200 overflow-hidden relative">
        <input 
          type="color" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-0"
        />
      </div>
      <span className="text-[10px] font-mono text-slate-400 uppercase w-12">{value}</span>
    </div>
  </div>
);

// 0. INITIAL LOADER
const InitialLoader = () => (
  <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col items-center justify-center text-white">
     {/* Logo Animation */}
     <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
        <Briefcase className="w-16 h-16 text-indigo-500 animate-bounce" />
     </div>
     <h2 className="text-2xl font-bold tracking-tight mb-2">Resume<span className="text-indigo-500">Architect</span></h2>
     
     {/* Progress Bar */}
     <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden mt-4">
        <div className="h-full bg-indigo-500 animate-[progress_2s_ease-in-out_forwards]"></div>
     </div>
     <p className="text-slate-500 text-xs mt-2 font-mono animate-pulse">Initializing AI Models...</p>

     <style>{`
       @keyframes progress {
         0% { width: 0%; }
         50% { width: 70%; }
         100% { width: 100%; }
       }
     `}</style>
  </div>
);

// 1. LANDING PAGE
const LandingPage = ({ onStart }: { onStart: (withData: boolean) => void }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to window center for 3D tilt
      const x = (e.clientX - window.innerWidth / 2) / 35; // Sensitivity divisor
      const y = (e.clientY - window.innerHeight / 2) / 35;
      setMousePos({ x: e.clientX, y: e.clientY, rotateX: -y, rotateY: x } as any);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col font-sans text-white selection:bg-indigo-500/30">
        <style>{`
          @keyframes beam-h {
            0% { left: -100%; opacity: 0; }
            50% { opacity: 1; }
            100% { left: 100%; opacity: 0; }
          }
          @keyframes beam-v {
            0% { top: -100%; opacity: 0; }
            50% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          .animate-beam-h { animation: beam-h 4s linear infinite; }
          .animate-beam-v { animation: beam-v 4s linear infinite; }
          
          /* Entrance animations */
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
          .delay-100 { animation-delay: 100ms; }
          .delay-200 { animation-delay: 200ms; }
          .delay-300 { animation-delay: 300ms; }
          
          /* Floating anims with parallax feel */
          @keyframes float-card {
            0%, 100% { transform: translateY(0px) translateZ(40px); }
            50% { transform: translateY(-10px) translateZ(40px); }
          }
          @keyframes float-card-deep {
            0%, 100% { transform: translateY(0px) translateZ(80px); }
            50% { transform: translateY(-15px) translateZ(80px); }
          }
          .animate-float-card { animation: float-card 6s ease-in-out infinite; }
          .animate-float-card-deep { animation: float-card-deep 8s ease-in-out infinite; }
        `}</style>
        
        {/* Background Grid & Spotlight */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ 
            backgroundImage: `
              radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(79, 70, 229, 0.1), transparent 40%),
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), 
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `, 
            backgroundSize: '100% 100%, 40px 40px, 40px 40px'
          }} 
        />

        {/* Beams */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent top-[15%] animate-beam-h opacity-40"></div>
          <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent top-[65%] animate-beam-h opacity-40" style={{ animationDelay: '2s', animationDuration: '6s' }}></div>
          <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent left-[20%] animate-beam-v opacity-40" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent left-[85%] animate-beam-v opacity-40" style={{ animationDelay: '3s', animationDuration: '7s' }}></div>
        </div>

        {/* Header - Simple Logo */}
        <div className="relative z-10 px-8 py-6 max-w-7xl mx-auto w-full flex justify-between items-center">
             <div className="flex items-center gap-2">
                <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                    <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight">Resume<span className="text-indigo-400">Architect</span></span>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto w-full px-6 py-8 lg:gap-16 relative z-10">
            
            {/* Left Column: Text */}
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left pt-10 lg:pt-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/50 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30 backdrop-blur-sm opacity-0 animate-fade-in-up">
                    <Sparkles className="w-3 h-3" /> AI-Powered Resume Builder
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter opacity-0 animate-fade-in-up delay-100">
                    Build Your <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 animate-pulse">Dream Career</span>
                </h1>
                
                <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed opacity-0 animate-fade-in-up delay-200">
                    Create ATS-friendly resumes in minutes. Beat the bots with our intelligent editor, real-time preview, and 50+ designer templates.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 opacity-0 animate-fade-in-up delay-300">
                    <button onClick={() => onStart(true)} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_50px_rgba(79,70,229,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <Zap className="w-5 h-5 fill-current" /> Try with Demo Data
                    </button>
                    <button onClick={() => onStart(false)} className="px-8 py-4 bg-slate-900/50 backdrop-blur-sm text-white border border-slate-700 hover:border-indigo-500 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                        <MousePointer2 className="w-5 h-5" /> Start from Scratch
                    </button>
                </div>
                
                <div className="pt-8 flex flex-col md:flex-row items-center justify-center lg:justify-start gap-4 md:gap-8 text-slate-500 text-xs font-bold uppercase tracking-widest opacity-0 animate-fade-in-up delay-300">
                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div> No Sign-up Required</div>
                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div> Free (Limited Time)</div>
                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div> PDF Export</div>
                </div>
            </div>

            {/* Right Column: 3D Visualization */}
            <div className="lg:w-1/2 w-full h-[500px] lg:h-[700px] perspective-1000 flex items-center justify-center relative hidden lg:flex">
                {/* Glowing Orb Behind */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

                {/* 3D Container */}
                <div 
                  className="relative w-[380px] h-[520px] transition-transform duration-200 ease-out preserve-3d"
                  style={{ transform: `rotateX(${(mousePos as any).rotateX || 0}deg) rotateY(${(mousePos as any).rotateY || 0}deg)` }}
                >
                    {/* Main Resume Card */}
                    <div className="absolute inset-0 bg-slate-950 backdrop-blur-xl border border-slate-700 rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
                        {/* Fake Resume Content */}
                        <div className="h-full w-full flex flex-col opacity-100">
                           {/* Decorative Header */}
                           <div className="h-32 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 p-6 flex gap-4 items-end">
                              <div className="w-20 h-20 rounded-xl bg-slate-700/50 border border-slate-600 shadow-inner"></div>
                              <div className="space-y-2 mb-1 flex-1">
                                  <div className="h-6 w-3/4 bg-slate-700 rounded animate-pulse"></div>
                                  <div className="h-3 w-1/2 bg-slate-800 rounded animate-pulse"></div>
                              </div>
                           </div>
                           
                           <div className="flex flex-1">
                              {/* Sidebar */}
                              <div className="w-1/3 bg-slate-900/50 border-r border-slate-800 p-4 space-y-6">
                                 <div className="space-y-2">
                                    <div className="h-2 w-10 bg-slate-700 rounded mb-3"></div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded"></div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded"></div>
                                    <div className="h-1.5 w-3/4 bg-slate-800 rounded"></div>
                                 </div>
                                 <div className="space-y-2">
                                    <div className="h-2 w-12 bg-slate-700 rounded mb-3"></div>
                                    <div className="flex flex-wrap gap-1">
                                       {[1,2,3,4,5].map(i => <div key={i} className="h-4 w-8 bg-slate-800 rounded-sm"></div>)}
                                    </div>
                                 </div>
                              </div>
                              
                              {/* Main Body */}
                              <div className="w-2/3 p-6 space-y-6 bg-slate-950">
                                 {[1,2,3].map(i => (
                                    <div key={i} className="space-y-2">
                                       <div className="flex justify-between">
                                          <div className="h-2.5 w-1/3 bg-slate-700 rounded"></div>
                                          <div className="h-2.5 w-10 bg-slate-800 rounded"></div>
                                       </div>
                                       <div className="h-1.5 w-1/4 bg-indigo-900/40 rounded mb-2"></div>
                                       <div className="space-y-1">
                                          <div className="h-1.5 w-full bg-slate-800/60 rounded"></div>
                                          <div className="h-1.5 w-full bg-slate-800/60 rounded"></div>
                                          <div className="h-1.5 w-5/6 bg-slate-800/60 rounded"></div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                        
                        {/* Glass Overlay/Sheen */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20 pointer-events-none"></div>
                    </div>

                    {/* Floating Element 1: HIRED Badge (Significantly Smaller) */}
                    <div 
                      className="absolute -top-6 -right-10 bg-white p-3 rounded-lg shadow-2xl animate-float-card z-20 flex flex-col items-center justify-center transform rotate-6 border-2 border-green-500"
                      style={{ transform: 'translateZ(50px) rotate(6deg)' }}
                    >
                         <div className="bg-green-100 p-1.5 rounded-full mb-1">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                         </div>
                         <div className="text-sm font-black text-green-600 uppercase tracking-widest leading-none">HIRED!</div>
                    </div>

                    {/* Floating Element 2: Interview Invite (Deep float) */}
                    <div 
                      className="absolute bottom-20 -left-16 bg-white text-slate-900 p-4 rounded-xl shadow-2xl border-l-4 border-indigo-600 w-56 animate-float-card-deep z-20"
                      style={{ animationDelay: '1s', transform: 'translateZ(90px)' }}
                    >
                       <div className="flex items-center gap-2 mb-2">
                          <div className="bg-indigo-100 p-1.5 rounded text-indigo-700"><Calendar className="w-4 h-4" /></div>
                          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Interview Invite</span>
                       </div>
                       <div className="text-sm font-bold">Frontend Engineer</div>
                       <div className="text-xs text-slate-500 mt-0.5">Google • Tomorrow, 10 AM</div>
                    </div>

                    {/* Floating Element 3: Top Candidate */}
                    <div 
                      className="absolute -bottom-6 -right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 animate-float-card z-30"
                      style={{ animationDelay: '2s', transform: 'translateZ(70px)' }}
                    >
                        <Trophy className="w-4 h-4 text-yellow-300" />
                        <span className="text-sm font-bold">Top 5% Candidate</span>
                    </div>

                    {/* Decoration: Code Snippet */}
                     <div 
                      className="absolute top-20 -left-8 bg-slate-900/90 border border-slate-700 p-2 rounded-lg shadow-xl z-10 hidden xl:block animate-float-card"
                       style={{ animationDelay: '3s', transform: 'translateZ(30px) rotate(-5deg)' }}
                     >
                       <div className="flex gap-1 mb-1">
                         <div className="w-2 h-2 rounded-full bg-red-500"></div>
                         <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                         <div className="w-2 h-2 rounded-full bg-green-500"></div>
                       </div>
                       <div className="space-y-1">
                         <div className="h-1.5 w-16 bg-slate-700 rounded"></div>
                         <div className="h-1.5 w-10 bg-slate-700 rounded"></div>
                         <div className="h-1.5 w-12 bg-slate-700 rounded"></div>
                       </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

// 2. INTERVIEW MODAL
const InterviewModal = ({ isOpen, onClose, role }: { isOpen: boolean; onClose: () => void; role: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: 'bot', text: `Hello! I see you're applying for a ${role || 'candidate'} position. Let's start. Tell me about a time you faced a significant technical challenge.` }]);
    }
  }, [isOpen, role, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const score = Math.floor(Math.random() * 3) + 7;
      const feedback = ["Good structure using the STAR method.", "That's a strong example of leadership.", "Interesting approach to problem-solving.", "I like how you quantified your impact."];
      const randomFeedback = feedback[Math.floor(Math.random() * feedback.length)];
      setMessages(prev => [...prev, { sender: 'bot', text: `Analysis: ${randomFeedback} (Score: ${score}/10)\n\nFollow-up: How would you handle a disagreement with a stakeholder about this project?`, score }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in zoom-in-95 duration-200">
        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2"><Bot className="w-6 h-6" /><h3 className="font-bold">AI Interviewer</h3></div>
          <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-slate-900/50 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 text-gray-800 rounded-bl-none shadow-sm'}`}>
                {msg.score && (<div className="text-xs font-bold text-green-600 dark:text-green-400 mb-1 bg-green-50 dark:bg-green-900/30 inline-block px-1 rounded">Score: {msg.score}/10</div>)}
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (<div className="flex justify-start"><div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 p-3 rounded-lg rounded-bl-none shadow-sm flex gap-1"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" /></div></div>)}
        </div>
        <div className="p-4 border-t dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type your answer..." className="flex-1 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <button onClick={handleSend} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"><Send className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
};

// 3. FORM EDITOR
const Editor = ({ 
  formData, setFormData, currentTemplate, setTemplate, onOpenInterview, resumeTitle, setResumeTitle, designSettings, setDesignSettings
}: { 
  formData: ResumeFormData; setFormData: React.Dispatch<React.SetStateAction<ResumeFormData>>; currentTemplate: TemplateKey; setTemplate: (k: TemplateKey) => void; onOpenInterview: () => void; resumeTitle: string; setResumeTitle: (t: string) => void; designSettings: DesignSettings; setDesignSettings: React.Dispatch<React.SetStateAction<DesignSettings>>;
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
  const [aiLoading, setAiLoading] = useState<{ type: string, id?: string } | null>(null);
  const [summaryOptions, setSummaryOptions] = useState<string[] | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [templateCategory, setTemplateCategory] = useState<string>('All');
  const [templateLayout, setTemplateLayout] = useState<string>('All');

  const filteredTemplates = useMemo(() => {
    return Object.entries(TEMPLATES).filter(([_, config]) => {
       const categoryMatch = templateCategory === 'All' || config.category === templateCategory;
       const layoutMatch = templateLayout === 'All' || config.layout === templateLayout;
       return categoryMatch && layoutMatch;
    });
  }, [templateCategory, templateLayout]);

  const handleChange = (field: keyof ResumeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExperienceChange = (id: string, field: keyof Experience, value: string) => {
    setFormData(prev => ({
      ...prev, experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const handleEducationChange = (id: string, field: keyof Education, value: string) => {
    setFormData(prev => ({
      ...prev, education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const generateSummary = () => {
    setAiLoading({ type: 'summary' });
    setTimeout(() => {
      setSummaryOptions(mockSummaries(formData.role || 'Professional'));
      setAiLoading(null);
    }, 1200);
  };

  const enhanceDescription = (id: string, text: string) => {
    setAiLoading({ type: 'enhance', id });
    setTimeout(() => {
      handleExperienceChange(id, 'description', enhanceBullet(text));
      setAiLoading(null);
    }, 1000);
  };

  const runFullAudit = () => {
    setAiLoading({ type: 'audit' });
    setAuditResult(null);
    setTimeout(() => {
      setAuditResult(analyzeResume(formData));
      setAiLoading(null);
    }, 1500);
  };
  
  const currentTemplateDefaults = TEMPLATES[currentTemplate]?.defaultColors || DEFAULT_DESIGN_SETTINGS;

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="shrink-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3 flex-1">
           <Layout className="w-5 h-5 text-indigo-600" />
           <input 
             value={resumeTitle} onChange={(e) => setResumeTitle(e.target.value)} className="bg-transparent border-none text-slate-800 dark:text-white font-bold text-sm focus:ring-0 p-0 w-full truncate" placeholder="Untitled Resume"
           />
        </div>
        <button onClick={onOpenInterview} className="flex items-center gap-2 text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">
          <Bot className="w-4 h-4" /><span className="hidden sm:inline">Mock Interview</span>
        </button>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <button onClick={() => setActiveTab('content')} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'content' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}><FileText className="w-4 h-4" /> Content</button>
        <button onClick={() => setActiveTab('design')} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'design' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}><Palette className="w-4 h-4" /> Design</button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-32 space-y-8">
        {activeTab === 'content' && (
          <>
            <section className="bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 flex justify-between items-center border-b border-indigo-100 dark:border-indigo-900/50">
                <h2 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Resume Audit</h2>
                <button onClick={runFullAudit} disabled={aiLoading?.type === 'audit'} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 shadow-md">
                  {aiLoading?.type === 'audit' ? <Loader2 className="w-3 h-3 animate-spin" /> : "Run Full Check"}
                </button>
              </div>
              {auditResult ? (
                <div className="p-5 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-5 mb-6">
                      <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-gray-200 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path className={`${auditResult.score > 80 ? 'text-green-500' : auditResult.score > 50 ? 'text-amber-500' : 'text-red-500'}`} strokeDasharray={`${auditResult.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                          </svg>
                          <span className="absolute text-xl font-bold text-slate-900 dark:text-white">{auditResult.score}</span>
                      </div>
                      <div className="flex-1">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Resume Strength</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{auditResult.score > 80 ? "Excellent work! Your resume is optimized for ATS and recruiters." : "We found several opportunities to improve your impact and keywords."}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[{ key: 'impact', label: 'Impact & Metrics', icon: <TrendingUp className="w-3 h-3" /> }, { key: 'content', label: 'Content Quality', icon: <FileText className="w-3 h-3" /> }, { key: 'ats', label: 'ATS Compatibility', icon: <Bot className="w-3 h-3" /> }].map((cat) => {
                        const categoryRecs = auditResult.recommendations.filter(r => r.category === cat.key);
                        if (categoryRecs.length === 0) return null;
                        return (
                          <div key={cat.key} className="border-t dark:border-slate-700 pt-3">
                            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">{cat.icon} {cat.label}</h4>
                            <div className="space-y-2">
                              {categoryRecs.map(rec => (
                                <div key={rec.id} className={`p-3 rounded-lg text-xs flex flex-col gap-1 border ${rec.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-100' : rec.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-100' : 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100'}`}>
                                  <div className="flex items-start gap-2 font-semibold">
                                    {rec.type === 'warning' && <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />}
                                    {rec.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />}
                                    {rec.type === 'info' && <Bot className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />}
                                    <span>{rec.message}</span>
                                  </div>
                                  {rec.action && <div className="pl-6 text-opacity-80 italic mt-0.5 font-medium">💡 Tip: {rec.action}</div>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  {!aiLoading && <div className="space-y-2"><p className="text-sm font-medium text-slate-300">Unlock full resume insights</p><p className="text-xs max-w-[200px] mx-auto">Our AI scans for impact verbs, missing metrics, and ATS keyword matches.</p></div>}
                  {aiLoading?.type === 'audit' && <div className="flex flex-col items-center gap-3"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /><span className="text-xs text-indigo-400 font-medium animate-pulse">Analyzing structure & content...</span></div>}
                </div>
              )}
            </section>
            <section className="space-y-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><User className="w-4 h-4" /> Personal Details</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Input placeholder="Full Name" value={formData.fullName} onChange={e => handleChange('fullName', e.target.value)} /><Input placeholder="Target Role" value={formData.role} onChange={e => handleChange('role', e.target.value)} /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Input placeholder="Email" value={formData.email} onChange={e => handleChange('email', e.target.value)} /><Input placeholder="Phone" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Input placeholder="Location" value={formData.location} onChange={e => handleChange('location', e.target.value)} /><Input placeholder="Portfolio URL" value={formData.portfolio} onChange={e => handleChange('portfolio', e.target.value)} /></div>
              </div>
            </section>
            <section className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Sparkles className="w-4 h-4" /> Professional Summary</h2>
                <button onClick={generateSummary} disabled={aiLoading?.type === 'summary'} className="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 disabled:opacity-50">{aiLoading?.type === 'summary' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />} Auto-Write</button>
              </div>
              {summaryOptions && (<div className="space-y-2 animate-in fade-in slide-in-from-top-2"><p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Select a generated option:</p>{summaryOptions.map((opt, idx) => (<button key={idx} onClick={() => { handleChange('summary', opt); setSummaryOptions(null); }} className="w-full text-left text-xs p-3 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 rounded-lg border border-indigo-100 dark:border-indigo-800 transition-colors">{opt}</button>))}</div>)}
              <textarea rows={4} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 transition-all" placeholder="Brief professional bio..." value={formData.summary} onChange={e => handleChange('summary', e.target.value)} />
            </section>
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Briefcase className="w-4 h-4" /> Experience</h2>
                <button onClick={() => setFormData(prev => ({ ...prev, experience: [...prev.experience, { id: Date.now().toString(), role: '', company: '', date: '', description: '' }] }))} className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors font-medium flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
              </div>
              <div className="space-y-6">
                {formData.experience.map((exp) => (
                  <div key={exp.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative group transition-all hover:shadow-md">
                    <button onClick={() => setFormData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== exp.id) }))} className="absolute -top-2 -right-2 bg-white dark:bg-slate-700 text-slate-400 hover:text-red-500 p-1.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-600 opacity-0 group-hover:opacity-100 transition-all z-10"><Trash2 className="w-3 h-3" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3"><Input placeholder="Job Role" value={exp.role} onChange={e => handleExperienceChange(exp.id, 'role', e.target.value)} /><Input placeholder="Company" value={exp.company} onChange={e => handleExperienceChange(exp.id, 'company', e.target.value)} /><Input placeholder="Date Range" className="md:col-span-2" value={exp.date} onChange={e => handleExperienceChange(exp.id, 'date', e.target.value)} /></div>
                    <div className="relative">
                      <textarea rows={3} placeholder="Job Description (e.g. Led a team of 5...)" className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 pr-10 dark:text-slate-300" value={exp.description} onChange={e => handleExperienceChange(exp.id, 'description', e.target.value)} />
                      <button onClick={() => enhanceDescription(exp.id, exp.description)} disabled={!exp.description || (aiLoading?.type === 'enhance' && aiLoading.id === exp.id)} className="absolute bottom-3 right-3 text-indigo-400 hover:text-indigo-600 disabled:opacity-30 p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors" title="Enhance with AI">{aiLoading?.type === 'enhance' && aiLoading.id === exp.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Education</h2>
                <button onClick={() => setFormData(prev => ({ ...prev, education: [...prev.education, { id: Date.now().toString(), degree: '', school: '', year: '' }] }))} className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors font-medium flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
              </div>
              <div className="space-y-4">
                {formData.education.map((edu) => (
                  <div key={edu.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative group">
                    <button onClick={() => setFormData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== edu.id) }))} className="absolute -top-2 -right-2 bg-white dark:bg-slate-700 text-slate-400 hover:text-red-500 p-1.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-600 opacity-0 group-hover:opacity-100 transition-all z-10"><Trash2 className="w-3 h-3" /></button>
                    <div className="grid grid-cols-1 gap-3"><Input placeholder="Degree" value={edu.degree} onChange={e => handleEducationChange(edu.id, 'degree', e.target.value)} /><div className="flex gap-3"><Input placeholder="School" className="flex-1" value={edu.school} onChange={e => handleEducationChange(edu.id, 'school', e.target.value)} /><Input placeholder="Year" className="w-24" value={edu.year} onChange={e => handleEducationChange(edu.id, 'year', e.target.value)} /></div></div>
                  </div>
                ))}
              </div>
            </section>
            <section className="space-y-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Sparkles className="w-4 h-4" /> Skills</h2>
              <div className="flex gap-2">
                <Input placeholder="Add a skill (e.g. Python)..." value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && skillInput.trim()) { setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] })); setSkillInput(""); } }} />
                <button onClick={() => { if (skillInput.trim()) { setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] })); setSkillInput(""); } }} className="bg-slate-800 dark:bg-slate-700 text-white px-4 rounded-lg text-sm hover:bg-slate-900 dark:hover:bg-slate-600 font-medium">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, idx) => (<span key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">{skill}<button onClick={() => setFormData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }))} className="hover:text-red-500 ml-1"><X className="w-3 h-3" /></button></span>))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'design' && (
          <>
            <section className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
               <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                 <Type className="w-4 h-4" /> Typography
               </div>
               
               <div className="space-y-3">
                 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">Font Family</label>
                 <select 
                    value={designSettings.fontFamily} 
                    onChange={(e) => setDesignSettings({...designSettings, fontFamily: e.target.value})}
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                 >
                   {FONTS.map(font => (
                     <option key={font.name} value={font.family}>{font.label}</option>
                   ))}
                 </select>
               </div>
            </section>

            <section className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
               <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                 <Sliders className="w-4 h-4" /> Spacing & Size
               </div>

               <div className="space-y-5">
                 <SliderControl 
                   label="Name Size" 
                   value={designSettings.nameSize} 
                   min={20} max={60} step={1} 
                   onChange={(v) => setDesignSettings({...designSettings, nameSize: v})} 
                 />
                 <SliderControl 
                   label="Heading Size" 
                   value={designSettings.headingSize} 
                   min={10} max={30} step={1} 
                   onChange={(v) => setDesignSettings({...designSettings, headingSize: v})} 
                 />
                 <SliderControl 
                   label="Text Size" 
                   value={designSettings.textSize} 
                   min={8} max={16} step={0.5} 
                   onChange={(v) => setDesignSettings({...designSettings, textSize: v})} 
                 />
                 <SliderControl 
                   label="Letter Spacing" 
                   value={designSettings.letterSpacing} 
                   min={-0.1} max={0.5} step={0.01} 
                   unit="em"
                   onChange={(v) => setDesignSettings({...designSettings, letterSpacing: v})} 
                 />
                 <SliderControl 
                   label="Line Height" 
                   value={designSettings.lineHeight} 
                   min={1} max={2.5} step={0.1} 
                   unit=""
                   onChange={(v) => setDesignSettings({...designSettings, lineHeight: v})} 
                 />
               </div>
            </section>

            <section className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                   <PaintBucket className="w-4 h-4" /> Colors
                 </div>
                 <button 
                   onClick={() => setDesignSettings(prev => ({ ...prev, ...DEFAULT_DESIGN_SETTINGS, fontFamily: prev.fontFamily }))}
                   className="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                 >
                   <RotateCcw className="w-3 h-3" /> Reset All
                 </button>
               </div>

               <div>
                 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-3">Color Presets</label>
                 <div className="grid grid-cols-4 gap-2 mb-6">
                    <button
                      onClick={() => setDesignSettings({...designSettings, ...currentTemplateDefaults})}
                      className="flex flex-col gap-1.5 p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all group bg-slate-50 dark:bg-slate-900/50"
                      title="Restore Template Defaults"
                    >
                      <div className="w-full aspect-square rounded-md overflow-hidden grid grid-cols-2 shadow-sm">
                        <div style={{ background: currentTemplateDefaults.titleColor }}></div>
                        <div style={{ background: currentTemplateDefaults.accentColor }}></div>
                        <div style={{ background: currentTemplateDefaults.headingColor }}></div>
                        <div style={{ background: currentTemplateDefaults.textColor }}></div>
                      </div>
                      <span className="text-[10px] font-medium text-center truncate w-full text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Template Default</span>
                    </button>
                  {COLOR_PRESETS.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => setDesignSettings({...designSettings, ...preset.colors})}
                      className="flex flex-col gap-1.5 p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all group bg-slate-50 dark:bg-slate-900/50"
                      title={preset.name}
                    >
                      <div className="w-full aspect-square rounded-md overflow-hidden grid grid-cols-2 shadow-sm">
                        <div style={{ background: preset.colors.titleColor }}></div>
                        <div style={{ background: preset.colors.accentColor }}></div>
                        <div style={{ background: preset.colors.headingColor }}></div>
                        <div style={{ background: preset.colors.textColor }}></div>
                      </div>
                      <span className="text-[10px] font-medium text-center truncate w-full text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{preset.name}</span>
                    </button>
                  ))}
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <ColorControl 
                    label="Title" 
                    value={designSettings.titleColor} 
                    onChange={(v) => setDesignSettings({...designSettings, titleColor: v})} 
                  />
                  <ColorControl 
                    label="Headings" 
                    value={designSettings.headingColor} 
                    onChange={(v) => setDesignSettings({...designSettings, headingColor: v})} 
                  />
                  <ColorControl 
                    label="Text" 
                    value={designSettings.textColor} 
                    onChange={(v) => setDesignSettings({...designSettings, textColor: v})} 
                  />
                  <ColorControl 
                    label="Accent" 
                    value={designSettings.accentColor} 
                    onChange={(v) => setDesignSettings({...designSettings, accentColor: v})} 
                  />
               </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Palette className="w-4 h-4" /> Template Gallery</h2>
                <div className="text-xs text-slate-400 font-medium">{filteredTemplates.length} Designs</div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm mb-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Style</label>
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mask-linear-fade">
                    {['All', 'Iconic', 'Coder', 'Modern', 'Professional', 'Creative', 'Technical', 'Industry', 'Classic', 'Minimalist'].map(cat => (
                      <button key={cat} onClick={() => setTemplateCategory(cat)} className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-all border ${templateCategory === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{cat}</button>
                    ))}
                  </div>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Layout</label>
                    <div className="flex flex-wrap gap-2">
                      {[{ id: 'All', icon: <Grid className="w-3 h-3" />, label: 'All' }, { id: 'standard', icon: <LayoutTemplate className="w-3 h-3" />, label: 'Standard' }, { id: 'sidebar', icon: <PanelLeft className="w-3 h-3" />, label: 'Sidebar' }, { id: 'compact', icon: <Columns className="w-3 h-3" />, label: 'Compact' }].map((layout) => (
                        <button key={layout.id} onClick={() => setTemplateLayout(layout.id)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all ${templateLayout === layout.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{layout.icon}<span>{layout.label}</span></button>
                      ))}
                    </div>
                </div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pr-1">
                {filteredTemplates.map(([key, tmpl]) => (
                  <button key={key} onClick={() => setTemplate(key)} className={`group relative rounded-xl border-2 transition-all text-left overflow-hidden h-[320px] flex flex-col shadow-sm hover:shadow-xl ${currentTemplate === key ? 'border-indigo-600 ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-slate-900 scale-[1.02]' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:scale-[1.01]'}`}>
                    <div className={`flex-1 w-full !p-6 overflow-hidden ${tmpl.container.replace('min-h-[297mm]', '').replace('shadow-2xl', '').replace(/p-\d+/, '').replace(/border-[lrtb]-\[\d+px\]/g, '')} text-[9px] relative select-none pointer-events-none`}>
                        <div className={`${tmpl.headerWrapper || ''} mb-2 pb-2 scale-90 origin-top-left w-[110%]`}>
                          <div className={`${tmpl.name} text-xl mb-1`}>{formData.fullName || "Alex Johnson"}</div>
                          <div className={tmpl.role}>{formData.role || "Product Designer"}</div>
                        </div>
                        <div className="scale-90 origin-top-left w-[110%]">
                          <div className={`${tmpl.sectionHeader} mb-2`}>Experience</div>
                          <div className={tmpl.text}><div className="h-2 w-full bg-current opacity-10 rounded mb-1.5"></div><div className="h-2 w-3/4 bg-current opacity-10 rounded mb-1.5"></div><div className="h-2 w-1/2 bg-current opacity-10 rounded mb-3"></div><div className="h-2 w-full bg-current opacity-10 rounded mb-1.5"></div><div className="h-2 w-5/6 bg-current opacity-10 rounded"></div></div>
                        </div>
                        <div className="absolute top-3 right-3 bg-black/5 dark:bg-white/10 p-1.5 rounded backdrop-blur-sm">
                          {tmpl.layout === 'sidebar' && <PanelLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
                          {tmpl.layout === 'standard' && <LayoutTemplate className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
                          {tmpl.layout === 'compact' && <Columns className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 border-t border-slate-100 dark:border-slate-700 z-10 flex justify-between items-center">
                      <div><div className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{tmpl.label}</div><div className="text-[10px] text-slate-500 font-medium">{tmpl.category}</div></div>
                      {currentTemplate === key && (<div className="bg-indigo-600 text-white rounded-full p-1 shadow-sm animate-in zoom-in"><CheckCircle className="w-4 h-4" /></div>)}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

// 4. PREVIEW
const Preview = ({ data, templateKey, designSettings }: { data: ResumeFormData, templateKey: TemplateKey, designSettings: DesignSettings }) => {
  const rawStyles = TEMPLATES[templateKey];
  const styles = useMemo(() => applyTheme(rawStyles, designSettings), [rawStyles, designSettings]);
  
  const globalStyle = {
    fontFamily: designSettings.fontFamily,
    color: designSettings.textColor,
    lineHeight: designSettings.lineHeight,
    fontSize: `${designSettings.textSize}px`
  };

  const nameStyle = {
    fontSize: `${designSettings.nameSize}px`,
    color: designSettings.titleColor,
    letterSpacing: `${designSettings.letterSpacing}em`
  };

  const headingStyle = {
    fontSize: `${designSettings.headingSize}px`,
    color: designSettings.headingColor,
    letterSpacing: `${designSettings.letterSpacing}em`
  };
  
  const accentStyle = {
    color: designSettings.accentColor,
    borderColor: designSettings.accentColor
  };

  const ContactInfo = ({ className }: { className?: string }) => (
    <div className={className} style={{ color: designSettings.textColor, opacity: 0.8 }}>
      {data.email && <div className="flex items-center gap-2 whitespace-nowrap"><Mail className="w-3 h-3" /> {data.email}</div>}
      {data.phone && <div className="flex items-center gap-2 whitespace-nowrap"><Phone className="w-3 h-3" /> {data.phone}</div>}
      {data.location && <div className="flex items-center gap-2 whitespace-nowrap"><MapPin className="w-3 h-3" /> {data.location}</div>}
      {data.portfolio && <div className="flex items-center gap-2 whitespace-nowrap"><Globe className="w-3 h-3" /> {data.portfolio}</div>}
    </div>
  );

  if (styles.layout === 'sidebar') {
    return (
      <div id="resume-preview" className={`${styles.container} w-[210mm] min-h-[297mm] mx-auto shadow-2xl print:shadow-none print:w-full print:h-full`} style={globalStyle}>
        <div className={styles.sidebarStyle}>
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-wider uppercase break-words" style={{...nameStyle, color: 'inherit'}}>{data.fullName}</h1>
            <p className="mt-1 text-lg" style={{opacity: 0.8}}>{data.role}</p>
          </div>
          <div>
            <h3 className={styles.sectionHeaderSide} style={{...headingStyle, color: 'inherit', fontSize: `${designSettings.headingSize * 0.9}px`}}>Contact</h3>
            <ContactInfo className="flex flex-col gap-3 text-sm opacity-80 mb-6" />
          </div>
          {data.education.length > 0 && (
            <div>
              <h3 className={styles.sectionHeaderSide} style={{...headingStyle, color: 'inherit', fontSize: `${designSettings.headingSize * 0.9}px`}}>Education</h3>
              {data.education.map(edu => (
                <div key={edu.id} className="mb-4">
                  <div className="font-bold">{edu.degree}</div>
                  <div className="text-xs opacity-80">{edu.school}</div>
                  <div className="text-xs opacity-60">{edu.year}</div>
                </div>
              ))}
            </div>
          )}
          {data.skills.length > 0 && (
            <div>
              <h3 className={styles.sectionHeaderSide} style={{...headingStyle, color: 'inherit', fontSize: `${designSettings.headingSize * 0.9}px`}}>Skills</h3>
              <div className="flex flex-wrap">
                  {data.skills.map((skill, idx) => (<span key={idx} className={styles.skillBadge} style={{borderColor: 'currentColor'}}>{skill}</span>))}
              </div>
            </div>
          )}
        </div>
        <div className={styles.mainStyle}>
           {data.summary && (
            <div className="mb-8">
              <h3 className={styles.sectionHeaderMain} style={headingStyle}>Profile</h3>
              <p className={styles.text} style={globalStyle}>{data.summary}</p>
            </div>
           )}
           <div>
             <h3 className={styles.sectionHeaderMain} style={headingStyle}>Experience</h3>
             <div className="space-y-6">
               {data.experience.map(exp => (
                 <div key={exp.id}>
                   <div className="flex justify-between items-baseline mb-1">
                     <h4 className={styles.itemTitle} style={{fontSize: `${designSettings.textSize * 1.2}px`}}>{exp.role}</h4>
                     <span className={styles.itemDate} style={{fontSize: `${designSettings.textSize * 0.9}px`}}>{exp.date}</span>
                   </div>
                   <div className={styles.itemSubtitle} style={accentStyle}>{exp.company}</div>
                   <p className={`${styles.text} mt-2`} style={globalStyle}>{exp.description}</p>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div id="resume-preview" className={`${styles.container} w-[210mm] min-h-[297mm] mx-auto p-12 shadow-2xl print:shadow-none print:p-0 print:w-full`} style={globalStyle}>
      <div className={styles.headerWrapper || ''}>
        <div className={templateKey === 'executive' ? 'w-full' : ''}>
          <div className={templateKey === 'executive' ? 'flex justify-between items-end w-full' : ''}>
            <div>
              <h1 className={styles.name} style={nameStyle}>{data.fullName}</h1>
              <p className={styles.role} style={{...accentStyle, fontSize: `${designSettings.textSize * 1.4}px`}}>{data.role}</p>
            </div>
            {(templateKey === 'executive') && (<div className="text-right"><ContactInfo className="flex flex-col gap-1 text-sm" /></div>)}
          </div>
        </div>
        {templateKey !== 'executive' && (
          <ContactInfo className={`flex flex-wrap gap-4 mt-4 text-sm opacity-80 ${templateKey.includes('wallStreet') || templateKey.includes('minimalist') || templateKey.includes('paper') ? 'justify-center' : ''}`} />
        )}
      </div>
      {data.summary && (
        <div className="mb-6">
          <h3 className={styles.sectionHeader} style={headingStyle}>Professional Summary</h3>
          <p className={styles.text} style={globalStyle}>{data.summary}</p>
        </div>
      )}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h3 className={styles.sectionHeader} style={headingStyle}>Core Competencies</h3>
          <div className={templateKey.includes('minimalist') || templateKey.includes('paper') ? 'text-center' : 'flex flex-wrap'}>
            {data.skills.map((skill, idx) => (<span key={idx} className={styles.skillBadge} style={{...accentStyle, borderColor: designSettings.accentColor}}>{skill}</span>))}
          </div>
        </div>
      )}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h3 className={styles.sectionHeader} style={headingStyle}>Professional Experience</h3>
          <div className="space-y-5">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <div className={`flex justify-between items-baseline ${templateKey === 'brutalist' ? 'flex-col items-start gap-1' : ''}`}>
                  <div>
                    <span className={styles.itemTitle} style={{fontSize: `${designSettings.textSize * 1.2}px`}}>{exp.role}</span>
                    <span className={`mx-2 opacity-50 hidden sm:inline ${templateKey.includes('minimalist') ? 'text-xs' : ''}`}>|</span>
                    <span className={styles.itemSubtitle} style={accentStyle}>{exp.company}</span>
                  </div>
                  <span className={styles.itemDate} style={{fontSize: `${designSettings.textSize * 0.9}px`}}>{exp.date}</span>
                </div>
                <p className={`${styles.text} mt-1`} style={globalStyle}>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.education.length > 0 && (
        <div>
          <h3 className={styles.sectionHeader} style={headingStyle}>Education</h3>
          <div className="space-y-3">
            {data.education.map(edu => (
              <div key={edu.id} className="flex justify-between">
                 <div>
                    <div className={styles.itemTitle} style={{fontSize: `${designSettings.textSize * 1.1}px`}}>{edu.degree}</div>
                    <div className={styles.itemSubtitle}>{edu.school}</div>
                 </div>
                 <div className={styles.itemDate}>{edu.year}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 5. MAIN APP
const App = () => {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'home' | 'app'>('home');
  const [formData, setFormData] = useState<ResumeFormData>(INITIAL_STATE);
  const [activeTemplate, setActiveTemplate] = useState<TemplateKey>('modernExecutive');
  const [resumeTitle, setResumeTitle] = useState("My Professional Resume");
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const [designSettings, setDesignSettings] = useState<DesignSettings>(DEFAULT_DESIGN_SETTINGS);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = resumeTitle;
    window.print();
    document.title = originalTitle;
  };

  const handleStart = (withData: boolean) => {
    setFormData(withData ? INITIAL_STATE : EMPTY_STATE);
    setResumeTitle(withData ? "My Professional Resume" : "Untitled Resume");
    setView('app');
  };
  
  const handleTemplateChange = (key: TemplateKey) => {
    setActiveTemplate(key);
    if (TEMPLATES[key]?.defaultColors) {
      setDesignSettings(prev => ({
        ...prev,
        ...TEMPLATES[key].defaultColors
      }));
    }
  };

  if (loading) {
    return <InitialLoader />;
  }

  if (view === 'home') {
    return (<LandingPage onStart={handleStart} />);
  }

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden font-sans text-slate-900 dark:text-white transition-colors duration-300 dark`}>
      <div className="h-14 bg-slate-900 dark:bg-black text-white flex items-center justify-between px-4 md:px-6 shadow-lg shrink-0 print:hidden z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-indigo-500 p-1.5 rounded text-white"><Briefcase className="w-5 h-5" /></div>
          <span className="font-bold text-lg tracking-tight hidden sm:inline">Resume<span className="text-indigo-400">Architect</span></span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
           <div className="hidden md:flex items-center text-sm text-slate-400 gap-2"><span>Status: </span><span className="text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> Ready</span></div>
           <div className="h-6 w-px bg-slate-700 hidden md:block"></div>
           <button onClick={handlePrint} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:-translate-y-0.5" title="Print or Save as PDF"><Printer className="w-4 h-4" /><span className="hidden sm:inline">Export PDF</span></button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden relative bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
        <div className="w-full md:w-[40%] lg:w-[35%] h-full print:hidden z-20 shadow-xl border-r dark:border-slate-800">
          <Editor 
            formData={formData} setFormData={setFormData} currentTemplate={activeTemplate} setTemplate={handleTemplateChange} onOpenInterview={() => setIsInterviewOpen(true)} resumeTitle={resumeTitle} setResumeTitle={setResumeTitle} designSettings={designSettings} setDesignSettings={setDesignSettings}
          />
        </div>
        <div className="hidden md:flex md:w-[60%] lg:w-[65%] h-full bg-slate-200 dark:bg-slate-950 overflow-y-auto justify-center items-start p-8 print:w-full print:p-0 print:overflow-visible print:block print:h-auto print:absolute print:top-0 print:left-0 print:bg-white">
          <div className="transform scale-[0.6] lg:scale-[0.8] xl:scale-[0.9] origin-top transition-transform duration-300 print:scale-100 print:transform-none">
             <Preview data={formData} templateKey={activeTemplate} designSettings={designSettings} />
          </div>
        </div>
        <div className="md:hidden absolute bottom-0 w-full bg-white dark:bg-slate-900 p-4 border-t dark:border-slate-800 flex justify-center print:hidden z-30">
           <p className="text-xs text-slate-500 dark:text-slate-400 text-center"><span className="font-bold text-indigo-500">Desktop recommended.</span> Switch to a larger screen to see the live preview.</p>
        </div>
      </div>
      <InterviewModal isOpen={isInterviewOpen} onClose={() => setIsInterviewOpen(false)} role={formData.role} />
    </div>
  );
};

export default App;