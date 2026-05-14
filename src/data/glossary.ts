export interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  deepDive: string;
  whyItMatters: string;
  howPicfomoUsesIt: string;
  relatedTerms: string[];
}

export const GLOSSARY_TERMS: Record<string, GlossaryTerm> = {
  'identity-lock': {
    term: 'Identity-Lock™',
    slug: 'identity-lock',
    definition: 'A proprietary facial preservation technology developed by PicFOMO that ensures 99.8% resemblance by mapping 120+ unique facial anchor points.',
    deepDive: 'Standard AI face-swapping often results in a "generic" look because it prioritizes blending over structural integrity. Identity-Lock™ uses a vector-based mapping system that treats your face as a rigid mathematical structure rather than a fluid texture. It analyzes the specific depth of your orbital bone, the bridge of your nose, and the exact distance between your philtrum and chin.',
    whyItMatters: 'Without Identity-Lock™, AI portraits often suffer from the "Uncanny Valley" effect—where the image looks like you, but something feels "off." For professional headshots, this difference is the gap between a profile picture that builds trust and one that feels like a fake avatar.',
    howPicfomoUsesIt: 'We apply Identity-Lock™ at the earliest stage of the inference process. Unlike "post-processing" fixes, our technology guides the AI during the initial generation to ensure that every pixel rendered is architecturally consistent with your real face.',
    relatedTerms: ['pulid', 'facial-mapping', 'consistency']
  },
  'pulid': {
    term: 'PuLID (Portrait Universal Light & Identity Decoder)',
    slug: 'pulid',
    definition: 'A cutting-edge neural architecture designed to decouple a person\'s identity from the lighting and environment of a photo.',
    deepDive: 'Developed as a successor to traditional IP-Adapter methods, PuLID allows for "zero-shot" identity preservation. It uses a specialized encoder that extracts identity features into a latent space that is invariant to lighting and pose. This means it can take your face from a dimly lit selfie and perfectly "decode" it into a bright, cinematic studio environment without losing the essence of who you are.',
    whyItMatters: 'Before PuLID, AI models often struggled with "identity leakage," where the background or lighting of the source photo would bleed into the final result. PuLID ensures that if you choose a "Cyberpunk" style, you get the Cyberpunk lighting while keeping 100% of your facial structure.',
    howPicfomoUsesIt: 'PicFOMO integrates PuLID within our FLUX-based generation pipeline. We have optimized the decoder to work in real-time, which is how we achieve our industry-leading 20-second generation speed while maintaining extreme detail.',
    relatedTerms: ['identity-lock', 'inference', 'latent-space']
  },
  'lora': {
    term: 'LoRA (Low-Rank Adaptation)',
    slug: 'lora',
    definition: 'A mathematical technique used to fine-tune large AI models efficiently by adding a small number of new weights without retraining the entire model.',
    deepDive: 'Think of a large AI model like a massive library. Retraining it (Fine-tuning) would mean rewriting every book. LoRA acts like a "supplementary index" at the front of the library. It allows the model to learn a very specific style—like "90s Film" or "Old Money Luxury"—by only updating about 1% of the total parameters. This makes the model extremely agile and specialized.',
    whyItMatters: 'LoRAs are what allow PicFOMO to offer such a diverse range of high-quality styles. Each style you see in our Hub is backed by a custom-trained LoRA that has been "taught" the specific lighting, color grading, and textures of that aesthetic.',
    howPicfomoUsesIt: 'Our engineers train custom LoRAs on curated datasets of high-end photography. When you pick a style, we instantly "plugin" that LoRA into our base model, giving you professional-grade aesthetics without the massive compute cost of full fine-tuning.',
    relatedTerms: ['checkpoint', 'fine-tuning', 'weights']
  },
  'sdxl': {
    term: 'SDXL (Stable Diffusion XL)',
    slug: 'sdxl',
    definition: 'The professional-grade standard for high-resolution AI image generation, capable of rendering native 1024x1024 portraits with extreme detail.',
    deepDive: 'SDXL represents a massive leap over earlier versions like SD 1.5. It utilizes a base model with 3.5 billion parameters and a separate "refiner" model to add micro-texture and skin details. It is designed to understand complex spatial relationships and can render realistic skin textures, hair strands, and fabric weaves that were previously impossible for AI.',
    whyItMatters: 'SDXL is the engine that prevents AI portraits from looking "waxy." It has a deep understanding of human anatomy and photorealism, which is essential for professional-grade results.',
    howPicfomoUsesIt: 'We use a heavily customized version of SDXL that has been optimized for portraiture. We have removed the "noise" that often plagues standard models, ensuring your final download is crisp, clear, and ready for high-resolution print.',
    relatedTerms: ['inference', 'checkpoint', 'upscaling']
  },
  'inference-steps': {
    term: 'Inference Steps',
    slug: 'inference-steps',
    definition: 'The number of iterations an AI model takes to refine a noisy image into a clear, high-definition portrait.',
    deepDive: 'AI generation starts with a screen of random static (Gaussian noise). Through a process called "Denoising," the model gradually removes noise to reveal the image. Each step is a calculation. More steps generally mean higher detail, but after a certain point (usually 30-40 steps), you hit diminishing returns. However, using specialized "LCM" (Latent Consistency Models) or "Turbo" tech, we can now achieve high quality in as few as 8 steps.',
    whyItMatters: 'The number of steps directly impacts the speed and quality. Too few, and the image is blurry; too many, and the generation takes minutes. Balancing these steps is the "secret sauce" of a fast AI service.',
    howPicfomoUsesIt: 'We utilize a dynamic step-scaling algorithm. For our "Instant" styles, we use high-speed 8-step inference. For our "Studio" and "Vogue" styles, we ramp up to 40 steps for maximum skin texture and detail.',
    relatedTerms: ['sdxl', 'latent-space', 'denoising']
  },
  'latent-space': {
    term: 'Latent Space',
    slug: 'latent-space',
    definition: 'A multi-dimensional mathematical "map" where the AI stores and organizes concepts like "eyes," "lighting," and "suits."',
    deepDive: 'Imagine a map where "Cat" is at one coordinate and "Suit" is at another. If you move halfway between them, you get a "Cat in a Suit." This "map" is the Latent Space. It is not an image; it is a compressed mathematical representation of everything the AI has ever learned. When we generate an image, we are essentially "traveling" to a specific coordinate in this space.',
    whyItMatters: 'Understanding latent space is how we control the AI. By using specific "prompts" or "embeddings," we can push the generation towards a precise location—for example, the coordinate where your face meets a high-end tuxedo.',
    howPicfomoUsesIt: 'PicFOMO uses "Latent Manipulation" to ensure your identity isn\'t lost during the generation process. We pin your facial vectors to a specific spot in latent space while letting the "Style" vectors change around them.',
    relatedTerms: ['pulid', 'embeddings', 'inference']
  },
  'checkpoint': {
    term: 'Checkpoint',
    slug: 'checkpoint',
    definition: 'A "snapshot" of a fully trained AI model that contains its entire "brain" at a specific point in time.',
    deepDive: 'A checkpoint is a large file (often 2GB to 6GB) that holds all the learned weights and biases of a model. There are different checkpoints for different purposes: some are trained for photorealism, others for anime, and some for architecture. A good checkpoint is the foundation of any high-quality AI output.',
    whyItMatters: 'The quality of your portrait is limited by the "intelligence" of the checkpoint. If the checkpoint doesn\'t understand what "soft studio lighting" looks like, no amount of prompt engineering will fix it.',
    howPicfomoUsesIt: 'We don\'t use public checkpoints. We use "PicFOMO V2," a custom-merged checkpoint that combines the best of photorealism and cinematic color grading, specifically tuned for diverse skin tones.',
    relatedTerms: ['weights', 'lora', 'fine-tuning']
  },
  'cfg-scale': {
    term: 'CFG Scale (Classifier Free Guidance)',
    slug: 'cfg-scale',
    definition: 'A parameter that tells the AI how strictly it should follow your prompt versus how much creative freedom it has.',
    deepDive: 'A low CFG (3-5) results in more creative, softer images but might ignore parts of your prompt. A high CFG (15-20) forces the AI to follow the prompt exactly, which can lead to over-saturated and "burnt" looking images. The sweet spot for professional portraits is typically between 7 and 11.',
    whyItMatters: 'CFG is the "Volume Knob" for AI creativity. If you want a portrait to look "natural," you keep the CFG moderate. If you want something hyper-stylized, you might push it higher.',
    howPicfomoUsesIt: 'We have hardcoded optimized CFG values for every style in our hub. You don\'t have to worry about sliders—we\'ve found the "Goldilocks Zone" for every aesthetic to ensure you always get a perfect result.',
    relatedTerms: ['inference', 'prompt-engineering', 'denoising']
  },
  'prompt-engineering': {
    term: 'Prompt Engineering',
    slug: 'prompt-engineering',
    definition: 'The art of crafting specific text instructions to guide an AI model to produce a desired visual outcome.',
    deepDive: 'Prompts aren\'t just words; they are weights. Using words like "8k," "highly detailed," or "cinematic lighting" tells the AI to prioritize those specific concepts in its latent space. Advanced prompt engineering involves using "Negative Prompts" to tell the AI what NOT to do (e.g., "no blurry eyes," "no extra fingers").',
    whyItMatters: 'For most AI tools, you have to be a Prompt Engineer to get good results. This is a massive barrier to entry for the average user.',
    howPicfomoUsesIt: 'We have **eliminated** prompt engineering for you. Our "Zero-Prompt" interface takes your simple choice (e.g., "Corporate") and automatically builds a 200-word expert prompt behind the scenes to ensure you get a world-class result every time.',
    relatedTerms: ['cfg-scale', 'latent-space', 'negative-prompt']
  },
  'upscaling': {
    term: 'Upscaling (4K Diffusion)',
    slug: 'upscaling',
    definition: 'The process of taking a low-resolution AI generation and adding intelligent detail to blow it up to 4K or 8K resolution.',
    deepDive: 'Standard AI generation usually happens at 1024x1024 pixels. If you just "stretch" this, it becomes blurry. Upscaling uses a second pass of the AI to "dream" in the missing pixels. It adds pores, eyelash details, and fabric textures that weren\'t there in the original, smaller image.',
    whyItMatters: 'Professional headshots need to be high-resolution for LinkedIn, printed resumes, or large website banners. Low-res AI photos look amateur.',
    howPicfomoUsesIt: 'Every PicFOMO "Final" generation goes through a 4X Hires-Fix pass. We don\'t just make the image bigger; we make it *better* by re-calculating the skin texture at the final resolution.',
    relatedTerms: ['sdxl', 'inference-steps', 'photorealism']
  }
};
