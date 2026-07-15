import React, { useState } from "react";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  Globe, 
  BookOpen, 
  Layers, 
  Heart, 
  Award, 
  MessageSquare, 
  Check, 
  Copy 
} from "lucide-react";

export default function Sidebar() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("zelop301@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const skillsData = [
    { category: "Programming", skills: ["HTML5", "CSS3", "JavaScript", "SQL"] },
    { category: "Frontend", skills: ["React", "Tailwind CSS", "Vite"] },
    { category: "Backend", skills: ["Node.js", "Express.js", "REST APIs"] },
    { category: "Database", skills: ["PostgreSQL", "MySQL"] },
    { category: "Design", skills: ["Figma", "UI/UX", "Canva"] },
    { category: "Tools & AI", skills: ["Git", "GitHub", "Prompt Engineering", "AI Studio"] }
  ];

  return (
    <aside className="w-full lg:w-96 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col shrink-0 lg:h-screen lg:overflow-y-auto custom-scrollbar">
      {/* Hero Section of Sidebar */}
      <div className="p-8 pb-6 border-b border-slate-800 flex flex-col items-center text-center relative bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="relative group mb-4">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-slate-800 bg-slate-800 flex items-center justify-center">
            {/* Main Avatar Generated or Placeholder */}
            <img 
              src="/src/assets/images/sam_lopez_profile_1784109885244.jpg" 
              alt="Sam Lopez" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // If generated image fails or is not found, fallback to nice styled initials / silhouette
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"; // standard portrait
              }}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <h1 className="font-display text-2xl font-bold tracking-tight text-white mb-1">
          Sam Lopez
        </h1>
        <p className="text-emerald-400 font-mono text-sm font-medium tracking-wide">
          Aspiring Software Engineer
        </p>
        
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <span className="px-2 py-0.5 rounded text-xs bg-slate-800/80 border border-slate-700 text-slate-300 font-mono">
            3rd Year IT
          </span>
          <span className="px-2 py-0.5 rounded text-xs bg-slate-800/80 border border-slate-700 text-slate-300 font-mono">
            Full Stack Dev
          </span>
          <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
            AI Integrations
          </span>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="p-8 space-y-8 flex-1">
        {/* Contact info */}
        <div className="space-y-4">
          <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2">
            Contact
          </h2>
          <div className="space-y-3 font-sans text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>Botolan, Zambales, Philippines</span>
            </div>
            
            <div className="flex items-center justify-between gap-2 group">
              <div className="flex items-center gap-3 min-w-0">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="truncate">zelop301@gmail.com</span>
              </div>
              <button 
                onClick={handleCopyEmail}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition shrink-0"
                title="Copy email to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-purple-400 shrink-0" />
              <span>+63 9648294296</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <a 
              href="https://github.com/zelop301" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
            <a 
              href="https://linkedin.com/in/samlopez" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition"
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </a>
            <a 
              href="https://samlopez.dev" 
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition"
            >
              <Globe className="w-3.5 h-3.5" />
              Portfolio
            </a>
          </div>
        </div>

        {/* Education Card */}
        <div className="space-y-4">
          <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2">
            Education
          </h2>
          <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800/80 space-y-2">
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs font-mono text-emerald-400 font-medium">Expected 2028</span>
              <BookOpen className="w-4 h-4 text-slate-500" />
            </div>
            <h3 className="text-sm font-semibold text-white leading-snug">
              B.S. in Information Technology
            </h3>
            <p className="text-xs text-slate-400">
              Incoming 3rd Year Student
            </p>
            <div className="pt-2 flex flex-wrap gap-1">
              {["Web Dev", "DBMS", "OOP", "HCI", "Software Eng"].map((topic, i) => (
                <span key={i} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Skills Groups */}
        <div className="space-y-4">
          <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2">
            Technical Skills
          </h2>
          <div className="space-y-4">
            {skillsData.map((group, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="text-xs font-medium text-slate-400 font-mono">{group.category}</span>
                <div className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx} 
                      className="text-xs font-medium bg-slate-950/50 text-slate-200 border border-slate-850 px-2 py-0.5 rounded shadow-sm hover:border-slate-700 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Soft Skills & Languages */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 block border-b border-slate-800 pb-1.5">
              Soft Skills
            </span>
            <ul className="text-xs text-slate-300 space-y-1 font-sans">
              <li>• Problem Solving</li>
              <li>• Communication</li>
              <li>• Teamwork</li>
              <li>• Critical Thinking</li>
              <li>• Leadership</li>
            </ul>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 block border-b border-slate-800 pb-1.5">
              Languages
            </span>
            <ul className="text-xs text-slate-300 space-y-1 font-mono">
              <li>• English</li>
              <li>• Filipino</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Brand & Purpose Statement */}
      <div className="p-8 bg-slate-950 border-t border-slate-850 text-center space-y-2">
        <Heart className="w-5 h-5 text-red-500 mx-auto animate-pulse" />
        <p className="text-xs text-slate-400 italic font-display tracking-wide uppercase">
          "Lead with compassion. Code with purpose."
        </p>
        <p className="text-[11px] text-slate-500 font-sans">
          © {new Date().getFullYear()} Sam Lopez. Built with AI Studio.
        </p>
      </div>
    </aside>
  );
}
