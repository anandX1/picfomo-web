"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { GlossaryTerm } from "@/data/glossary";

export default function GlossaryClient({ initialTerms }: { initialTerms: Record<string, GlossaryTerm> }) {
  const [search, setSearch] = useState("");
  
  const termsList = useMemo(() => {
    return Object.values(initialTerms).sort((a, b) => a.term.localeCompare(b.term));
  }, [initialTerms]);

  const filteredTerms = useMemo(() => {
    if (!search) return termsList;
    const s = search.toLowerCase();
    return termsList.filter(t => 
      t.term.toLowerCase().includes(s) || 
      t.definition.toLowerCase().includes(s)
    );
  }, [termsList, search]);

  // Group by first letter
  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    filteredTerms.forEach(term => {
      const char = term.term[0].toUpperCase();
      if (!groups[char]) groups[char] = [];
      groups[char].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const letters = Object.keys(groupedTerms).sort();

  return (
    <div className="max-w-[1120px] mx-auto px-6 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[var(--color-gold)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="text-center mb-16 relative z-10">
        <div className="mb-6 inline-flex items-center gap-2 border border-[var(--color-gold-border)] bg-[var(--color-gold-pale)] px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[2px] text-[var(--color-gold)]">
          <BookOpen size={12} /> Technical Resource
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[0.9] display-font">
          AI <span className="text-[var(--color-gold)]">Glossary</span>
        </h1>
        <p className="text-[18px] text-[var(--color-ink2)] font-light max-w-2xl mx-auto leading-relaxed">
          Master the terminology of the generative revolution. Deep technical definitions for the tech that powers your best portraits.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-20 relative z-10">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-gold)] transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search terms (e.g. 'PuLID', 'SDXL')..."
            className="w-full bg-[var(--color-cream)] border-2 border-[var(--rule)] rounded-2xl py-4 pl-14 pr-6 text-lg focus:border-[var(--color-gold)] focus:outline-none transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Alphabet Navigation */}
      {!search && (
        <div className="flex flex-wrap justify-center gap-2 mb-16 relative z-10">
          {letters.map(letter => (
            <a 
              key={letter} 
              href={`#section-${letter}`}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[var(--rule)] text-sm font-bold hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all shadow-sm"
            >
              {letter}
            </a>
          ))}
        </div>
      )}

      {/* Glossary List */}
      <div className="space-y-20 relative z-10">
        {letters.length > 0 ? (
          letters.map(letter => (
            <div key={letter} id={`section-${letter}`} className="scroll-mt-32">
              <div className="flex items-center gap-6 mb-10">
                <span className="text-4xl font-black text-[var(--color-gold)] opacity-20">{letter}</span>
                <div className="h-[1px] flex-1 bg-[var(--rule)]" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {groupedTerms[letter].map(term => (
                  <Link 
                    key={term.slug} 
                    href={`/glossary/${term.slug}`}
                    className="group p-8 bg-white rounded-[2rem] border border-[var(--rule)] hover:border-[var(--color-gold)] transition-all hover:shadow-2xl flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold display-font group-hover:text-[var(--color-gold)] transition-colors">{term.term}</h3>
                      <ArrowRight className="text-gray-300 group-hover:text-[var(--color-gold)] transition-all transform group-hover:translate-x-1" size={18} />
                    </div>
                    <p className="text-sm text-[var(--color-ink2)] leading-relaxed line-clamp-3 mb-6">
                      {term.definition}
                    </p>
                    <div className="mt-auto pt-4 border-t border-[var(--rule2)] flex items-center gap-4">
                      {term.relatedTerms.slice(0, 2).map(rt => (
                        <span key={rt} className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                          #{rt.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
             <Sparkles size={48} className="mx-auto text-gray-200 mb-6" />
             <h3 className="text-2xl font-bold mb-2">No terms found</h3>
             <p className="text-gray-400">Try a different search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
