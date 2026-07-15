import React, { useState, useEffect } from "react";
import { Menu, X, Code, Terminal, Layers, HelpCircle, PhoneCall, Sparkles } from "lucide-react";

interface NavbarProps {
  activeSection: string;
}

export default function Navbar({ activeSection }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "hero", label: "Home", icon: <Terminal className="w-4 h-4" /> },
    { id: "about", label: "About & Bio", icon: <Layers className="w-4 h-4" /> },
    { id: "projects", label: "Projects Simulator", icon: <Code className="w-4 h-4" /> },
    { id: "skills", label: "Tech Stack", icon: <Sparkles className="w-4 h-4" /> },
    { id: "contact", label: "Get In Touch", icon: <PhoneCall className="w-4 h-4" /> },
  ];

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-slate-950/80 backdrop-blur-md border-slate-900 shadow-lg"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Branding */}
          <div 
            onClick={() => handleScrollTo("hero")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 group-hover:border-blue-500/50 group-hover:bg-blue-600/20 transition-all duration-300">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-lg tracking-tight group-hover:text-blue-400 transition-colors">
                Sam Lopez
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-emerald-400 ml-2 border border-emerald-500/20 bg-emerald-500/5 px-1.5 py-0.5 rounded">
                v2.0 // Portfolio
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono transition-all duration-300 cursor-pointer ${
                  activeSection === item.id
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 font-bold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-850 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-900 bg-slate-950/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-1 shadow-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleScrollTo(item.id)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-mono text-left transition ${
                activeSection === item.id
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
