import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();
  return NextResponse.json({ message: `Hello, ${data.name}!` });
}

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name');
  if (name) {
    return NextResponse.json({ message: `Hello, ${name}!` });
  }

  return NextResponse.json({ message: 'Hello, World!' });
}

