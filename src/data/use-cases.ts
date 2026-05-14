export interface UseCase {
  title: string;
  subtitle: string;
  styles: string[];
  description: string;
}

export const USE_CASES: Record<string, UseCase> = {
  // --- EXISTING USE CASES ---
  'real-estate-headshots': {
    title: 'AI Headshots for Real Estate',
    subtitle: 'Close more deals with professional property-ready portraits.',
    styles: ['dslr', 'corporate', 'studio'],
    description: 'First impressions are everything in real estate. Our AI generates high-end, trustworthy headshots that help you stand out on Zillow, LinkedIn, and business cards.'
  },
  'dating-profile-photos': {
    title: 'AI Photos for Dating Apps',
    subtitle: 'Get 10x more matches with high-quality lifestyle portraits.',
    styles: ['dslr', 'vogue', 'lifestyle', 'cinematic'],
    description: 'Stop using blurry selfies. PicFOMO creates natural, high-quality photos that look like they were taken by a professional photographer on a casual day out.'
  },
  'linkedin-profile-pictures': {
    title: 'Professional AI LinkedIn Photos',
    subtitle: 'Upgrade your professional identity in 20 seconds.',
    styles: ['corporate', 'studio', 'dslr'],
    description: 'Command respect and authority with a polished LinkedIn profile. Our AI ensures you look your best while maintaining 100% facial accuracy.'
  },
  'acting-headshots': {
    title: 'AI Headshots for Actors',
    subtitle: 'Stunning theatrical and commercial looks without the studio fee.',
    styles: ['cinematic', 'studio', 'dslr', 'drama'],
    description: 'Need a new look for your portfolio? Generate industry-standard acting headshots that capture your range and personality perfectly.'
  },

  // --- NEW USE CASES (CONTENT VELOCITY PHASE) ---
  'lawyer-headshots': {
    title: 'AI Headshots for Lawyers',
    subtitle: 'Project authority and trust with elite legal portraits.',
    styles: ['corporate', 'studio', 'classic'],
    description: 'Establish a powerful presence on your law firm’s website. Our AI creates sophisticated, high-resolution headshots that convey professionalism and expertise.'
  },
  'twitch-streamer-avatars': {
    title: 'AI Avatars for Twitch Streamers',
    subtitle: 'Level up your brand with hyper-stylized profile art.',
    styles: ['cyberpunk', 'vibrant', 'cinematic', 'anime'],
    description: 'Stand out in the sidebar with a profile picture that pops. PicFOMO generates stunning, high-energy avatars that reflect your gaming personality and brand.'
  },
  'doctor-medical-portraits': {
    title: 'AI Portraits for Doctors',
    subtitle: 'Approachable and professional medical headshots in seconds.',
    styles: ['studio', 'corporate', 'bright'],
    description: 'Build patient trust with high-quality medical portraits. Perfect for hospital directories, private practice websites, and professional healthcare networks.'
  },
  'speaker-coach-photos': {
    title: 'AI Photos for Speakers & Coaches',
    subtitle: 'Captivating personal brand portraits for leaders.',
    styles: ['lifestyle', 'vogue', 'cinematic', 'studio'],
    description: 'Your personal brand is your greatest asset. Generate high-end, inspiring photos that look amazing on landing pages, social media, and event posters.'
  },
  'model-portfolio-shots': {
    title: 'AI Model Portfolio Shots',
    subtitle: 'Expand your range with high-fashion digital editorials.',
    styles: ['vogue', 'editorial', 'glamour', 'cinematic'],
    description: 'Instantly add diverse looks to your modeling portfolio. Our AI maintains your unique features while placing you in high-fashion studio environments.'
  },
  'author-book-covers': {
    title: 'AI Portraits for Authors',
    subtitle: 'Classic, jacket-ready portraits for your next bestseller.',
    styles: ['classic', 'studio', 'moody', 'dslr'],
    description: 'Get the perfect author photo for your book jacket. Our AI creates timeless, intelligent, and professional portraits that resonate with your readers.'
  },
  'chef-culinary-portraits': {
    title: 'AI Portraits for Chefs',
    subtitle: 'Crisp, passionate headshots for the culinary world.',
    styles: ['lifestyle', 'cinematic', 'bright', 'dslr'],
    description: 'Showcase your passion for food with professional culinary portraits. Ideal for cookbooks, restaurant websites, and press releases.'
  },
  'tech-founder-headshots': {
    title: 'AI Headshots for Tech Founders',
    subtitle: 'Modern, visionary portraits for the startup ecosystem.',
    styles: ['modern', 'studio', 'lifestyle', 'corporate'],
    description: 'Command the boardroom and attract investors with a sharp, modern founder headshot. Optimized for Crunchbase, LinkedIn, and pitch decks.'
  },
  'fitness-influencer-photos': {
    title: 'AI Photos for Fitness Influencers',
    subtitle: 'High-energy, dynamic portraits that drive engagement.',
    styles: ['athletic', 'vibrant', 'cinematic', 'lifestyle'],
    description: 'Stop struggling with gym lighting. PicFOMO creates powerful, high-definition fitness portraits that look like they belong in a supplement ad.'
  },
  'musician-artist-portraits': {
    title: 'AI Portraits for Musicians & Artists',
    subtitle: 'Creative, moody, and expressive personal brand art.',
    styles: ['moody', 'cinematic', 'vibrant', 'vintage'],
    description: 'Express your creative soul with unique artist portraits. Perfect for Spotify profiles, album covers, and promotional material.'
  }
};
