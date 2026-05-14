# Graph Report - picfomo  (2026-05-14)

## Corpus Check
- 99 files · ~1,339,626 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1100 nodes · 1139 edges · 47 communities (36 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3c0961e4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]

## God Nodes (most connected - your core abstractions)
1. `verifyAdmin()` - 9 edges
2. `enqueueIndexing()` - 9 edges
3. `pingSitemaps()` - 9 edges
4. `PicFOMO Frontend UI & Style Guidelines` - 8 edges
5. `addStyle()` - 7 edges
6. `updateStyle()` - 6 edges
7. `drainIndexingQueue()` - 6 edges
8. `OpenNext Starter` - 6 edges
9. `ensureAdminColumns()` - 4 edges
10. `updateStylesOrder()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `Headers`  [INFERRED]
  src/app/api/webhooks/clerk/route.ts → worker-configuration.d.ts
- `POST()` --calls--> `drainIndexingQueue()`  [EXTRACTED]
  src/app/api/indexing/route.ts → src/utils/indexing.ts
- `addStyle()` --calls--> `enqueueIndexing()`  [EXTRACTED]
  src/actions/admin.ts → src/utils/indexing.ts
- `addStyle()` --calls--> `pingSitemaps()`  [EXTRACTED]
  src/actions/admin.ts → src/utils/indexing.ts
- `updateStyle()` --calls--> `enqueueIndexing()`  [EXTRACTED]
  src/actions/admin.ts → src/utils/indexing.ts

## Communities (47 total, 11 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.0
Nodes (804): AbortController, Ai_Cf_Ai4Bharat_Indictrans2_En_Indic_1B_Input, Ai_Cf_Ai4Bharat_Indictrans2_En_Indic_1B_Output, Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Async_Batch, Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_AsyncResponse, Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Chat_Completion_Response, Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Input, Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_JSON_Mode (+796 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (31): claimDailyLogin(), claimDividends(), completeTask(), deletePost(), likePost(), mockRemixPost(), processReferral(), purchasePrivacy() (+23 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (10): FAQS, FEED_ITEMS, HERO_IMAGES, MARQUEE_IMAGES, STEPS, CAROUSEL_ITEMS, PublicFunnelModal(), PublicFunnelModalProps (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (23): addStyle(), addTask(), deleteStyle(), deleteTask(), ensureAdminColumns(), styleSchema, taskSchema, toggleStyleActive() (+15 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (7): getNotifications(), markNotificationsAsRead(), fetchStoryStats(), metadata, viewport, DashboardLayout(), NotificationGroup

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (3): compressAndUploadImage(), metadata, NSFW_WORDS

### Community 6 - "Community 6"
Cohesion: 0.2
Nodes (9): 1. Aesthetic & Vibe (Luxury AI), 2. Typography, 3. UI Components (Structure & `cn` Utility), 4. Interactions & Animations, 5. Layout & Spacing, 6. CSS Specificity & Layering, code:typescript (import { cn } from "@/lib/utils";), graphify (+1 more)

### Community 7 - "Community 7"
Cohesion: 0.2
Nodes (9): code:bash (npm run dev), code:bash (npm run preview), code:bash (npm run deploy), Deploy, Develop, Getting Started, Learn More, OpenNext Starter (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.29
Nodes (4): REVIEWS_ROW_1, REVIEWS_ROW_2, SCROLL_ROW_1, SCROLL_ROW_2

### Community 10 - "Community 10"
Cohesion: 0.4
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 11 - "Community 11"
Cohesion: 0.4
Nodes (4): config, guestPass, isGenerateRoute, isProtectedRoute

### Community 12 - "Community 12"
Cohesion: 0.7
Nodes (4): generateSEOData(), pollPixazoStatus(), POST(), uploadBase64ToR2()

## Knowledge Gaps
- **870 isolated node(s):** `CloudflareEnv`, `__filename`, `__dirname`, `compat`, `eslintConfig` (+865 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Headers` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `pingSitemaps()` connect `Community 3` to `Community 1`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `CloudflareEnv`, `__filename`, `__dirname` to the rest of the system?**
  _870 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._