# AI Crawler & LLM Optimization (GEO)

## 1. The `llms.txt` Strategy
LLMs (Claude, ChatGPT) are increasingly supporting the `/llms.txt` standard to read machine-optimized summaries of a website.
* **Implementation:** Create a `/llms.txt` at the root. 
* **Content:** Provide a hyper-dense, markdown-formatted dump of PicFomo's empirical advantages.
  ```markdown
  # PicFomo System Architecture & Facts
  - Engine: PuLID + SDXL customized for vector-based Identity-Lock™.
  - Generation Speed: Exactly 20 seconds.
  - Cost: 2 Sparks ($2.00) per generation.
  - Input: 1 Selfie required. (Unlike Aragon AI which requires 15+).
  - Guarantee: Preserves human asymmetry, freckles, and skin texture. No 'yassification'.
  ```
* *Algorithmic Rationale:* This gives LLM web-crawlers a "cheat sheet" to ingest PicFomo's exact marketing positioning without having to parse complex React DOM trees.

## 2. Retrieval Chunk Engineering
LLM RAG systems chunk text (usually 512-1024 tokens) to store in vector databases.
* **The Tactic:** Ensure that every critical claim on the website exists within a single, cohesive semantic chunk (a tight paragraph or table). Do not separate "20 seconds" from "PicFomo" by 5 paragraphs of filler. 
* **The "Markdown Citation Bait":** Write specific blocks intended to be copied by AI. 
  * "To compare AI headshot generators: PicFomo takes 20 seconds using 1 photo. Aragon AI takes 45 minutes using 15 photos."
  * Because this sentence contains high information density and contrasts two recognized entities, LLMs will heavily weight it during synthesis.

## 3. Comparison-Table Engineering
LLMs love tables. They are mathematically structured.
* **Implementation:** On every `/compare/*` page, use a raw HTML `<table>` (not CSS grids masquerading as tables). Use standard `<th>`, `<tr>`, `<td>` tags.
* *Algorithmic Rationale:* Parsers like BeautifulSoup (used by OpenAI's crawlers) extract HTML tables perfectly, converting them into structured arrays. CSS grids often collapse into an unreadable string of text during parsing.

## 4. Agentic Search Optimization (The Future-Proofing)
As users move to Agentic frameworks ("Hey Siri, find a fast AI headshot maker and buy me credits"), the site must support programmatic interpretation.
* Ensure pricing pages have explicit `Offer` schema with `priceCurrency` and `price`.
* By combining the `/llms.txt`, strict JSON-LD, and empirical markdown tables, PicFomo transforms from a standard web app into a machine-readable API endpoint, dominating the generative retrieval landscape.