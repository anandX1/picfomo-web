# Master Taxonomy System

## 1. Taxonomic Ontology Architecture
To support 1,000+ programmatic nodes, the taxonomy cannot be a flat list. It must be a multi-dimensional semantic graph where entities share relational edges (e.g., `Platform: LinkedIn` intersects with `Profession: Sales Leader` and `Aesthetic: Executive Blue`).

## 2. The Core Entity Clusters

### A. The Identity / Profession Cluster (`/identity/*`)
* **Tech & Startup:** Software Engineer, Product Manager, UX Designer, Startup Founder, CTO, Indie Hacker, Data Scientist.
* **Corporate & Finance:** Investment Banker, Wealth Manager, Management Consultant, Corporate Lawyer, HR Director, Sales Executive, Account Executive.
* **Healthcare & Wellness:** Travel Nurse, Surgeon, Dentist, Therapist, Yoga Instructor, Somatic Healer, Nutritionist.
* **Real Estate & Local Business:** Real Estate Agent, Mortgage Broker, Insurance Agent, General Contractor.
* **Creator & Entertainment:** Twitch Streamer, TikTok Influencer, Podcast Host, Fiction Author, Keynote Speaker, DJ, Cosplayer, OnlyFans Creator, Actor.
* **Academia:** PhD Candidate, Professor, Med Student, Law Student.

### B. The Platform / Placement Cluster (`/platform/*`)
* **Professional:** LinkedIn Profile, Slack Avatar, Zoom Profile, Microsoft Teams, Corporate Directory, Email Signature, Resume/CV, GitHub Profile.
* **Social / Viral:** Instagram Profile, TikTok Avatar, X/Twitter PFP, YouTube Banner, Discord Avatar, Reddit Avatar.
* **Dating:** Tinder Profile, Hinge Profile, Bumble Profile, Raya Profile.
* **Publishing:** Substack Bio, Medium Bio, Author Website, Speaker Media Kit.

### C. The Aesthetic / Vibe Cluster (`/aesthetic/*`)
* **Professional / Trust:** Executive Blue, Studio Grey, Crisp White, Natural Sunlight, Warm Office, Minimalist Corporate, Forbes Editorial.
* **Creative / Cinematic:** Cinematic Teal & Orange, Moody Studio, High Contrast B&W, Neon Noir, 35mm Film, Disposable Camera, Polaroids.
* **Lifestyle / Status:** Old Money Aesthetic, Quiet Luxury, Silicon Valley Casual, Coffee Shop Natural, Golden Hour.
* **Viral / Trends:** 90s Yearbook, Y2K Nostalgia, Cyberpunk, Mob Wife, Ghibli, Anime, Watercolor.

### D. The Emotional / Problem Cluster (`/problems/*`)
* **Urgency:** Last-minute headshot, instant professional photo, headshot needed today.
* **Insecurity/Friction:** Camera shy, unphotogenic, hate posing, blurry selfie fix, bad lighting fix, double chin fix, asymmetrical face.
* **Trust/Skepticism:** AI headshots that don't look fake, anti-yassification AI, AI portraits with real skin, non-plastic AI headshots.

## 3. Semantic Intersection Mapping (The Multiplier)
The true power of this taxonomy is intersection. 
* `Profession` x `Aesthetic` = *Cinematic Headshots for Actors*
* `Profession` x `Platform` = *LinkedIn Headshots for Software Engineers*
* `Aesthetic` x `Platform` = *Old Money Aesthetic for Tinder Profiles*

## 4. Database Representation (D1 Edge)
```sql
CREATE TABLE taxonomy_nodes (
    id TEXT PRIMARY KEY,
    type TEXT, -- 'profession', 'platform', 'aesthetic', 'problem'
    slug TEXT UNIQUE,
    canonical_name TEXT,
    parent_id TEXT NULL,
    semantic_vectors TEXT -- JSON array of related concepts for LLM context
);

CREATE TABLE taxonomy_edges (
    source_id TEXT,
    target_id TEXT,
    edge_type TEXT, -- 'intersects_with', 'requires_style'
    PRIMARY KEY (source_id, target_id)
);
```