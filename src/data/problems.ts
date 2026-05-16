export interface Problem {
  title: string;
  subtitle: string;
  styles: string[];
  description: string;
}

export const PROBLEMS: Record<string, Problem> = {
  'blurry-selfies': {
    title: 'Fix Blurry Selfies with AI',
    subtitle: 'Turn low-quality snaps into high-definition masterpieces.',
    styles: ['dslr', 'studio', 'cinematic'],
    description: 'Tired of blurry, pixelated photos? PicFOMO uses Identity-Lock™ technology to reconstruct your features into stunning 4K portraits, effectively "fixing" your best shots with professional-grade rendering.'
  },
  'bad-lighting-fix': {
    title: 'Fix Bad Lighting in Photos',
    subtitle: 'Golden hour aesthetics for every portrait, instantly.',
    styles: ['vibrant', 'cinematic', 'lifestyle'],
    description: 'Harsh shadows or dim lighting can ruin a great photo. PicFOMO re-lights your face using advanced AI, placing you in perfectly lit studio or outdoor environments while maintaining 100% facial accuracy.'
  },
  'awkward-posing-help': {
    title: 'Fix Awkward Poses with AI',
    subtitle: 'Professional posture and composition in every shot.',
    styles: ['corporate', 'studio', 'dslr'],
    description: 'Not everyone is a natural in front of the camera. PicFOMO solves the "awkward pose" problem by generating portraits where your posture and composition are handled by AI, ensuring you always look confident and relaxed.'
  }
};
