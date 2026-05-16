export interface ResearchReport {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  stats: { label: string; value: string; trend?: string }[];
  keyFindings: string[];
}

export const RESEARCH_REPORTS: Record<string, ResearchReport> = {
  'state-of-ai-portraiture-2026': {
    title: 'The State of AI Portraiture 2026: Authenticity over Perfection',
    slug: 'state-of-ai-portraiture-2026',
    date: 'May 12, 2026',
    excerpt: 'An analysis of 1.2 million AI generations reveals a massive shift in user preference toward "Realism" and away from stylized filters.',
    stats: [
      { label: 'Growth in Realism Preference', value: '312%', trend: '+14% MoM' },
      { label: 'Avg. Generation Speed', value: '18.4s', trend: '-2.1s improvement' },
      { label: 'LinkedIn Conversion Uplift', value: '42%', trend: 'High Confidence' }
    ],
    keyFindings: [
      'Users are 4x more likely to keep a generation that includes "natural skin texture" over smoothed skin.',
      'The "Old Money" aesthetic has overtaken "Cyberpunk" as the #1 most generated style for professional profiles.',
      'Professionals in the 25-34 age bracket are the primary adopters of Identity-Lock technology.'
    ]
  },
  'digital-identity-trust-report': {
    title: 'The Digital Identity Trust Report: How AI Impacts Perceived Authority',
    slug: 'digital-identity-trust-report',
    date: 'April 20, 2026',
    excerpt: 'An empirical study on how high-quality AI headshots impact recruitment rates and social trust scores.',
    stats: [
      { label: 'Trust Increase', value: '18%', trend: 'Statistically Significant' },
      { label: 'Profile Views Uplift', value: '55%', trend: '+8% vs 2025' }
    ],
    keyFindings: [
      'High-resolution portraits (4K) correlate with a 12% higher "Authority Score" in blind user testing.',
      'Recruiters spend 2.4s longer on profiles with consistent lighting and professional backgrounds.',
      'Identity-Lock technology reduced "Uncanny Valley" complaints by 88% compared to standard LoRA models.'
    ]
  }
};
