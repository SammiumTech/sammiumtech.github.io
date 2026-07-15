import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, PhoneCall, Globe, Github, Linkedin } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "Collaboration Request",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = (data: FormState) => {
    const tempErrors: FormErrors = {};
    if (!data.name.trim()) {
      tempErrors.name = "Name is required";
    } else if (data.name.trim().length < 2) {
      tempErrors.name = "Name must be at least 2 characters";
    }

    if (!data.email.trim()) {
      tempErrors.email = "Email address is required";
    } else if (!validateEmail(data.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    if (!data.subject.trim()) {
      tempErrors.subject = "Subject is required";
    }

    if (!data.message.trim()) {
      tempErrors.message = "Message content is required";
    } else if (data.message.trim().length < 10) {
      tempErrors.message = "Message must be at least 10 characters long to send";
    }

    return tempErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    // Dynamic field validation on type
    if (touched[name]) {
      const fieldErrors = validateForm(updatedForm);
      setErrors((prev) => ({
        ...prev,
        [name]: (fieldErrors as any)[name],
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validateForm(form);
    setErrors((prev) => ({
      ...prev,
      [name]: (fieldErrors as any)[name],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all as touched
    const allTouched = { name: true, email: true, subject: true, message: true };
    setTouched(allTouched);

    const formValidationErrors = validateForm(form);
    setErrors(formValidationErrors);

    if (Object.keys(formValidationErrors).length === 0) {
      setIsSubmitting(true);
      
      // Simulate real-world network propagation delay (1.5 seconds)
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        // Reset form
        setForm({
          name: "",
          email: "",
          subject: "Collaboration Request",
          message: "",
        });
        setTouched({});
      }, 1500);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-950 border-t border-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[10px] tracking-widest uppercase">
            <PhoneCall className="w-3.5 h-3.5" />
            COMMUNICATION PORTAL
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Get In Touch
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-sans leading-relaxed">
            Have an open software opportunity, project, or simply want to speak about AI integrations? Drop a message here!
          </p>
        </div>

        {/* Form and Contact Detail Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Column 1: Directory details & instructions (Span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="space-y-3 font-sans text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                <p>
                  Whether you're looking for a dedicated software engineering intern or a collaborator to build out a new dashboard simulation, my communications line is always monitored.
                </p>
                <p>
                  Fill out the secure form to dispatch a transmission directly. I usually review proposals and respond within 24 to 48 hours.
                </p>
              </div>

              {/* Direct Info List */}
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/20 border border-slate-900">
                  <div className="p-2.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 shrink-0">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] text-slate-500 font-mono block">Direct Mailbox</span>
                    <a href="mailto:zelop301@gmail.com" className="text-sm font-semibold text-white hover:text-blue-400 transition truncate block">
                      zelop301@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/20 border border-slate-900">
                  <div className="p-2.5 rounded-lg bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono block">Mobile Terminal</span>
                    <span className="text-sm font-semibold text-white font-mono">+63 964 829 4296</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/20 border border-slate-900">
                  <div className="p-2.5 rounded-lg bg-purple-600/10 text-purple-400 border border-purple-500/20 shrink-0">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono block">Base Operations</span>
                    <span className="text-sm font-semibold text-white font-sans">Botolan, Zambales, Philippines</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro Social Network links footer */}
            <div className="pt-6 border-t border-slate-900 space-y-3">
              <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block font-semibold font-bold">Other Digital Anchors</span>
              <div className="flex gap-2">
                <a 
                  href="https://github.com/zelop301" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 px-3.5 rounded bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub
                </a>
                <a 
                  href="https://linkedin.com/in/samlopez" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 px-3.5 rounded bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Form Workspace with validation states (Span 7) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/20 border border-slate-850 bg-gradient-to-b from-slate-900/40 to-slate-950 shadow-xl h-full flex flex-col justify-center">
              
              {submitSuccess ? (
                /* Success Presentation card */
                <div className="text-center py-8 space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">Transmission Successful</h3>
                  <p className="text-slate-300 text-xs font-sans max-w-sm mx-auto leading-relaxed">
                    Thank you! Your dispatch has been securely compiled and recorded. Sam Lopez will receive your request immediately.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-xs text-slate-300 rounded-lg cursor-pointer transition"
                    >
                      SEND ANOTHER DISPATCH
                    </button>
                  </div>
                </div>
              ) : (
                /* Main Form markup */
                <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                  
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-slate-400 font-semibold font-mono tracking-wide uppercase">
                      Sender Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. Jane Doe"
                      className={`w-full bg-slate-950 border rounded-xl p-3 text-white text-xs placeholder:text-slate-600 outline-none focus:ring-1 transition-all ${
                        touched.name && errors.name
                          ? "border-red-500/50 focus:ring-red-500/50"
                          : "border-slate-850 focus:border-blue-500/70 focus:ring-blue-500/30"
                      }`}
                    />
                    {touched.name && errors.name && (
                      <div className="flex items-center gap-1.5 text-[11px] text-red-400 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-slate-400 font-semibold font-mono tracking-wide uppercase">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. jane@domain.com"
                      className={`w-full bg-slate-950 border rounded-xl p-3 text-white text-xs placeholder:text-slate-600 outline-none focus:ring-1 transition-all ${
                        touched.email && errors.email
                          ? "border-red-500/50 focus:ring-red-500/50"
                          : "border-slate-850 focus:border-blue-500/70 focus:ring-blue-500/30"
                      }`}
                    />
                    {touched.email && errors.email && (
                      <div className="flex items-center gap-1.5 text-[11px] text-red-400 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Subject selector */}
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="block text-slate-400 font-semibold font-mono tracking-wide uppercase">
                      Subject Matter *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-white text-xs outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/30 cursor-pointer"
                    >
                      <option value="Collaboration Request">Collaboration Request</option>
                      <option value="Internship / Employment Opportunity">Internship / Job Opportunity</option>
                      <option value="Technical Consultation">Technical Consultation / Q&A</option>
                      <option value="Feedback / Greeting">General Message / Feedback</option>
                    </select>
                  </div>

                  {/* Message Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="message" className="block text-slate-400 font-semibold font-mono tracking-wide uppercase">
                        Message Dispatch *
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {form.message.length} chars (min 10)
                      </span>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Type your detailed proposal, project details, or questions..."
                      className={`w-full bg-slate-950 border rounded-xl p-3 text-white text-xs placeholder:text-slate-600 outline-none resize-none focus:ring-1 transition-all ${
                        touched.message && errors.message
                          ? "border-red-500/50 focus:ring-red-500/50"
                          : "border-slate-850 focus:border-blue-500/70 focus:ring-blue-500/30"
                      }`}
                    />
                    {touched.message && errors.message && (
                      <div className="flex items-center gap-1.5 text-[11px] text-red-400 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-mono text-xs font-bold tracking-wide transition duration-200 cursor-pointer shadow-lg shadow-blue-600/10 hover:shadow-blue-500/25"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin inline-block" />
                          TRANSMITTING PACKETS...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          DISPATCH MESSAGE
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
