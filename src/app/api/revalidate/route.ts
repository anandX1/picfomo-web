import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';
import { acquireRevalidationLock, releaseRevalidationLock } from '@/lib/cache-throttle';

/**
 * PICFOMO CACHE PURGE ENGINE
 * Allows surgical invalidation of the Edge cache.
 * Securely protected by REVALIDATE_SECRET.
 */

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  const tag = searchParams.get('tag');
  const path = searchParams.get('path');

  // Security Gate
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    if (tag) {
      // 🌟 THROTTLE: Prevent concurrent revalidation storms
      const locked = await acquireRevalidationLock(tag);
      if (!locked) return NextResponse.json({ message: 'Revalidation already in progress' }, { status: 429 });

      try {
        (revalidateTag as any)(tag);
      } finally {
        await releaseRevalidationLock(tag);
      }
      
      return NextResponse.json({ revalidated: true, tag, now: Date.now() });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path, now: Date.now() });
    }

    // Default: Purge global hubs
    (revalidateTag as any)(CACHE_TAGS.styles);
    (revalidateTag as any)(CACHE_TAGS.posts);
    revalidatePath('/');
    revalidatePath('/explore');

    return NextResponse.json({ 
        revalidated: true, 
        message: 'Global hubs purged', 
        now: Date.now() 
    });

  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
