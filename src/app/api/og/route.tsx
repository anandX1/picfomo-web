import { ImageResponse } from 'next/og';
import { getSinglePost } from '@/lib/db-queries';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (!postId) {
      return new Response('Missing Post ID', { status: 400 });
    }

    const post = await getSinglePost(postId);
    if (!post) {
      return new Response('Post Not Found', { status: 404 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#050505',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Main Container */}
          <div style={{ display: 'flex', width: '1200px', height: '630px', position: 'relative' }}>
            
            {/* Split Screen */}
            <div style={{ display: 'flex', width: '50%', height: '100%', position: 'relative', overflow: 'hidden' }}>
              {/* Selfie Side (Raw) */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' }}>
                 <div style={{ width: '300px', height: '400px', border: '2px dashed #444', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: '#444', fontSize: '24px', fontWeight: 'bold' }}>1 SELFIE</p>
                 </div>
              </div>
              <div style={{ position: 'absolute', bottom: '40px', left: '40px', display: 'flex', flexDirection: 'column' }}>
                <p style={{ color: '#aaa', fontSize: '14px', margin: 0, letterSpacing: '4px' }}>INPUT</p>
                <p style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>The Start.</p>
              </div>
            </div>

            <div style={{ display: 'flex', width: '50%', height: '100%', position: 'relative' }}>
              {/* Generated Side */}
              <img
                src={post.image_url}
                alt="PicFOMO Generation"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 40%)' }} />
              <div style={{ position: 'absolute', bottom: '40px', left: '40px', display: 'flex', flexDirection: 'column' }}>
                <p style={{ color: '#d4af37', fontSize: '14px', margin: 0, letterSpacing: '4px' }}>OUTPUT</p>
                <p style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>20 Seconds Later.</p>
              </div>
            </div>

            {/* Center Badge */}
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              color: 'black',
              padding: '12px 24px',
              borderRadius: '100px',
              fontSize: '20px',
              fontWeight: 'black',
              boxShadow: '0 0 40px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              PicFOMO ✨
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate OG image`, { status: 500 });
  }
}
