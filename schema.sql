-- USERS (Synced with Clerk Webhook)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,        
  username TEXT UNIQUE NOT NULL,
  email TEXT, 
  display_name TEXT,
  profile_image_url TEXT, 
  bio TEXT,
  sparks_balance INTEGER DEFAULT 50,      
  plan TEXT DEFAULT 'free',     
  streak_days INTEGER DEFAULT 0,
  total_generations INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  flag_count INTEGER DEFAULT 0,        
  is_suspended BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SPARK TRANSACTIONS (Immutable ledger)
CREATE TABLE IF NOT EXISTS spark_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  amount INTEGER NOT NULL,              
  reason TEXT NOT NULL,                
  ref_id TEXT,                          
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- POSTS (Consolidated: every generation = a post)
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,            
  user_id TEXT NOT NULL REFERENCES users(id),
  image_url TEXT NOT NULL,               
  prompt_used TEXT,
  style_id TEXT NOT NULL,
  style_name TEXT,               
  is_public BOOLEAN DEFAULT 1,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  spark_cost INTEGER DEFAULT 10,
  upscaled BOOLEAN DEFAULT 0,
  watermarked BOOLEAN DEFAULT 1,
  input_deleted_at DATETIME,                  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES (Lightning fast loading)
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);

-- TASK COMPLETIONS
CREATE TABLE IF NOT EXISTS task_completions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  task_key TEXT NOT NULL,                 
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- LIKES
CREATE TABLE IF NOT EXISTS likes (
  user_id TEXT NOT NULL REFERENCES users(id),
  post_id TEXT NOT NULL REFERENCES posts(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, post_id)               
);

-- FOLLOWS
CREATE TABLE IF NOT EXISTS follows (
  follower_id TEXT NOT NULL REFERENCES users(id),
  following_id TEXT NOT NULL REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, following_id)
);

-- SAVES (bookmarks)
CREATE TABLE IF NOT EXISTS saves (
  user_id TEXT NOT NULL REFERENCES users(id),
  post_id TEXT NOT NULL REFERENCES posts(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, post_id)
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,                 
  message TEXT NOT NULL,
  ref_id TEXT,
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AUDIT LOG (DPDP compliance)
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,                
  detail TEXT,
  ip_hash TEXT,                          
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AI STYLES CATALOG (Admin managed)
CREATE TABLE IF NOT EXISTS styles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  preview_image_url TEXT,
  spark_cost INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT 1,
  badge TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Table to store the Bounties you create in the Admin Panel
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    reward_amount INTEGER NOT NULL DEFAULT 10,
    task_type TEXT NOT NULL, -- e.g., 'survey', 'link', 'input'
    action_url TEXT, -- If it's a link to follow Twitter, etc.
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table to track which users completed which tasks
CREATE TABLE IF NOT EXISTS user_tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    task_id TEXT NOT NULL,
    submitted_data TEXT, -- To store things like the survey slider value or email
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    UNIQUE(user_id, task_id) -- Prevents a user from doing the same task twice
);
-- Table to track successful referrals
CREATE TABLE IF NOT EXISTS referrals (
    id TEXT PRIMARY KEY,
    referrer_id TEXT NOT NULL,       -- The veteran user who shared the link
    referred_user_id TEXT NOT NULL,  -- The brand new user who just joined
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referred_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- INDEXING QUEUE (For Google/IndexNow background processing)
CREATE TABLE IF NOT EXISTS indexing_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,      -- 'style', 'user', 'post', etc.
    path TEXT NOT NULL,      -- '/style/ghibli'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);