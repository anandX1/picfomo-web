interface CloudflareEnv {
  DB: D1Database;
  CACHE?: KVNamespace;
  IMAGES_BUCKET?: R2Bucket;
  GENERATION_QUEUE?: Queue;
}