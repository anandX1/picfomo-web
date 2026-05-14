export interface Comparison {
  competitor: string;
  title: string;
  subtitle: string;
  features: {
    name: string;
    picfomo: string;
    competitor: string;
    win: 'picfomo' | 'competitor' | 'tie';
  }[];
}

export const COMPARISONS: Record<string, Comparison> = {
  'picfomo-vs-aragon-ai': {
    competitor: 'Aragon AI',
    title: 'PicFOMO vs Aragon AI',
    subtitle: 'Why PicFOMO is the faster, more flexible choice for professional portraits.',
    features: [
      { name: 'Generation Speed', picfomo: '20 Seconds', competitor: '30-60 Minutes', win: 'picfomo' },
      { name: 'Identity Match', picfomo: 'Identity-Lock™ (99%)', competitor: 'Standard Lora (85%)', win: 'picfomo' },
      { name: 'Creative Freedom', picfomo: 'Infinite Styles', competitor: 'Corporate Only', win: 'picfomo' },
      { name: 'Pricing', picfomo: 'Free to Try', competitor: '$35+ Entry Fee', win: 'picfomo' },
      { name: 'Ease of Use', picfomo: '1 Selfie, 0 Prompts', competitor: '12+ Photos Required', win: 'picfomo' },
    ]
  },
  'picfomo-vs-photo-ai': {
    competitor: 'Photo AI',
    title: 'PicFOMO vs Photo AI',
    subtitle: 'Luxury aesthetics vs complex technical prompts.',
    features: [
      { name: 'User Experience', picfomo: 'Zero-Prompt Magic', competitor: 'Complex Prompting', win: 'picfomo' },
      { name: 'Speed', picfomo: '20 Seconds', competitor: '2-5 Minutes', win: 'picfomo' },
      { name: 'Facial Accuracy', picfomo: 'Locked Facial Map', competitor: 'Variable Consistency', win: 'picfomo' },
      { name: 'Luxury Aesthetics', picfomo: 'Curated Hub', competitor: 'User Generated', win: 'picfomo' },
      { name: 'Pricing', picfomo: 'Pay-per-style', competitor: '$29/mo Subscription', win: 'picfomo' },
    ]
  },
  'picfomo-vs-headshotpro': {
    competitor: 'HeadshotPro',
    title: 'PicFOMO vs HeadshotPro',
    subtitle: 'Instant results vs the 2-hour corporate wait.',
    features: [
      { name: 'Turnaround Time', picfomo: 'Instant (20s)', competitor: '2 Hours+', win: 'picfomo' },
      { name: 'Mobile Flow', picfomo: 'Optimized Mobile UI', competitor: 'Desktop Preferred', win: 'picfomo' },
      { name: 'Social Media Use', picfomo: 'Perfect for IG/X/LI', competitor: 'LinkedIn Only', win: 'picfomo' },
      { name: 'Cost', picfomo: 'Starts at $0', competitor: '$29 Fixed Package', win: 'picfomo' },
    ]
  },
  'picfomo-vs-secta-ai': {
    competitor: 'Secta AI',
    title: 'PicFOMO vs Secta AI',
    subtitle: 'Fast identity locking vs high-volume waiting.',
    features: [
      { name: 'Focus', picfomo: 'Quality & Speed', competitor: 'Massive Volume', win: 'picfomo' },
      { name: 'Waiting Time', picfomo: 'None', competitor: 'Up to 1 Hour', win: 'picfomo' },
      { name: 'Cost per Shot', picfomo: 'Ultra-low', competitor: '$49 Entry Fee', win: 'picfomo' },
      { name: 'Facial Integrity', picfomo: 'High Accuracy', competitor: 'Varies by Batch', win: 'picfomo' },
    ]
  },
  'picfomo-vs-betterpic': {
    competitor: 'BetterPic',
    title: 'PicFOMO vs BetterPic',
    subtitle: 'Modern AI speed vs traditional rendering times.',
    features: [
      { name: '4K Resolution', picfomo: 'Standard', competitor: 'Standard', win: 'tie' },
      { name: 'Generation Speed', picfomo: '20 Seconds', competitor: '1-2 Hours', win: 'picfomo' },
      { name: 'Human Review', picfomo: 'AI Native (Perfect)', competitor: 'Optional (Slows down)', win: 'picfomo' },
      { name: 'Price', picfomo: 'Free Tier Available', competitor: '$35/month', win: 'picfomo' },
    ]
  },
  'picfomo-vs-tryiton-ai': {
    competitor: 'Try It On AI',
    title: 'PicFOMO vs Try It On AI',
    subtitle: 'Professional depth vs budget aesthetics.',
    features: [
      { name: 'Realism', picfomo: 'Cinematic Depth', competitor: 'Flat/Waxy Look', win: 'picfomo' },
      { name: 'Speed', picfomo: '20 Seconds', competitor: '90-120 Minutes', win: 'picfomo' },
      { name: 'Identity-Lock™', picfomo: 'Yes', competitor: 'Basic Finetuning', win: 'picfomo' },
      { name: 'Entry Price', picfomo: '$0', competitor: '$21', win: 'picfomo' },
    ]
  },
  'picfomo-vs-studioshot': {
    competitor: 'StudioShot',
    title: 'PicFOMO vs StudioShot',
    subtitle: 'Fully automated magic vs hybrid manual workflows.',
    features: [
      { name: 'Automation', picfomo: '100% Instant', competitor: 'Human Directed', win: 'picfomo' },
      { name: 'Turnaround', picfomo: '20 Seconds', competitor: '1-3 Hours', win: 'picfomo' },
      { name: 'Scale', picfomo: 'Infinite Styles', competitor: 'Limited Themes', win: 'picfomo' },
      { name: 'Price', picfomo: 'Pay-as-you-go', competitor: '$29.25+', win: 'picfomo' },
    ]
  },
  'picfomo-vs-prophotos-ai': {
    competitor: 'ProPhotos.ai',
    title: 'PicFOMO vs ProPhotos.ai',
    subtitle: 'Modern identity locking vs legacy finetuning.',
    features: [
      { name: 'Processing Time', picfomo: '20 Seconds', competitor: '28-45 Minutes', win: 'picfomo' },
      { name: 'Identity Mapping', picfomo: 'Vector-based', competitor: 'Pixel-based', win: 'picfomo' },
      { name: 'Style Variety', picfomo: 'Cinematic/Vogue/Film', competitor: 'Business Only', win: 'picfomo' },
      { name: 'Cost', picfomo: 'Starts at $0', competitor: '$25+', win: 'picfomo' },
    ]
  },
  'picfomo-vs-dreamwave-ai': {
    competitor: 'Dreamwave AI',
    title: 'PicFOMO vs Dreamwave AI',
    subtitle: 'Luxury cinematic vibe vs artistic portraits.',
    features: [
      { name: 'Vibe', picfomo: 'Luxury/Cinematic', competitor: 'Artistic/Inclusive', win: 'tie' },
      { name: 'Speed', picfomo: '20 Seconds', competitor: '30-90 Minutes', win: 'picfomo' },
      { name: 'Consistency', picfomo: 'Facial-Locked', competitor: 'Variable Likeness', win: 'picfomo' },
      { name: 'Price Point', picfomo: 'Hyper-accessible', competitor: '$35+', win: 'picfomo' },
    ]
  },
  'picfomo-vs-headshotsbyai': {
    competitor: 'HeadshotsByAI',
    title: 'PicFOMO vs HeadshotsByAI',
    subtitle: 'The battle of the fastest generators.',
    features: [
      { name: 'Speed', picfomo: '20 Seconds', competitor: '10 Minutes', win: 'picfomo' },
      { name: 'Quality', picfomo: '4K Cinematic', competitor: 'Standard HD', win: 'picfomo' },
      { name: 'Variety', picfomo: 'Infinite Styles', competitor: '100+ Static', win: 'picfomo' },
      { name: 'Trial', picfomo: 'Free Generation', competitor: 'Paid Only ($29)', win: 'picfomo' },
    ]
  }
};
