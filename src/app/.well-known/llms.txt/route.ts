import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const baseUrl = "https://www.picfomo.com";
  return NextResponse.redirect(`${baseUrl}/llms.txt`, 301);
}
