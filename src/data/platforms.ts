export interface Platform {
  title: string;
  subtitle: string;
  styles: string[];
  description: string;
}

export const PLATFORMS: Record<string, Platform> = {
  'linkedin': {
    title: 'AI LinkedIn Profile Pictures',
    subtitle: 'Upgrade your professional network identity in seconds.',
    styles: ['corporate', 'studio', 'modern'],
    description: 'Stop using cropped wedding photos or vacation selfies for your professional network. PicFOMO creates polished, authoritative LinkedIn headshots that help you land more interviews and close more deals.'
  },
  'tinder': {
    title: 'AI Photos for Tinder',
    subtitle: 'Get 10x more matches with high-quality lifestyle portraits.',
    styles: ['lifestyle', 'vogue', 'cinematic'],
    description: 'Your dating profile is your digital first impression. PicFOMO generates natural, high-quality photos that showcase your personality without looking like generic AI. Perfect for Tinder, Bumble, and Hinge.'
  },
  'instagram': {
    title: 'AI Portraits for Instagram',
    subtitle: 'Viral-ready aesthetics for your personal brand.',
    styles: ['vibrant', 'vogue', 'cinematic', 'lifestyle'],
    description: 'Stop struggling with lighting and composition. PicFOMO creates stunning, professional-grade portraits that are optimized for Instagram engagement and viral reach.'
  },
  'twitter-x': {
    title: 'AI Avatars for X (Twitter)',
    subtitle: 'Stand out in the feed with hyper-stylized profile art.',
    styles: ['cyberpunk', 'modern', 'cinematic'],
    description: 'In a sea of anonymous accounts, a high-quality profile picture commands respect. PicFOMO generates sharp, visionary avatars that help you build authority in the tech and creator communities on X.'
  }
};
