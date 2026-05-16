import { Metadata } from 'next';
import Link from 'next/link';
import { BarChart3, Clock, ArrowRight, Download, FileText, Globe, Database } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { RESEARCH_REPORTS } from '@/data/research';

export const metadata: Metadata = {
  title: 'AI Portrait Research Hub | Industry Data & Reports | PicFOMO',
  description: 'Explore the latest data and insights on digital identity, facial preservation, and AI portrait trends from the PicFOMO Lab.',
  alternates: {
    canonical: 'https://www.picfomo.com/research',
  },
};

export default function ResearchHubPage() {
  return (
    <main className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-page-text)]">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-[var(--color-gold)] opacity-[0.03] blur-[150px] -mt-40 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[3px]">
            <Database size={12} className="text-[var(--color-gold)]" /> PicFOMO DATA LAB
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9] display-font">
            The Science of <br/><span className="text-[var(--color-gold)]">Visual Identity</span>.
          </h1>
          <p className="text-xl text-[var(--color-ink2)] font-light max-w-2xl leading-relaxed">
            We analyze millions of generations to understand the shift in human perception, 
            perceived authority, and the future of digital authenticity.
          </p>
        </div>
      </section>

      {/* Reports Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {Object.values(RESEARCH_REPORTS).map((report) => (
            <div 
              key={report.slug} 
              className="bg-white rounded-[2.5rem] border border-[var(--rule)] shadow-xl overflow-hidden flex flex-col group hover:border-[var(--color-gold)] transition-all duration-500"
            >
              <div className="p-10 flex-1">
                <div className="flex items-center gap-4 mb-6">
                   <div className="flex items-center gap-2 text-[var(--color-ink3)] font-mono text-[10px] uppercase tracking-widest">
                      <Clock size={14} /> {report.date}
                   </div>
                   <div className="h-1 w-1 rounded-full bg-[var(--rule)]" />
                   <div className="text-[var(--color-gold)] font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-1">
                      <FileText size={12} /> Full Report
                   </div>
                </div>

                <h2 className="text-3xl font-bold mb-6 display-font leading-tight group-hover:text-[var(--color-gold)] transition-colors">
                  {report.title}
                </h2>
                <p className="text-[var(--color-ink2)] mb-10 leading-relaxed font-light">
                  {report.excerpt}
                </p>

                <div className="grid grid-cols-3 gap-6 mb-10">
                  {report.stats.map((stat, i) => (
                    <div key={i}>
                       <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-ink3)] mb-1">{stat.label}</p>
                       <p className="text-2xl font-bold display-font text-black">{stat.value}</p>
                       {stat.trend && <p className="text-[9px] font-bold text-green-600 mt-1">{stat.trend}</p>}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[3px] text-[var(--color-gold)]">Key Findings</p>
                  <ul className="space-y-3">
                    {report.keyFindings.map((finding, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-ink2)]">
                         <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)] mt-1.5 shrink-0" />
                         {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-10 bg-[var(--color-cream)] border-t border-[var(--rule)] flex items-center justify-between">
                 <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:text-[var(--color-gold)] transition-colors">
                    <Download size={16} /> Download CSV Data
                 </button>
                 <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center text-white group-hover:bg-[var(--color-gold)] transition-all">
                    <ArrowRight size={20} />
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* Citations Box */}
        <div className="mt-20 p-10 bg-zinc-950 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-10">
           <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-4 display-font">Press & Academic Inquiry</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                 Our data is available for use in journalistic and academic publications with proper citation. 
                 For high-resolution charts or raw data sets, please contact our research team.
              </p>
           </div>
           <div className="flex gap-4">
              <div className="flex items-center gap-2 px-6 py-3 border border-white/10 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest">
                 <Globe size={14} /> Open Data
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-[var(--color-gold)] text-black rounded-full text-[10px] font-bold font-mono uppercase tracking-widest">
                 <BarChart3 size={14} /> Methodology
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
